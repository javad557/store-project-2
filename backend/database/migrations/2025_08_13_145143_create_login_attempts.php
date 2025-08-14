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
        
        
Schema::create('login_attempts', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null'); // کلید خارجی به جدول users
    $table->string('ip', 45)->index(); // آدرس IP
    $table->text('system_info')->nullable(); // مشخصات سیستم
    $table->unsignedInteger('attempt_count')->default(0); // تعداد تلاش‌ها
    $table->unsignedInteger('incorrect_otp')->default(0); // تعداد تلاش‌های OTP اشتباه
    $table->unsignedInteger('incorrect_2fa')->default(0); // تعداد تلاش‌های 2FA اشتباه
    $table->boolean('is_failed')->default(false); // true برای OTP یا 2FA اشتباه
    $table->timestamp('block_start_at')->nullable(); // زمان شروع بلاک
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('login_attempts');
    }
};
