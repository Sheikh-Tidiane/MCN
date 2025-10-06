<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OeuvreResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'titre' => $this->titre,
            'artiste' => $this->artiste,
            'periode' => $this->periode,
            'type_oeuvre' => $this->type_oeuvre,
            'annee_creation' => $this->annee_creation,
            'image_principale' => $this->image_principale,
            'audio_disponible' => $this->audio_disponible,
            'video_disponible' => $this->video_disponible,
            'qr_code' => $this->qr_code,
            // Retourner un résumé texte de description (fallback sur colonne oeuvre.description)
            'description' => optional($this->getDescriptionInLanguage($request->get('langue', 'fr')))->description ?? $this->description,
            'medias' => $this->medias->map(function ($media) {
                return [
                    'id' => $media->id,
                    'type' => $media->type,
                    'url' => $media->url_complète,
                    'est_principal' => $media->est_principal,
                    'ordre' => $media->ordre
                ];
            })
        ];
    }
}

