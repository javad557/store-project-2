<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Auth\FailedAttempt;
use App\Models\Auth\LoginAttempt;
use App\Models\Auth\Otp;
use App\Models\Auth\RecoveryOtp;
use App\Models\system\Setting;
use App\Models\User\User;
use App\Services\OtpService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Melipayamak\MelipayamakApi;
use PragmaRX\Google2FA\Google2FA;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;

class AuthController extends Controller
{
    protected $google2fa;

    public function __construct()
    {
        $this->google2fa = new Google2FA();
    }

public function sendOtp(Request $request)
{
    $authHeader = $request->header('Authorization', 'هدر Authorization ارسال نشده');
        Log::info('Authorization Header', [
            'url' => $request->fullUrl(),
            'method' => $request->method(),
            'authorization' => $authHeader,
        ]);
    // لاگ اولیه مقادیر
    Log::info('sendOtp request received', [
        'identifier' => $request->input('identifier'),
        'fingerprint' => $request->input('fingerprint'),
    ]);

    // اعتبارسنجی اولیه مقادیر
    $validator = Validator::make($request->all(), [
        'identifier' => [
            'required',
            'string',
            'regex:/^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|09[0-9]{9})$/',
        ],
        'fingerprint' => ['required'],
        'recaptcha_token' => ['required'],
    ], [
        'identifier.required' => 'ایدی الزامی است',
        'identifier.regex' => 'ایدی یک فرمت معتبر نیست',
        'fingerprint.required' => 'شناسه دستگاه الزامی است',
        'recaptcha_token.required' => 'ریکپچا الزامی است',
    ]);

    if ($validator->fails()) {
        Log::warning('Validation failed', ['errors' => $validator->errors()->toArray()]);
        return response()->json([
            'error' => $validator->errors()->first()
        ], 422);
    }

    $identifier = $request->input('identifier');
    $fingerprint = $request->input('fingerprint');
    $recaptchaToken = $request->input('recaptcha_token');
    $secretKey = env('RECAPTCHA_SECRET_KEY');
    $settings = Setting::first();

    // بررسی وجود تنظیمات
    if (!$settings) {
        Log::error('Settings not found');
        return response()->json(['error' => 'خطا در بارگذاری تنظیمات سیستم'], 500);
    }

    // پیدا کردن یا ساختن یک رکورد برای دستگاه
    $attempt = LoginAttempt::where('system_info', $fingerprint)->first();

    if (!$attempt) {
        $attempt = LoginAttempt::create([
            'system_info' => $fingerprint,
            'attempt_count' => 1,
        ]);
    }

    // بررسی بلاک بودن دستگاه
    if ($attempt->blocked_until && Carbon::now()->lessThan($attempt->blocked_until)) {
        $remainingTime = Carbon::now()->diffInHours($attempt->blocked_until);
        Log::warning('Device is blocked', [
            'system_info' => $fingerprint,
            'identifier' => $identifier,
            'remaining_time' => $remainingTime,
        ]);
        return response()->json([
            'error' => str_replace('{lockout_hours}', $remainingTime, $settings['too_many_attempts_error']),
        ], 429);
    }

//     // بررسی reCAPTCHA
//   $response = Http::asForm()->post('https://www.recaptcha.net/recaptcha/api/siteverify', [
//     'secret' => $secretKey,
//     'response' => $recaptchaToken,
// ]);
//     $recaptchaResult = $response->json();

//     if (!$recaptchaResult['success'] || (isset($recaptchaResult['score']) && $recaptchaResult['score'] < 0.5)) {
//         Log::warning('reCAPTCHA verification failed', [
//             'fingerprint' => $fingerprint,
//             'identifier' => $identifier,
//             'score' => $recaptchaResult['score'] ?? 'N/A',
//             'error_codes' => $recaptchaResult['error-codes'] ?? [],
//         ]);
//         return response()->json(['error' => 'رفتار شما مشکوک به ربات تشخیص داده شد! لطفاً دوباره تلاش کنید.'], 403);
//     }

    // شمارش تلاش‌ها
    if ($attempt->created_at->addHours($settings->attempt_window_hours)->lessThan(Carbon::now())) {
        $attempt->attempt_count = 1;
        $attempt->created_at = Carbon::now();
    } else {
        $attempt->attempt_count += 1;
    }
    $attempt->save();

    // بررسی تعداد درخواست‌های ورود و بلاک کردن دستگاه
    if ($attempt->attempt_count > $settings->max_attempts_per_identifier) {
        $attempt->blocked_until = Carbon::now()->addHours(24);
        $attempt->save();
        Log::warning('Device blocked due to too many attempts', [
            'fingerprint' => $fingerprint,
            'identifier' => $identifier,
            'attempts' => $attempt->attempt_count,
        ]);
        return response()->json([
            'error' => str_replace('{lockout_hours}', 24, $settings['too_many_attempts_error']),
        ], 429);
    }

    // پیدا کردن یا ساختن کاربر
    $id = filter_var($identifier, FILTER_VALIDATE_EMAIL) ? 'email' : 'mobile';
    $user = User::where($id, $identifier)->first() ?? User::create([$id => $identifier]);

    // بررسی بلاک بودن کاربر
    if ($user->blocked_until && Carbon::now()->lessThan($user->blocked_until)) {
        $remainingTimeInHour = Carbon::now()->diffInHours($user->blocked_until);
        $remainingTimeInMinute = Carbon::now()->diffInMinutes($user->blocked_until);

        $errorMessage = $remainingTimeInHour > 0
            ? str_replace('{lockout_hours}', $remainingTimeInHour, $settings['block_error_message'])
            : "حساب کاربری شما برای مدت $remainingTimeInMinute دقیقه مسدود شده است";
        return response()->json([
            'error' => $errorMessage
        ], 429);
    }

    // استفاده از سرویس برای تولید و ارسال OTP
    $otpService = new OtpService();
    $result = $otpService->generateAndSendOtp($user, $identifier, $id);

    return response()->json(
        array_key_exists('error', $result) ? ['error' => $result['error']] : $result,
        $result['status']
    );
}


