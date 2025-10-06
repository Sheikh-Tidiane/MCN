<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Billet extends Model
{
    use HasFactory;

    protected $fillable = [
        'visiteur_uuid',
        'type',
        'prix',
        'date_visite',
        'heure_visite',
        'qr_code',
        'statut'
    ];

    protected $casts = [
        'date_visite' => 'date',
        'prix' => 'decimal:2'
    ];

    // La relation explicite avec un modèle Visiteur n'est pas définie ici car
    // la table utilise un champ UUID sans clé étrangère standard.

    /**
     * Scope pour les billets actifs
     */
    public function scopeActif($query)
    {
        return $query->where('statut', 'valide');
    }

    /**
     * Scope pour les billets par date
     */
    public function scopeByDate($query, $date)
    {
        return $query->whereDate('date_visite', $date);
    }

    /**
     * Scope pour les billets par type
     */
    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    // Génération de QR code déléguée au contrôleur/service pour inclure logique métier

    /**
     * Vérifier si le billet est valide
     */
    public function isValid(): bool
    {
        return $this->statut === 'valide' &&
               ($this->date_visite === null || $this->date_visite >= now()->toDateString());
    }
}
