<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    use HasFactory;

    protected $table = 'medias';

    protected $fillable = [
        'oeuvre_id',
        'type',
        'nom_fichier',
        'chemin',
        'url',
        'mime_type',
        'taille',
        'largeur',
        'hauteur',
        'duree',
        'description',
        'est_principal',
        'ordre'
    ];

    protected $casts = [
        'est_principal' => 'boolean',
        'taille' => 'integer',
        'largeur' => 'integer',
        'hauteur' => 'integer',
        'duree' => 'integer',
        'ordre' => 'integer'
    ];

    /**
     * Relation avec l'œuvre
     */
    public function oeuvre()
    {
        return $this->belongsTo(Oeuvre::class);
    }

    /**
     * Récupérer l'URL complète du média
     */
    public function getUrlComplèteAttribute()
    {
        if ($this->url) {
            return $this->url;
        }
        
        if ($this->chemin) {
            return asset('storage/' . $this->chemin);
        }
        
        return null;
    }

    /**
     * Scope pour les médias principaux
     */
    public function scopePrincipal($query)
    {
        return $query->where('est_principal', true);
    }

    /**
     * Scope par type de média
     */
    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope pour les images
     */
    public function scopeImages($query)
    {
        return $query->where('type', 'image');
    }

    /**
     * Scope pour les audios
     */
    public function scopeAudios($query)
    {
        return $query->where('type', 'audio');
    }

    /**
     * Scope pour les vidéos
     */
    public function scopeVideos($query)
    {
        return $query->where('type', 'video');
    }
}

