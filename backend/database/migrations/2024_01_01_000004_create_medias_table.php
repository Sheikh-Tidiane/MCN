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
        Schema::create('medias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('oeuvre_id')->constrained()->onDelete('cascade');
            $table->string('type'); // image, audio, video
            $table->string('nom_fichier');
            $table->string('chemin');
            $table->string('url')->nullable();
            $table->string('mime_type');
            $table->integer('taille')->nullable(); // en bytes
            $table->integer('largeur')->nullable(); // pour images/vidéos
            $table->integer('hauteur')->nullable(); // pour images/vidéos
            $table->integer('duree')->nullable(); // pour audio/vidéo en secondes
            $table->text('description')->nullable();
            $table->boolean('est_principal')->default(false);
            $table->integer('ordre')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medias');
    }
};
