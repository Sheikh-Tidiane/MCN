<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Visiteur;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class VisiteurController extends Controller
{
    /**
     * Créer un nouveau visiteur
     */
    public function create(Request $request): JsonResponse
    {
        $uuid = $request->get('uuid');
        
        // Vérifier si un visiteur avec cet UUID existe déjà
        if ($uuid && Visiteur::where('uuid', $uuid)->exists()) {
            $visiteur = Visiteur::where('uuid', $uuid)->first();
            return response()->json([
                'data' => $visiteur
            ], 200);
        }
        
        $visiteur = Visiteur::create([
            'uuid' => $uuid ?: Str::uuid(),
            'langue_preferee' => $request->get('langue', 'fr'),
            'oeuvres_favorites' => [],
            'historique_consultation' => [],
            'preferences' => $request->get('preferences', []),
        ]);

        return response()->json([
            'data' => $visiteur
        ], 201);
    }

    /**
     * Récupérer un visiteur par UUID
     */
    public function show(string $uuid): JsonResponse
    {
        $visiteur = Visiteur::where('uuid', $uuid)->firstOrFail();

        return response()->json([
            'data' => $visiteur
        ]);
    }

    /**
     * Mettre à jour un visiteur
     */
    public function update(Request $request, string $uuid): JsonResponse
    {
        $visiteur = Visiteur::where('uuid', $uuid)->firstOrFail();

        $visiteur->update($request->only([
            'langue_preferee',
            'oeuvres_favorites',
            'historique_consultation',
            'preferences',
            'derniere_visite'
        ]));

        return response()->json([
            'data' => $visiteur
        ]);
    }

    /**
     * Ajouter une œuvre aux favoris
     */
    public function addFavorite(Request $request, string $uuid): JsonResponse
    {
        $visiteur = Visiteur::where('uuid', $uuid)->firstOrFail();
        $oeuvreId = $request->get('oeuvre_id');

        $favorites = $visiteur->oeuvres_favorites ?? [];
        if (!in_array($oeuvreId, $favorites)) {
            $favorites[] = $oeuvreId;
            $visiteur->update(['oeuvres_favorites' => $favorites]);
        }

        return response()->json([
            'message' => 'Œuvre ajoutée aux favoris',
            'data' => $visiteur
        ]);
    }

    /**
     * Retirer une œuvre des favoris
     */
    public function removeFavorite(string $uuid, int $oeuvreId): JsonResponse
    {
        $visiteur = Visiteur::where('uuid', $uuid)->firstOrFail();

        $favorites = $visiteur->oeuvres_favorites ?? [];
        $favorites = array_values(array_filter($favorites, fn($id) => $id !== $oeuvreId));
        
        $visiteur->update(['oeuvres_favorites' => $favorites]);

        return response()->json([
            'message' => 'Œuvre retirée des favoris',
            'data' => $visiteur
        ]);
    }

    /**
     * Ajouter une œuvre à l'historique
     */
    public function addToHistory(Request $request, string $uuid): JsonResponse
    {
        $visiteur = Visiteur::where('uuid', $uuid)->firstOrFail();
        $oeuvreId = $request->get('oeuvre_id');

        $history = $visiteur->historique_consultation ?? [];
        
        // Retirer l'œuvre si elle existe déjà
        $history = array_values(array_filter($history, fn($id) => $id !== $oeuvreId));
        
        // Ajouter au début
        array_unshift($history, $oeuvreId);
        
        // Limiter à 50 entrées
        $history = array_slice($history, 0, 50);
        
        $visiteur->update([
            'historique_consultation' => $history,
            'derniere_visite' => now()
        ]);

        return response()->json([
            'message' => 'Œuvre ajoutée à l\'historique',
            'data' => $visiteur
        ]);
    }
}

