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
        Schema::create('commandes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('visiteur_id')->constrained()->onDelete('cascade');
            $table->string('numero_commande')->unique();
            $table->enum('statut', ['en_attente', 'confirmee', 'en_preparation', 'expediee', 'livree', 'annulee'])->default('en_attente');
            $table->decimal('montant_total', 10, 2);
            $table->decimal('montant_tva', 10, 2)->default(0);
            $table->decimal('montant_remise', 10, 2)->default(0);
            $table->string('methode_paiement')->nullable(); // stripe, paypal, virement
            $table->enum('statut_paiement', ['en_attente', 'paye', 'echec', 'rembourse'])->default('en_attente');
            $table->json('donnees_facturation');
            $table->json('donnees_livraison');
            $table->text('notes')->nullable();
            $table->datetime('date_livraison')->nullable();
            $table->string('tracking_number')->nullable();
            $table->boolean('email_confirmation')->default(false);
            $table->timestamps();

            $table->index(['statut', 'created_at']);
            $table->index(['statut_paiement', 'created_at']);
            $table->index('numero_commande');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commandes');
    }
};
