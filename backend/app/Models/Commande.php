<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Commande extends Model
{
    use HasFactory;

    protected $fillable = [
        'visiteur_id',
        'numero_commande',
        'statut',
        'montant_total',
        'montant_tva',
        'montant_remise',
        'methode_paiement',
        'statut_paiement',
        'donnees_facturation',
        'donnees_livraison',
        'notes',
        'date_livraison',
        'tracking_number',
        'email_confirmation'
    ];

    protected $casts = [
        'montant_total' => 'decimal:2',
        'montant_tva' => 'decimal:2',
        'montant_remise' => 'decimal:2',
        'donnees_facturation' => 'array',
        'donnees_livraison' => 'array',
        'date_livraison' => 'datetime'
    ];

    /**
     * Relation avec le visiteur
     */
    public function visiteur(): BelongsTo
    {
        return $this->belongsTo(Visiteur::class);
    }

    /**
     * Relation avec les produits de la commande
     */
    public function produits(): HasMany
    {
        return $this->hasMany(CommandeProduit::class);
    }

    /**
     * Scope pour les commandes par statut
     */
    public function scopeByStatut($query, $statut)
    {
        return $query->where('statut', $statut);
    }

    /**
     * Scope pour les commandes payées
     */
    public function scopePayees($query)
    {
        return $query->where('statut_paiement', 'paye');
    }

    /**
     * Scope pour les commandes en attente
     */
    public function scopeEnAttente($query)
    {
        return $query->where('statut', 'en_attente');
    }

    /**
     * Générer un numéro de commande unique
     */
    public static function generateOrderNumber(): string
    {
        do {
            $numero = 'CMD-' . date('Y') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
        } while (self::where('numero_commande', $numero)->exists());
        
        return $numero;
    }

    /**
     * Calculer le montant total de la commande
     */
    public function calculateTotal(): float
    {
        return $this->produits->sum(function ($produit) {
            return $produit->prix_unitaire * $produit->quantite;
        });
    }

    /**
     * Vérifier si la commande peut être annulée
     */
    public function canBeCancelled(): bool
    {
        return in_array($this->statut, ['en_attente', 'confirmee']);
    }

    /**
     * Vérifier si la commande peut être modifiée
     */
    public function canBeModified(): bool
    {
        return $this->statut === 'en_attente';
    }
}
