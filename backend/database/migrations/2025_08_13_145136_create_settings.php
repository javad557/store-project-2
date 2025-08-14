<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {

    $table->id();
    $table->text('login_page_description')->nullable()->default('لطفاً ایمیل یا شماره تلفن خود را وارد کنید');
    $table->text('too_many_attempts_error')->nullable()->default('تعداد درخواست‌ها بیش از حد است، {lockout_minutes} دقیقه صبر کنید');
    $table->unsignedInteger('max_attempts_per_identifier')->default(5); // تعداد تلاش ایدی
    $table->unsignedInteger('attempt_window_hours')->default(1); // بازه زمانی تلاش ایدی
    $table->unsignedInteger('max_otpand2fa_attempts')->default(3); // تعداد تلاش OTP اشتباه
    $table->unsignedInteger('otpand2fa_attempt_window_hours')->default(24); // بازه زمانی OTP اشتباه
    $table->text('otp_error_message')->nullable()->default('کد اشتباه است، {remaining_attempts} تلاش دیگر دارید');
    $table->text('block_error_message')->nullable()->default('حساب برای {lockout_minutes} دقیقه قفل شد');
    $table->unsignedInteger('otpand2fa_block_duration_hours')->default(24); // مدت بلاک OTP
    $table->unsignedInteger('otp_expiry_minutes')->default(5); // مدت بلاک OTP
    $table->text('otp_page_description')->nullable()->default('کد تأیید ارسال‌شده به ایمیل/شماره خود را وارد کنید');
    $table->text('one_time_password_page_description')->nullable()->default('رمزهای یک‌بارمصرف خود را ذخیره کنید');
    $table->unsignedInteger('one_time_password_count')->default(5); // تعداد رمزهای یک‌بارمصرف
    $table->unsignedInteger('otp_retry_delay_seconds')->default(5); // تأخیر ارسال مجدد OTP
    $table->unsignedInteger('max_successful_otp_attempts')->default(15); // تعداد ورودهای موفق
    $table->unsignedInteger('successful_otp_window_hours')->default(24); // بازه زمانی ورودهای موفق
    $table->text('too_many_successful_logins_error')->nullable()->default('تعداد ورودهای شما بیش از حد است، {lockout_hours} ساعت صبر کنید');
    $table->text('2fa_page_description')->nullable()->default('کد دو عاملی خود را وارد کنید');
     $table->text('2fa_error_message')->nullable()->default('کد اشتباه است، {remaining_attempts} تلاش دیگر دارید');
    $table->timestamps();

});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
