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
        Schema::create('langues', function (Blueprint $table) {
            $table->id();
            $table->string('code', 5)->unique(); // fr, en, wo
            $table->string('nom');
            $table->string('nom_natif'); // Nom dans la langue native
            $table->string('drapeau')->nullable(); // URL du drapeau
            $table->boolean('active')->default(true);
            $table->boolean('par_defaut')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('langues');
    }
};
