<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use PragmaRX\Google2FA\Google2FA;

class TwoFactorController extends Controller
{
    protected $google2fa;

    public function __construct()
    {
        $this->google2fa = new Google2FA();
    }

    /**
     * فعال‌سازی ورود دو مرحله‌ای برای کاربر
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function enableTwoFactor(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer|exists:users,id',
        ]);

        $user = User::find($request->user_id);
        if (!$user) {
            return response()->json(['error' => 'کاربر یافت نشد'], 404);
        }

        // تولید کلید مخفی
        $secretKey = $this->google2fa->generateSecretKey();

        // ذخیره کلید مخفی و فعال‌سازی 2FA
        $user->update([
            'two_factor_secret' => $secretKey,
            'two_factor_enabled' => true,
        ]);

        // تولید URL برای QR Code
        $qrCodeUrl = $this->google2fa->getQRCodeUrl(
            config('app.name'), // نام اپلیکیشن
            $user->email ?: $user->mobile, // شناسه کاربر
            $secretKey
        );

        Log::info('2FA enabled for user', [
            'user_id' => $user->id,
            'secret_key' => $secretKey,
        ]);

        return response()->json([
            'message' => 'ورود دو مرحله‌ای با موفقیت فعال شد. لطفاً کلید مخفی یا QR Code را در Google Authenticator ثبت کنید.',
            'secret_key' => $secretKey,
            'qr_code_url' => $qrCodeUrl,
        ], 200);
    }

    /**
     * غیرفعال‌سازی ورود دو مرحله‌ای برای کاربر
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function disableTwoFactor(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer|exists:users,id',
        ]);

        $user = User::find($request->user_id);
        if (!$user) {
            return response()->json(['error' => 'کاربر یافت نشد'], 404);
        }

        // حذف کلید مخفی و غیرفعال کردن 2FA
        $user->update([
            'two_factor_secret' => null,
            'two_factor_enabled' => false,
        ]);

        Log::info('2FA disabled for user', ['user_id' => $user->id]);

        return response()->json([
            'message' => 'ورود دو مرحله‌ای با موفقیت غیرفعال شد.',
        ], 200);
    }
}