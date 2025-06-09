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
           Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->bigInteger('amount_price');
            $table->bigInteger('amount_discount')->nullable();
            $table->bigInteger('finall_amount_price');
            $table->enum('status', ['Awaiting_payment', 'paid', 'processed', 'sent', 'delivered'])->nullable();
            $table->timestamp('order_registration_date')->nullable();
            $table->timestamp('order_payment_date')->nullable();
            $table->timestamp('processing_date')->nullable();
            $table->timestamp('sent_date')->nullable();
            $table->timestamp('delivery_date')->nullable();
            $table->integer('tracking_code');
            $table->unsignedBigInteger('address_id');
            $table->unsignedBigInteger('payment_id');
            $table->unsignedBigInteger('delivery_id');
            $table->string('payment_code', 255)->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['user_id', 'address_id', 'payment_id', 'delivery_id']);
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('address_id')->references('id')->on('addresses')->onDelete('cascade');
            $table->foreign('payment_id')->references('id')->on('payment_methods')->onDelete('cascade');
            $table->foreign('delivery_id')->references('id')->on('delivery_methods')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