    public function resendOtp(Request $request)
    {
        // اعتبارسنجی اولیه
        $validator = Validator::make($request->all(), [
            'otp_token' => ['required', 'string'],
        ], [
            'otp_token.required' => 'توکن OTP الزامی است',
        ]);

        if ($validator->fails()) {
            Log::warning('Validation failed', ['errors' => $validator->errors()->toArray()]);
            return response()->json([
                'error' => $validator->errors()->first()
            ], 422);
        }

        $otpToken = $request->input('otp_token');

        // پیدا کردن OTP و کاربر مرتبط
        $otp = Otp::where('token', $otpToken)->first();

        if (!$otp) {
            Log::warning('OTP token not found', ['otp_token' => $otpToken]);
            return response()->json(['error' => 'توکن OTP نامعتبر است'], 404);
        }

        $user = User::find($otp->user_id);

        if (!$user) {
            Log::warning('User not found for OTP token', ['otp_token' => $otpToken]);
            return response()->json(['error' => 'کاربر یافت نشد'], 404);
        }

        // بررسی بلاک بودن کاربر
        if ($user->blocked_until && Carbon::now()->lessThan($user->blocked_until)) {
            $settings = Setting::first();
            $remainingTimeInHour = Carbon::now()->diffInHours($user->blocked_until);
            $remainingTimeInMinute = Carbon::now()->diffInMinutes($user->blocked_until);

            $errorMessage = $remainingTimeInHour > 0
                ? str_replace('{lockout_hours}', $remainingTimeInHour, $settings['block_error_message'])
                : "حساب کاربری شما برای مدت $remainingTimeInMinute دقیقه مسدود شده است";
            return response()->json([
                'error' => $errorMessage
            ], 429);
        }

        // پیدا کردن identifier و نوع آن (ایمیل یا موبایل)
        $identifier = $user->email ?? $user->mobile;
        $idType = $user->email ? 'email' : 'mobile';

        // استفاده از سرویس برای تولید و ارسال OTP
        $otpService = new OtpService();
        $result = $otpService->generateAndSendOtp($user, $identifier, $idType);

        return response()->json(
            array_key_exists('error', $result) ? ['error' => $result['error']] : $result,
            $result['status']
        );
    }


