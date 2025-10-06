<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Langue extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'nom',
        'nom_natif',
        'drapeau',
        'active',
        'par_defaut'
    ];

    protected $casts = [
        'active' => 'boolean',
        'par_defaut' => 'boolean'
    ];

    /**
     * Relation avec les descriptions
     */
    public function descriptions()
    {
        return $this->hasMany(Description::class);
    }

    /**
     * Scope pour les langues actives
     */
    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    /**
     * Récupérer la langue par défaut
     */
    public static function getDefault()
    {
        return self::where('par_defaut', true)->first() 
            ?? self::where('code', 'fr')->first();
    }
}

