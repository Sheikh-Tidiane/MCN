<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OeuvreDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $description = $this->getDescriptionInLanguage($request->get('langue', 'fr'));
        
        return [
            'id' => $this->id,
            'titre' => $description ? $description->titre : $this->titre,
            'description' => $description ? $description->description : $this->description,
            'contexte_historique' => $description ? $description->contexte_historique : $this->contexte_historique,
            'technique' => $description ? $description->technique : null,
            'signification' => $description ? $description->signification : null,
            'audio_transcript' => $description ? $description->audio_transcript : null,
            'artiste' => $this->artiste,
            'periode' => $this->periode,
            'type_oeuvre' => $this->type_oeuvre,
            'materiau' => $this->materiau,
            'dimensions' => $this->dimensions,
            'annee_creation' => $this->annee_creation,
            'provenance' => $this->provenance,
            'image_principale' => $this->image_principale,
            'images_supplementaires' => $this->images_supplementaires,
            'audio_guide' => $this->audio_guide,
            'video_url' => $this->video_url,
            'audio_disponible' => $this->audio_disponible,
            'video_disponible' => $this->video_disponible,
            'qr_code' => $this->qr_code,
            'medias' => $this->medias->map(function ($media) {
                return [
                    'id' => $media->id,
                    'type' => $media->type,
                    'nom_fichier' => $media->nom_fichier,
                    'url' => $media->url_complète,
                    'mime_type' => $media->mime_type,
                    'taille' => $media->taille,
                    'largeur' => $media->largeur,
                    'hauteur' => $media->hauteur,
                    'duree' => $media->duree,
                    'description' => $media->description,
                    'est_principal' => $media->est_principal,
                    'ordre' => $media->ordre
                ];
            }),
            'langue_actuelle' => $request->get('langue', 'fr'),
            'langues_disponibles' => $this->descriptions->pluck('langue.code')->unique()->values()
        ];
    }
}

