<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use PragmaRX\Google2FA\Google2FA;
use Tymon\JWTAuth\Facades\JWTAuth;


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
 public function enableTwoFactor()
{
    try {
        // شناسایی کاربر از توکن JWT
        $user = JWTAuth::parseToken()->authenticate();

        if (!$user) {
            return response()->json(['error' => 'کاربر احراز هویت نشده است'], 401);
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

        return response()->json([
            'message' => 'ورود دو مرحله‌ای با موفقیت فعال شد. لطفاً کلید مخفی یا QR Code را در Google Authenticator ثبت کنید.',
            'secret_key' => $secretKey,
            'qr_code_url' => $qrCodeUrl,
        ], 200);

    } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
        return response()->json(['error' => 'توکن نامعتبر است'], 401);
    } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
        return response()->json(['error' => 'توکن منقضی شده است'], 401);
    } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
        return response()->json(['error' => 'خطا در پردازش توکن'], 401);
    }
}
    /**
     * غیرفعال‌سازی ورود دو مرحله‌ای برای کاربر
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
  public function disableTwoFactor(Request $request)
{
    try {
        // شناسایی کاربر از توکن JWT
        $user = JWTAuth::parseToken()->authenticate();

        if (!$user) {
            return response()->json(['error' => 'کاربر احراز هویت نشده است'], 401);
        }

        // بررسی اینکه آیا 2FA برای کاربر فعال است یا نه
        if (!$user->two_factor_enabled) {
            return response()->json(['error' => 'ورود دو مرحله‌ای برای این کاربر فعال نیست'], 400);
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

    } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
        return response()->json(['error' => 'توکن نامعتبر است'], 401);
    } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
        return response()->json(['error' => 'توکن منقضی شده است'], 401);
    } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
        return response()->json(['error' => 'خطا در پردازش توکن'], 401);
    }
}
}