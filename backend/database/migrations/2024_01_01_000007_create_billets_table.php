<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('billets', function (Blueprint $table) {
            $table->id();
            $table->uuid('visiteur_uuid')->index();
            $table->string('type')->default('standard');
            $table->decimal('prix', 10, 2)->default(0);
            $table->date('date_visite')->nullable();
            $table->string('qr_code')->unique();
            $table->string('statut')->default('valide'); // valide, utilise, annule
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('billets');
    }
};


