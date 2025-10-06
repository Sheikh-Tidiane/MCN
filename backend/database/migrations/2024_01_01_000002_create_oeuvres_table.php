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
        Schema::create('oeuvres', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->text('description')->nullable();
            $table->string('artiste')->nullable();
            $table->string('periode')->nullable();
            $table->string('type_oeuvre')->nullable(); // peinture, sculpture, etc.
            $table->string('materiau')->nullable();
            $table->string('dimensions')->nullable();
            $table->year('annee_creation')->nullable();
            $table->string('provenance')->nullable();
            $table->text('contexte_historique')->nullable();
            $table->string('image_principale')->nullable();
            $table->json('images_supplementaires')->nullable();
            $table->string('audio_guide')->nullable();
            $table->string('video_url')->nullable();
            $table->string('qr_code')->unique();
            $table->boolean('visible_public')->default(true);
            $table->boolean('audio_disponible')->default(false);
            $table->boolean('video_disponible')->default(false);
            $table->integer('ordre_affichage')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('oeuvres');
    }
};
