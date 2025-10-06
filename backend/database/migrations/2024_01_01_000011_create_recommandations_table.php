<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recommandations', function (Blueprint $table) {
            $table->id();
            $table->string('visiteur_uuid')->nullable()->index();
            $table->foreignId('oeuvre_id')->constrained('oeuvres')->onDelete('cascade');
            $table->float('score')->default(0);
            $table->string('source')->nullable(); // algo, editoriale, tendance, etc.
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recommandations');
    }
};