     public function verifyOtp(Request $request)
    {
       
        $otpToken = $request->input('otp_token');
        $otp = $request->input('otp');
   
        // پیدا کردن OTP
        $otpRecord = Otp::where('token', $otpToken)
            ->where('used', false)
            ->first();

        if (!$otpRecord) {
            Log::warning('Invalid or used OTP token', ['otp_token' => $otpToken]);
            return response()->json(['error' => 'توکن OTP نامعتبر یا استفاده‌شده است'], 404);
        }

        // بررسی انقضای OTP
        if (Carbon::now()->greaterThan($otpRecord->expires_at)) {
            Log::warning('OTP expired', ['otp_token' => $otpToken]);
            return response()->json(['error' => 'کد OTP منقضی شده است'], 410);
        }

        // پیدا کردن کاربر
        $user = User::find($otpRecord->user_id);

        if (!$user) {
            Log::warning('User not found for OTP', ['otp_token' => $otpToken]);
            return response()->json(['error' => 'کاربر یافت نشد'], 404);
        }

        // بررسی تطابق کد OTP
        if (!Hash::check($otp, $otpRecord->otp_hash)) {
             $recoveryOtp = RecoveryOtp::where('user_id', $user->id)
            ->where('token', $otp)
            ->where('used', false)
            ->first();

        if ($recoveryOtp) {
            $isRecoveryOtpValid = true;
            // علامت‌گذاری رمز یک‌بارمصرف به عنوان استفاده‌شده
            $recoveryOtp->used = true;
            $recoveryOtp->save();
            Log::info('Recovery OTP verified successfully', [
                'user_id' => $user->id,
                'recovery_token' => $otp,
            ]);
        }
        else{
              // ثبت تلاش ناموفق
            FailedAttempt::create([
                'user_id' => $user->id,
                'attempt_type' => 'otp',
            ]);

            // گرفتن تنظیمات
            $settings = Setting::first();
            $attemptWindowHours = $settings ? ($settings->otpand2fa_attempt_window_hours ?: 24) : 24;
            $maxAttempts = $settings ? ($settings->max_otpand2fa_attempts ?: 5) : 5;
            $blockDurationHours = $settings ? ($settings->otpand2fa_block_duration_hours ?: 1) : 1;
            $blockErrorMessage = $settings ? ($settings->block_error_message ?: 'حساب شما به دلیل تلاش‌های ناموفق زیاد موقتاً مسدود شده است') : 'حساب شما به دلیل تلاش‌های ناموفق زیاد موقتاً مسدود شده است';

            // گرفتن اولین تلاش ناموفق
            $firstFailedAttempt = FailedAttempt::where('user_id', $user->id)
                ->where('attempt_type', 'otp')
                ->orderBy('created_at', 'asc')
                ->first();

            // بررسی بازه زمانی
            if ($firstFailedAttempt && Carbon::parse($firstFailedAttempt->created_at)->addHours($attemptWindowHours)->lessThanOrEqualTo(Carbon::now())) {
                // پاک کردن تمام تلاش‌های ناموفق قدیمی
                FailedAttempt::where('user_id', $user->id)
                    ->where('attempt_type', 'otp')
                    ->delete();
                     // ثبت تلاش ناموفق
                FailedAttempt::create([
                   'user_id' => $user->id,
                   'attempt_type' => 'otp',
                ]);
                Log::info('Old otp failed attempts cleared', ['user_id' => $user->id]);
            }

            // شمارش تلاش‌های ناموفق در بازه زمانی
            $failedAttempts = FailedAttempt::where('user_id', $user->id)
                ->where('attempt_type', 'otp')
                ->where('created_at', '>=', Carbon::now()->subHours($attemptWindowHours))
                ->count();

            // بررسی بلاک کردن کاربر
            if ($failedAttempts >= $maxAttempts) {

                $user->update([
                    'is_blocked' => true,
                    'blocked_until' => Carbon::now()->addHours($blockDurationHours),
                ]);
                
                Log::warning('User blocked due to too many failed otp attempts', [
                    'user_id' => $user->id,
                    'failed_attempts' => $failedAttempts,
                ]);

                $remainingTimeInHour = Carbon::now()->diffInHours($user->blocked_until);
                $remainingTimeInMinute = Carbon::now()->diffInMinutes($user->blocked_until);
                $errorMessage = $remainingTimeInHour > 0
                ? str_replace('{lockout_hours}', $remainingTimeInHour, $settings['block_error_message'])
                : "حساب کاربری شما برای مدت $remainingTimeInMinute دقیقه مسدود شده است";
                return response()->json([
                    'error' => $errorMessage,
                    'redirect_to' => 'loginregister',
            ], 429);
            }

            Log::warning('Invalid 2FA code', [
                'user_id' => $user->id,
                'two_factor_code' => $otp,
            ]);

            $errorMessage = $settings->otp_error_message . "  تعداد تلاش های باقیمانده : " . $maxAttempts-$failedAttempts;
            Log::warning('Invalid OTP code', ['otp_token' => $otpToken]);
            return response()->json(['error' => $errorMessage], 401);
        }
        }
        else{
                  // علامت‌گذاری OTP به عنوان استفاده‌شده
        $otpRecord->used = true;
        $otpRecord->save();
        $user->failedAttempts()->delete();

        }


  // بررسی نوع ایدی و وضعیت تأیید
        $idType = $user->id_type === 0 ? 'email_veryfied_at' : ($user->id_type === 1 ? 'mobile_veryfied_at' : null);
        if ($idType === null) {
            Log::error('Invalid id_type for user', ['user_id' => $user->id, 'id_type' => $user->id_type]);
            return response()->json(['error' => 'نوع ایدی نامعتبر است'], 400);
        }

        $verifiedColumn = $idType . '_verified_at';
        $isVerified = !is_null($user->$verifiedColumn);

        if ($user->$idType == null) {
            // ثبت تاریخ تأیید
            $user->update([
                $idType => Carbon::now(),
            ]);

            // دریافت تعداد رمزهای یک‌بارمصرف
            $otpCount = Setting::first()->one_time_password_count ?? 5;
            if (!$otpCount) {
                Log::warning('one_time_password_count not found in settings, using default', ['default' => 5]);
            }

            // تولید و ذخیره رمزهای یک‌بارمصرف
            for ($i = 0; $i < $otpCount; $i++) {
                $recoveryCode = str_pad(mt_rand(0, 9999999999), 10, '0', STR_PAD_LEFT);
                RecoveryOtp::create([
                    'user_id' => $user->id,
                    'token' => $recoveryCode,
                    'used' => 0,
                ]);
            }

            Log::info('OTP verified, user registered, recovery codes generated', [
                'user_id' => $user->id,
                'otp_token' => $request->otp_token,
                'id_type' => $idType,
            ]);

            return response()->json([
                'message' => 'ثبت‌نام با موفقیت تکمیل شد، به صفحه رمزهای یک‌بارمصرف هدایت می‌شوید',
                'redirect_to' => 'recovery_codes',
            ], 200);
        }


       // بررسی ورود دو مرحله‌ای
    if ($user->two_factor_enabled === 1) {
        Log::info('2FA required for user', ['user_id' => $user->id]);
        return response()->json([
            'message' => 'ورود دو مرحله‌ای مورد نیاز است',
            'redirect_to' => 'two_factor',
        ], 200);
    }

    // اجرای متد لاگین در صورت غیرفعال بودن 2FA
    Log::info('Proceeding with login for user without 2FA', ['user_id' => $user->id]);
   $loginRequest = Request::create('/api/auth/login', 'POST', ['otp_token' => $otpToken]);
return $this->login($loginRequest);
    }


