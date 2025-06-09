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
         Schema::create('variant_values', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('variant_id');
            $table->unsignedBigInteger('product_attribute_id');
            $table->unsignedBigInteger('value_id');
            $table->timestamps();

            $table->index(['variant_id', 'product_attribute_id', 'value_id']);
            $table->foreign('variant_id')
                  ->references('id')
                  ->on('variants')
                  ->onDelete('cascade');
            $table->foreign('product_attribute_id')
                  ->references('id')
                  ->on('product_attributes')
                  ->onDelete('cascade');
            $table->foreign('value_id')
                  ->references('id')
                  ->on('product_attribute_values')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('variant_values');
    }
};
