<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Oeuvre;
use App\Http\Resources\OeuvreResource;
use App\Http\Resources\OeuvreDetailResource;
use App\Services\RecommandationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
// Spatie QueryBuilder retiré: utilisation d'Eloquent natif pour compatibilité

class OeuvreController extends Controller
{
    /**
     * Récupérer la liste des œuvres avec filtres et recherche
     */
    public function index(Request $request): JsonResponse
    {
        $query = Oeuvre::visible()
            ->with(['descriptions.langue', 'medias']);

        // Filtres (compatibles avec l'envoi frontend: filter[...])
        $filters = $request->get('filter', []);

        if (!empty($filters['type_oeuvre'])) {
            $query->where('type_oeuvre', $filters['type_oeuvre']);
        }
        if (!empty($filters['periode'])) {
            $query->where('periode', $filters['periode']);
        }
        if (!empty($filters['titre'])) {
            $query->where('titre', 'like', '%' . $filters['titre'] . '%');
        }
        if (isset($filters['audio_disponible'])) {
            $query->where('audio_disponible', (bool) $filters['audio_disponible']);
        }
        if (isset($filters['video_disponible'])) {
            $query->where('video_disponible', (bool) $filters['video_disponible']);
        }

        // Tri
        $sort = $request->get('sort');
        $allowedSorts = ['titre', 'annee_creation', 'ordre_affichage', 'created_at'];
        if ($sort && in_array($sort, $allowedSorts, true)) {
            $query->orderBy($sort);
        } else {
            $query->orderBy('ordre_affichage');
        }

        $oeuvres = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => OeuvreResource::collection($oeuvres->items()),
            'meta' => [
                'current_page' => $oeuvres->currentPage(),
                'last_page' => $oeuvres->lastPage(),
                'per_page' => $oeuvres->perPage(),
                'total' => $oeuvres->total(),
            ]
        ]);
    }

    /**
     * Récupérer une œuvre spécifique avec toutes ses informations
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $langueCode = $request->get('langue', 'fr');
        
        $oeuvre = Oeuvre::visible()
            ->with([
                'descriptions' => function ($query) use ($langueCode) {
                    $query->whereHas('langue', function ($q) use ($langueCode) {
                        $q->where('code', $langueCode);
                    });
                },
                'descriptions.langue',
                'medias' => function ($query) {
                    $query->orderBy('ordre');
                }
            ])
            ->findOrFail($id);

        return response()->json([
            'data' => new OeuvreDetailResource($oeuvre)
        ]);
    }

    /**
     * Rechercher une œuvre par QR code
     */
    public function scanQrCode(Request $request, string $qrCode): JsonResponse
    {
        $langueCode = $request->get('langue', 'fr');
        
        $oeuvre = Oeuvre::visible()
            ->byQrCode($qrCode)
            ->with([
                'descriptions' => function ($query) use ($langueCode) {
                    $query->whereHas('langue', function ($q) use ($langueCode) {
                        $q->where('code', $langueCode);
                    });
                },
                'descriptions.langue',
                'medias' => function ($query) {
                    $query->orderBy('ordre');
                }
            ])
            ->first();

        if (!$oeuvre) {
            return response()->json([
                'message' => 'Œuvre non trouvée'
            ], 404);
        }

        return response()->json([
            'data' => new OeuvreDetailResource($oeuvre)
        ]);
    }

    /**
     * Récupérer les œuvres par type
     */
    public function byType(Request $request, string $type): JsonResponse
    {
        $query = Oeuvre::visible()
            ->byType($type)
            ->with(['descriptions.langue', 'medias'])
            ->orderBy('ordre_affichage');

        $oeuvres = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => OeuvreResource::collection($oeuvres->items()),
            'meta' => [
                'current_page' => $oeuvres->currentPage(),
                'last_page' => $oeuvres->lastPage(),
                'per_page' => $oeuvres->perPage(),
                'total' => $oeuvres->total(),
            ]
        ]);
    }

    /**
     * Récupérer les œuvres par période
     */
    public function byPeriode(Request $request, string $periode): JsonResponse
    {
        $query = Oeuvre::visible()
            ->byPeriode($periode)
            ->with(['descriptions.langue', 'medias'])
            ->orderBy('ordre_affichage');

        $oeuvres = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => OeuvreResource::collection($oeuvres->items()),
            'meta' => [
                'current_page' => $oeuvres->currentPage(),
                'last_page' => $oeuvres->lastPage(),
                'per_page' => $oeuvres->perPage(),
                'total' => $oeuvres->total(),
            ]
        ]);
    }

    /**
     * Rechercher des œuvres
     */
    public function search(Request $request): JsonResponse
    {
        $searchTerm = $request->get('q', '');
        $langueCode = $request->get('langue', 'fr');

        if (empty($searchTerm)) {
            return response()->json([
                'data' => [],
                'message' => 'Terme de recherche requis'
            ], 400);
        }

        $oeuvres = Oeuvre::visible()
            ->where(function ($query) use ($searchTerm) {
                $query->where('titre', 'like', "%{$searchTerm}%")
                    ->orWhere('artiste', 'like', "%{$searchTerm}%")
                    ->orWhere('description', 'like', "%{$searchTerm}%");
            })
            ->with(['descriptions.langue', 'medias'])
            ->orderBy('ordre_affichage')
            ->limit(20)
            ->get();

        return response()->json([
            'data' => OeuvreResource::collection($oeuvres)
        ]);
    }

    /**
     * Récupérer les recommandations pour un visiteur
     */
    public function recommandations(Request $request, string $visiteurUuid): JsonResponse
    {
        $visiteur = \App\Models\Visiteur::where('uuid', $visiteurUuid)->firstOrFail();
        
        $recommandationService = new RecommandationService();
        $recommandations = $recommandationService->generateForVisitor($visiteur, 10);
        
        $oeuvres = Oeuvre::whereIn('id', $recommandations->pluck('oeuvre_id'))
            ->with(['descriptions.langue', 'medias'])
            ->get();
            
        return response()->json([
            'data' => OeuvreResource::collection($oeuvres)
        ]);
    }
}