    public function getRecoveryCodes(Request $request)
    {
        $request->validate([
            'otp_token' => 'required|string',
        ]);

        // پیدا کردن OTP برای اعتبارسنجی
        $otpRecord = Otp::where('token', $request->otp_token)
            ->where('used', true) // فقط OTPهای استفاده‌شده معتبرن
            ->first();

        if (!$otpRecord) {
            Log::warning('Invalid or unused OTP token for recovery codes', ['otp_token' => $request->otp_token]);
            return response()->json(['error' => 'توکن نامعتبر است'], 404);
        }

        // دریافت رمزهای یک‌بارمصرف
        $recoveryCodes = RecoveryOtp::where('user_id', $otpRecord->user_id)
            ->where('used', 0)
            ->pluck('token'); // استفاده از ستون token به‌جای raw_token

        if ($recoveryCodes->isEmpty()) {
            Log::warning('No recovery codes found for user', ['user_id' => $otpRecord->user_id]);
            return response()->json(['error' => 'رمزهای یک‌بارمصرف یافت نشد'], 404);
        }

        Log::info('Recovery codes retrieved', ['user_id' => $otpRecord->user_id, 'otp_token' => $request->otp_token]);

        return response()->json([
            'message' => 'رمزهای یک‌بارمصرف با موفقیت دریافت شدند',
            'recovery_codes' => $recoveryCodes,
        ], 200);
    }


