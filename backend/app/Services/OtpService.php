<?php

namespace App\Services;


use App\Models\Auth\Otp;
use App\Models\system\Setting;
use App\Models\User\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class OtpService
{
    /**
     * بررسی تعداد OTP‌های ساخته‌شده و ایجاد و ارسال OTP جدید
     *
     * @param User $user
     * @param string $identifier
     * @param string $idType
     * @return array
     */
     public function generateAndSendOtp(User $user, string $identifier, string $idType): array
    {
        $settings = Setting::first();
        if (!$settings) {
            Log::error('Settings not found');
            return ['error' => 'خطا در بارگذاری تنظیمات سیستم', 'status' => 500];
        }

        // بررسی تعداد OTP‌های ساخته‌شده برای کاربر
        $firstOtp = Otp::where('user_id', $user->id)
            ->orderBy('created_at', 'asc')
            ->first();

        if ($firstOtp) {
            $windowEnd = $firstOtp->created_at->addHours($settings->successful_otp_window_hours);
            if ($windowEnd->lessThan(Carbon::now())) {
                Log::info('OTP window expired, deleting old OTPs', [
                    'user_id' => $user->id,
                    'window_end' => $windowEnd->toDateTimeString(),
                ]);
                Otp::where('user_id', $user->id)->delete();
            } else {
                $otpCount = Otp::where('user_id', $user->id)
                    ->where('created_at', '>=', $firstOtp->created_at)
                    ->count();

                if ($otpCount >= $settings->max_successful_otp_attempts) {
                    $user->blocked_until = Carbon::now()->addHours(24);
                    $user->save();
                    Log::warning('User blocked due to too many OTP attempts', [
                        'user_id' => $user->id,
                        'identifier' => $identifier,
                        'otp_count' => $otpCount,
                    ]);
                    return [
                        'error' => str_replace('{lockout_hours}', 24, $settings['block_error_message']),
                        'status' => 429
                    ];
                }
            }
        }

        // ساخت و ارسال OTP
        try {
            // تولید کد OTP و توکن
            $otp = random_int(100000, 999999);
            $otpHash = Hash::make($otp);
            $otpToken = Str::uuid();
            $expiresAt = Carbon::now('UTC')->addMinutes($settings->otp_expiry_minutes ?? 5);
            $text = "Your OTP code is: $otp";

            // ذخیره OTP با توکن
            Otp::create([
                'user_id' => $user->id,
                'otp_hash' => $otpHash,
                'expires_at' => $expiresAt,
                'used' => false,
                'token' => $otpToken,
            ]);

            Log::info('OTP generated and stored', [
                'user_id' => $user->id,
                'otp_token' => $otpToken,
                'expires_at' => $expiresAt->toDateTimeString(),
            ]);

            // ارسال OTP به کاربر و به‌روزرسانی id_type
            if ($idType === 'email') {
                try {
                    Mail::raw("Your OTP code is: $otp", function ($message) use ($identifier) {
                        $message->to($identifier)->subject('Your OTP Code');
                    });
                    // به‌روزرسانی id_type برای ایمیل
                    $user->update(['id_type' => 0]);
                    Log::info('Email sent via Gmail SMTP and id_type updated', [
                        'identifier' => $identifier,
                        'id_type' => 0,
                    ]);
                } catch (\Exception $e) {
                    Log::error('Failed to send email via Gmail SMTP', [
                        'identifier' => $identifier,
                        'error' => $e->getMessage(),
                    ]);
                    return ['error' => 'خطا در ارسال ایمیل: ' . $e->getMessage(), 'status' => 500];
                }
            } else {
                try {
                    $smsResponse = Http::timeout(10)->post('https://console.melipayamak.com/api/send/simple/16ab4dcb74e5400b81fb3eb028ff0cec', [
                        'from' => env('SMS_LINE_NUMBER'),
                        'to' => $identifier,
                        'text' => $text,
                    ]);

                    if ($smsResponse->successful()) {
                        // به‌روزرسانی id_type برای موبایل
                        $user->update(['id_type' => 1]);
                        Log::info('OTP sent via SMS and id_type updated', [
                            'identifier' => $identifier,
                            'id_type' => 1,
                            'response' => $smsResponse->body(),
                        ]);
                    } else {
                        Log::error('Failed to send OTP via SMS', [
                            'identifier' => $identifier,
                            'status' => $smsResponse->status(),
                            'body' => $smsResponse->body(),
                            'headers' => $smsResponse->headers(),
                        ]);
                        return ['error' => 'خطا در ارسال کد تأیید', 'status' => 500];
                    }
                } catch (\Exception $e) {
                    Log::error('Exception in sending OTP via SMS', [
                        'identifier' => $identifier,
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString(),
                    ]);
                    return ['error' => 'خطا در ارسال کد تأیید: ' . $e->getMessage(), 'status' => 500];
                }
            }

            return [
                'message' => 'کد OTP ارسال شد',
                'otp_token' => $otpToken,
                'expires_at' => $expiresAt->toIso8601String(),
                'status' => 200
            ];
        } catch (\Exception $e) {
            Log::error('Failed to generate or send OTP', [
                'identifier' => $identifier,
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
            return ['error' => 'خطا در پردازش کد OTP', 'status' => 500];
        }
    }
}