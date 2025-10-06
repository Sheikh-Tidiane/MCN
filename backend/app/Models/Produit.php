<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Produit extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'description',
        'prix',
        'prix_promotion',
        'categorie',
        'stock',
        'stock_minimum',
        'image_principale',
        'images_supplementaires',
        'poids',
        'dimensions',
        'couleur',
        'taille',
        'matiere',
        'origine',
        'visible',
        'en_promotion',
        'nouveau',
        'bestseller',
        'tags',
        'meta_description',
        'meta_keywords'
    ];

    protected $casts = [
        'prix' => 'decimal:2',
        'prix_promotion' => 'decimal:2',
        'stock' => 'integer',
        'stock_minimum' => 'integer',
        'poids' => 'decimal:2',
        'images_supplementaires' => 'array',
        'visible' => 'boolean',
        'en_promotion' => 'boolean',
        'nouveau' => 'boolean',
        'bestseller' => 'boolean',
        'tags' => 'array'
    ];

    /**
     * Relation avec les commandes
     */
    public function commandes(): HasMany
    {
        return $this->hasMany(CommandeProduit::class);
    }

    /**
     * Scope pour les produits visibles
     */
    public function scopeVisible($query)
    {
        return $query->where('visible', true);
    }

    /**
     * Scope pour les produits en promotion
     */
    public function scopeEnPromotion($query)
    {
        return $query->where('en_promotion', true);
    }

    /**
     * Scope pour les nouveaux produits
     */
    public function scopeNouveaux($query)
    {
        return $query->where('nouveau', true);
    }

    /**
     * Scope pour les bestsellers
     */
    public function scopeBestsellers($query)
    {
        return $query->where('bestseller', true);
    }

    /**
     * Scope par catégorie
     */
    public function scopeByCategorie($query, $categorie)
    {
        return $query->where('categorie', $categorie);
    }

    /**
     * Vérifier si le produit est en stock
     */
    public function isInStock(): bool
    {
        return $this->stock > 0;
    }

    /**
     * Vérifier si le stock est faible
     */
    public function isLowStock(): bool
    {
        return $this->stock <= $this->stock_minimum;
    }

    /**
     * Obtenir le prix final (avec promotion si applicable)
     */
    public function getPrixFinalAttribute(): float
    {
        return $this->en_promotion && $this->prix_promotion ? 
               $this->prix_promotion : $this->prix;
    }

    /**
     * Obtenir l'image principale avec URL complète
     */
    public function getImagePrincipaleUrlAttribute(): ?string
    {
        return $this->image_principale ? asset('storage/' . $this->image_principale) : null;
    }
}