        public function verifyTwoFactor(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'otp_token' => 'required|string',
            'two_factor_code' => 'required|string|digits:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'ورودی نامعتبر است'], 400);
        }

        $otpToken = $request->input('otp_token');
        $twoFactorCode = $request->input('two_factor_code');

        // پیدا کردن OTP
        $otpRecord = Otp::where('token', $otpToken)->first();
        if (!$otpRecord) {
            return response()->json(['error' => 'توکن نامعتبر یا منقضی شده است'], 404);
        }

        // پیدا کردن کاربر
        $user = User::find($otpRecord->user_id);
        if (!$user) {
            return response()->json(['error' => 'کاربر یافت نشد'], 404);
        }

        Log::info('2FAtest',['user'=>$user->id,'token'=>$otpToken,'2facode'=>$twoFactorCode]);
        // بررسی کد دو عاملی
        $isValid = $this->google2fa->verifyKey($user->two_factor_secret, $twoFactorCode);
        if (!$isValid) {

            // ثبت تلاش ناموفق
            FailedAttempt::create([
                'user_id' => $user->id,
                'attempt_type' => 'two_factor',
                'ip_address' => $request->ip(),
            ]);

            // گرفتن تنظیمات
            $settings = Setting::first();
            $attemptWindowHours = $settings ? ($settings->otpand2fa_attempt_window_hours ?: 24) : 24;
            $maxAttempts = $settings ? ($settings->max_otpand2fa_attempts ?: 5) : 5;
            $blockDurationHours = $settings ? ($settings->otpand2fa_block_duration_hours ?: 1) : 1;
            $blockErrorMessage = $settings ? ($settings->block_error_message ?: 'حساب شما به دلیل تلاش‌های ناموفق زیاد موقتاً مسدود شده است') : 'حساب شما به دلیل تلاش‌های ناموفق زیاد موقتاً مسدود شده است';

            // گرفتن اولین تلاش ناموفق
            $firstFailedAttempt = FailedAttempt::where('user_id', $user->id)
                ->where('attempt_type', 'two_factor')
                ->orderBy('created_at', 'asc')
                ->first();

            // بررسی بازه زمانی
            if ($firstFailedAttempt && Carbon::parse($firstFailedAttempt->created_at)->addHours($attemptWindowHours)->lessThanOrEqualTo(Carbon::now())) {
                // پاک کردن تمام تلاش‌های ناموفق قدیمی
                FailedAttempt::where('user_id', $user->id)
                    ->where('attempt_type', 'two_factor')
                    ->delete();
                     // ثبت تلاش ناموفق
                FailedAttempt::create([
                   'user_id' => $user->id,
                   'attempt_type' => 'two_factor',
                   'ip_address' => $request->ip(),
                ]);
                Log::info('Old 2FA failed attempts cleared', ['user_id' => $user->id]);
            }

            // شمارش تلاش‌های ناموفق در بازه زمانی
            $failedAttempts = FailedAttempt::where('user_id', $user->id)
                ->where('attempt_type', 'two_factor')
                ->where('created_at', '>=', Carbon::now()->subHours($attemptWindowHours))
                ->count();

            // بررسی بلاک کردن کاربر
            if ($failedAttempts >= $maxAttempts) {
                $user->update([
                    'is_blocked' => true,
                    'blocked_until' => Carbon::now()->addHours($blockDurationHours),
                ]);
                Log::warning('User blocked due to too many failed 2FA attempts', [
                    'user_id' => $user->id,
                    'failed_attempts' => $failedAttempts,
                ]);

                $remainingTimeInHour = Carbon::now()->diffInHours($user->blocked_until);
                $remainingTimeInMinute = Carbon::now()->diffInMinutes($user->blocked_until);
                $errorMessage = $remainingTimeInHour > 0
                ? str_replace('{lockout_hours}', $remainingTimeInHour, $settings['block_error_message'])
                : "حساب کاربری شما برای مدت $remainingTimeInMinute دقیقه مسدود شده است";
                return response()->json([
                    'error' => $errorMessage
            ], 429);
            }

            Log::warning('Invalid 2FA code', [
                'user_id' => $user->id,
                'two_factor_code' => $twoFactorCode,
            ]);

             $errorMessage = $settings->twofa_error_message . "  تعداد تلاش های باقیمانده : " . $maxAttempts-$failedAttempts;

            return response()->json(['error' => $errorMessage], 401);
        }
        // اجرای متد لاگین
           $loginRequest = Request::create('/api/auth/login', 'POST', ['otp_token' => $otpToken]);
           return $this->login($loginRequest);
    }


     public function login(Request $request)
    {
        $token = $request->input('otp_token');

        // جستجوی token در جدول otps
        $otpRecord = Otp::where('token', $token)->first();

        // یافتن کاربر مرتبط
        $user = User::find($otpRecord->user_id);

        if (!$user) {
            return response()->json([
                'message' => 'کاربر یافت نشد',
            ], 404);
        }
        
        try {
            // تولید توکن JWT
            $authToken = JWTAuth::fromUser($user);
            Log::info('logintest',['logintest'=>$authToken]);

            // پاسخ به فرانت‌اند
            return response()->json([
                'message' => 'ورود با موفقیت انجام شد',
                'auth_token' => $authToken,
                'is_admin' => $user->is_admin,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'خطا در تولید توکن JWT',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


public function logout(Request $request)
{
    try {
        // استخراج توکن از درخواست
        $token = JWTAuth::getToken();
        
        if ($token) {
            // باطل کردن توکن JWT
            JWTAuth::invalidate($token);
        }
        
        return response()->json([
            'message' => 'با موفقیت از سیستم خارج شدید',
        ], 200);
    } catch (TokenExpiredException $e) {
        // اگر توکن منقضی شده، باز هم پاسخ موفقیت برگردون
        return response()->json([
            'message' => 'با موفقیت از سیستم خارج شدید',
        ], 200);
    } catch (TokenInvalidException $e) {
        // اگر توکن نامعتبره
        return response()->json([
            'message' => 'توکن نامعتبر است',
        ], 401);
    } catch (\Exception $e) {
        Log::error('Error during logout: ' . $e->getMessage(), [
            'stack' => $e->getTraceAsString(),
        ]);
        return response()->json([
            'message' => 'خطا در خروج از سیستم',
            'error' => $e->getMessage(),
        ], 500);
    }
}
}
