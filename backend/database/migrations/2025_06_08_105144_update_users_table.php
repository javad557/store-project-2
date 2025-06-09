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
         Schema::table('users', function (Blueprint $table) {
            $table->string('last_name', 255)->nullable();
            $table->string('national_code', 255)->nullable();
            $table->timestamp('birthdate')->nullable();
            $table->decimal('totalpurchases', 10, 2)->default(0.00);
            $table->tinyInteger('is_admin')->default(0);
            $table->tinyInteger('is_blocked')->default(0);
            $table->timestamp('blocked_until')->nullable();
            $table->timestamp('mobile_veryfied_at')->nullable();
            $table->timestamp('email_veryfied_at')->nullable();
            $table->integer('number_false_otp')->default(0);
            $table->integer('number_false_2fa')->default(0);
            $table->tinyInteger('twofactory')->default(0);
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //
        });
    }
};
