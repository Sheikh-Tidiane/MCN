<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MediaController extends Controller
{
    /**
     * Récupérer un média par ID
     */
    public function show(int $id): JsonResponse
    {
        $media = Media::with('oeuvre')->findOrFail($id);

        return response()->json([
            'data' => [
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
                'ordre' => $media->ordre,
                'oeuvre' => $media->oeuvre ? [
                    'id' => $media->oeuvre->id,
                    'titre' => $media->oeuvre->titre,
                ] : null,
            ]
        ]);
    }
}

