<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('calendar_closures', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('reason')->nullable();
            $table->string('recurrence')->nullable(); // ex: none, yearly, weekly
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('calendar_closures');
    }
};


