public function verifyOtp(Request $request)
{
    $otpToken = $request->input('otp_token');
    $otp = $request->input('otp');

    // پیدا(Frame کردن OTP
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
    $isOtpValid = Hash::check($otp, $otpRecord->otp_hash);
    $isRecoveryOtpValid = false;
    $recoveryOtp = null;

    // اگر کد OTP مطابقت نداشت، بررسی رمزهای یک‌بارمصرف
    if (!$isOtpValid) {
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
    }

    // اگر نه OTP معمولی و نه رمز یک‌بارمصرف معتبر بود
    if (!$isOtpValid && !$isRecoveryOtpValid) {
        Log::warning('Invalid OTP or Recovery OTP code', ['otp_token' => $otpToken, 'otp' => $otp]);
        return response()->json(['error' => 'کد OTP یا رمز یک‌بارمصرف نامعتبر است'], 401);
    }

    // علامت‌گذاری OTP معمولی به عنوان استفاده‌شده (اگر از OTP استفاده شده باشد)
    if ($isOtpValid) {
        $otpRecord->used = true;
        $otpRecord->save();
        Log::info('OTP verified successfully', ['user_id' => $user->id, 'otp_token' => $otpToken]);
    }

    // بررسی نوع ایدی و وضعیت تأیید
    $idType = $user->id_type === 0 ? 'email_verified_at' : ($user->id_type === 1 ? 'mobile_verified_at' : null);
    if ($idType === null) {
        Log::error('Invalid id_type for user', ['user_id' => $user->id, 'id_type' => $user->id_type]);
        return response()->json(['error' => 'نوع ایدی نامعتبر است'], 400);
    }

    $verifiedColumn = $idType;
    $isVerified = !is_null($user->$verifiedColumn);

    if (!$isVerified) {
        Log::info('testisVerified',['user'=>$user,'idType'=>$verifiedColumn,'now'=>Carbon::now()]);
        // ثبت تاریخ تأیید
        $user->update([
            $verifiedColumn => Carbon::now(),
        ]);

        // دریافت تعداد رمزهای یک‌بارمصرف
        $otpCount = Setting::first()->one_time_password_count ?? 5;
        if (!$otpCount) {
            Log::warning('one_time_password_count not found in settings, using default', ['default' => 5]);
        }

        // تولید و ذخیره رمزهای یک‌بارمصرف
        for ($i = 0; $i < $otpCount; $i++) {
            $recoveryCode = str_pad(mt_rand(0, 9999999999),10, '0', STR_PAD_LEFT);
            RecoveryOtp::create([
                'user_id' => $user->id,
                'token' => $recoveryCode,
                'used' => 0,
            ]);
        }

        Log::info('OTP verified, user registered, recovery codes generated', [
            'user_id' => $user->id,
            'otp_token' => $otpToken,
            'id_type' => $idType,
        ]);

        return response()->json([
            'message' => 'ثبت‌نام با موفقیت تکمیل شد، به صفحه رمزهای یک‌بارمصرف هدایت می‌شوید',
            'redirect_to' => 'recovery_codes',
        ], 200);
    }

    // بررسی ورود دو مرحله‌ای
    if ($user->two_factor_enabled) {
        Log::info('2FA required for user', ['user_id' => $user->id]);
        return response()->json([
            'message' => 'ورود دو مرحله‌ای مورد نیاز است',
            'redirect_to' => 'two_factor',
        ], 200);
    }

    // اجرای متد لاگین در صورت غیرفعال بودن 2FA
    Log::info('Proceeding with login for user without 2FA', ['user_id' => $user->id]);
    return $this->login($user);
}