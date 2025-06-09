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
         Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->text('address');
            $table->bigInteger('postal_code');
            $table->integer('no')->nullable();
            $table->integer('unit')->nullable();
            $table->bigInteger('mobile');
            $table->unsignedBigInteger('city_id');
            $table->unsignedBigInteger('province_id');
            $table->integer('price_increase')->default(0);
            $table->timestamps();

            $table->index(['city_id', 'province_id']);
            $table->foreign('city_id')->references('id')->on('cities')->onDelete('cascade');
            $table->foreign('province_id')->references('id')->on('provinces')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};
