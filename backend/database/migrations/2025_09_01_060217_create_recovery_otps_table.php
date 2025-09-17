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
        Schema::create('recovery_otps', function (Blueprint $table) {
            $table->id(); // کلید اصلی (اختیاری، برای شناسایی یکتا)
            $table->unsignedBigInteger('user_id'); // کلید خارجی به جدول users
            $table->string('token', 100)->unique(); // توکن یا رمز یکبار مصرف (مثلاً UUID یا کد تصادفی)
            $table->boolean('used')->default(false); // وضعیت استفاده (0 = استفاده نشده، 1 = استفاده شده)
            $table->timestamp('expires_at'); // زمان انقضای رمز
            $table->timestamps(); // created_at و updated_at

            // تعریف کلید خارجی
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recovery_otps');
    }
};
