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
        Schema::create('visiteurs', function (Blueprint $table) {
            $table->id();
            $table->string('uuid')->unique(); // Identifiant unique pour le visiteur
            $table->string('langue_preferee', 5)->default('fr');
            $table->json('oeuvres_favorites')->nullable(); // IDs des œuvres favorites
            $table->json('historique_consultation')->nullable(); // Historique des œuvres consultées
            $table->json('preferences')->nullable(); // Autres préférences
            $table->timestamp('derniere_visite')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visiteurs');
    }
};
