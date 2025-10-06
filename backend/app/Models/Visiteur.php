<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Visiteur extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'langue_preferee',
        'oeuvres_favorites',
        'historique_consultation',
        'preferences',
        'derniere_visite'
    ];

    protected $casts = [
        'oeuvres_favorites' => 'array',
        'historique_consultation' => 'array',
        'preferences' => 'array',
        'derniere_visite' => 'datetime',
    ];

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName()
    {
        return 'uuid';
    }

    /**
     * Scope pour trouver un visiteur par UUID
     */
    public function scopeByUuid($query, $uuid)
    {
        return $query->where('uuid', $uuid);
    }

    /**
     * Vérifier si une œuvre est dans les favoris
     */
    public function hasFavorite($oeuvreId)
    {
        return in_array($oeuvreId, $this->oeuvres_favorites ?? []);
    }

    /**
     * Ajouter une œuvre aux favoris
     */
    public function addFavorite($oeuvreId)
    {
        $favorites = $this->oeuvres_favorites ?? [];
        if (!in_array($oeuvreId, $favorites)) {
            $favorites[] = $oeuvreId;
            $this->update(['oeuvres_favorites' => $favorites]);
        }
        return $this;
    }

    /**
     * Retirer une œuvre des favoris
     */
    public function removeFavorite($oeuvreId)
    {
        $favorites = $this->oeuvres_favorites ?? [];
        $favorites = array_values(array_filter($favorites, fn($id) => $id !== $oeuvreId));
        $this->update(['oeuvres_favorites' => $favorites]);
        return $this;
    }

    /**
     * Ajouter une œuvre à l'historique
     */
    public function addToHistory($oeuvreId)
    {
        $history = $this->historique_consultation ?? [];
        
        // Retirer l'œuvre si elle existe déjà
        $history = array_values(array_filter($history, fn($id) => $id !== $oeuvreId));
        
        // Ajouter au début
        array_unshift($history, $oeuvreId);
        
        // Limiter à 50 entrées
        $history = array_slice($history, 0, 50);
        
        $this->update([
            'historique_consultation' => $history,
            'derniere_visite' => now()
        ]);
        
        return $this;
    }
}
