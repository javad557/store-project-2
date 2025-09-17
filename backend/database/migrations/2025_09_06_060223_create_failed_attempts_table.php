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
        Schema::create('failed_attempts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable(); // لینک به کاربر (nullable برای کاربران غیرثبت‌نامی)
            $table->enum('attempt_type', ['otp', 'two_factor'])->index(); // نوع تلاش: OTP یا 2FA
            $table->timestamps(); // شامل created_at و updated_at

            // کلید خارجی برای user_id
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('failed_attempts');
    }
};
