<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CommandeProduit extends Model
{
    use HasFactory;

    protected $fillable = [
        'commande_id',
        'produit_id',
        'quantite',
        'prix_unitaire',
        'prix_total',
        'options_produit'
    ];

    protected $casts = [
        'quantite' => 'integer',
        'prix_unitaire' => 'decimal:2',
        'prix_total' => 'decimal:2',
        'options_produit' => 'array'
    ];

    /**
     * Relation avec la commande
     */
    public function commande(): BelongsTo
    {
        return $this->belongsTo(Commande::class);
    }

    /**
     * Relation avec le produit
     */
    public function produit(): BelongsTo
    {
        return $this->belongsTo(Produit::class);
    }

    /**
     * Calculer le prix total pour cette ligne
     */
    public function calculateTotal(): float
    {
        return $this->prix_unitaire * $this->quantite;
    }

    /**
     * Boot method pour calculer automatiquement le prix total
     */
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($model) {
            $model->prix_total = $model->calculateTotal();
        });
    }
}
