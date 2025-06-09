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
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('category_id');
            $table->unsignedBigInteger('priority_id');
            $table->unsignedBigInteger('user_id');
            $table->string('title', 255);
            $table->text('body');
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->tinyInteger('seen')->default(0);
            $table->enum('status', ['open', 'user_closed', 'admin_closed', 'both']);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['category_id', 'priority_id', 'user_id', 'parent_id']);
            $table->foreign('category_id')->references('id')->on('category_tickets')->onDelete('cascade');
            $table->foreign('priority_id')->references('id')->on('priority_tickets')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('parent_id')->references('id')->on('tickets')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
