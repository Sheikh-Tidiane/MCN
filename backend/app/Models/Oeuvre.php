<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Oeuvre extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre',
        'description',
        'artiste',
        'periode',
        'type_oeuvre',
        'materiau',
        'dimensions',
        'annee_creation',
        'provenance',
        'contexte_historique',
        'image_principale',
        'images_supplementaires',
        'audio_guide',
        'video_url',
        'qr_code',
        'visible_public',
        'audio_disponible',
        'video_disponible',
        'ordre_affichage'
    ];

    protected $casts = [
        'images_supplementaires' => 'array',
        'visible_public' => 'boolean',
        'audio_disponible' => 'boolean',
        'video_disponible' => 'boolean',
        'annee_creation' => 'integer',
        'ordre_affichage' => 'integer'
    ];

    /**
     * Relation avec les descriptions multilingues
     */
    public function descriptions(): HasMany
    {
        return $this->hasMany(Description::class);
    }

    /**
     * Relation avec les médias
     */
    public function medias(): HasMany
    {
        return $this->hasMany(Media::class);
    }

    /**
     * Récupérer la description dans une langue spécifique
     */
    public function getDescriptionInLanguage(string $langueCode)
    {
        return $this->descriptions()
            ->whereHas('langue', function ($query) use ($langueCode) {
                $query->where('code', $langueCode);
            })
            ->first();
    }

    /**
     * Récupérer l'image principale
     */
    public function getImagePrincipaleAttribute($value)
    {
        if ($value) {
            return asset('storage/' . $value);
        }
        return null;
    }

    /**
     * Récupérer l'audio guide
     */
    public function getAudioGuideAttribute($value)
    {
        if ($value) {
            return asset('storage/' . $value);
        }
        return null;
    }

    /**
     * Scope pour les œuvres visibles publiquement
     */
    public function scopeVisible($query)
    {
        return $query->where('visible_public', true);
    }

    /**
     * Scope pour rechercher par QR code
     */
    public function scopeByQrCode($query, string $qrCode)
    {
        return $query->where('qr_code', $qrCode);
    }

    /**
     * Scope pour rechercher par type d'œuvre
     */
    public function scopeByType($query, string $type)
    {
        return $query->where('type_oeuvre', $type);
    }

    /**
     * Scope pour rechercher par période
     */
    public function scopeByPeriode($query, string $periode)
    {
        return $query->where('periode', $periode);
    }
}

