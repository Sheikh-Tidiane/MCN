<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Description extends Model
{
    use HasFactory;

    protected $fillable = [
        'oeuvre_id',
        'langue_id',
        'titre',
        'description',
        'contexte_historique',
        'technique',
        'signification',
        'audio_transcript'
    ];

    /**
     * Relation avec l'œuvre
     */
    public function oeuvre()
    {
        return $this->belongsTo(Oeuvre::class);
    }

    /**
     * Relation avec la langue
     */
    public function langue()
    {
        return $this->belongsTo(Langue::class);
    }
}
