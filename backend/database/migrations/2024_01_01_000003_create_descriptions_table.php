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
        Schema::create('descriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('oeuvre_id')->constrained()->onDelete('cascade');
            $table->foreignId('langue_id')->constrained()->onDelete('cascade');
            $table->string('titre');
            $table->text('description');
            $table->text('contexte_historique')->nullable();
            $table->text('technique')->nullable();
            $table->text('signification')->nullable();
            $table->text('audio_transcript')->nullable(); // Transcription de l'audio
            $table->timestamps();
            
            $table->unique(['oeuvre_id', 'langue_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('descriptions');
    }
};

