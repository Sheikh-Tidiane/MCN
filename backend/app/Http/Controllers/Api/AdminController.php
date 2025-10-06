<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Oeuvre;
use App\Models\Description;
use App\Models\Media;
use App\Models\Langue;
use App\Models\Administrateur;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class AdminController extends Controller
{
    /**
     * Connexion administrateur
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $admin = Administrateur::where('email', $request->email)
            ->where('actif', true)
            ->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants fournis sont incorrects.'],
            ]);
        }

        $token = $admin->createToken('admin-token')->plainTextToken;

        return response()->json([
            'data' => [
                'admin' => $admin,
                'token' => $token,
            ]
        ]);
    }

    /**
     * Déconnexion administrateur
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie'
        ]);
    }

    /**
     * Récupérer les œuvres (admin)
     */
    public function oeuvres(Request $request): JsonResponse
    {
        $oeuvres = Oeuvre::with(['descriptions.langue', 'medias'])
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => $oeuvres->items(),
            'meta' => [
                'current_page' => $oeuvres->currentPage(),
                'last_page' => $oeuvres->lastPage(),
                'per_page' => $oeuvres->perPage(),
                'total' => $oeuvres->total(),
            ]
        ]);
    }

    /**
     * Créer une œuvre
     */
    public function createOeuvre(Request $request): JsonResponse
    {
        $request->validate([
            'titre' => 'required|string|max:255',
            'artiste' => 'nullable|string|max:255',
            'periode' => 'nullable|string|max:255',
            'type_oeuvre' => 'nullable|string|max:255',
            'materiau' => 'nullable|string|max:255',
            'dimensions' => 'nullable|string|max:255',
            'annee_creation' => 'nullable|integer|min:1000|max:' . date('Y'),
            'provenance' => 'nullable|string|max:255',
            'contexte_historique' => 'nullable|string',
            'qr_code' => 'required|string|unique:oeuvres,qr_code',
            'visible_public' => 'boolean',
            'audio_disponible' => 'boolean',
            'video_disponible' => 'boolean',
        ]);

        $oeuvre = Oeuvre::create($request->all());

        return response()->json([
            'data' => $oeuvre
        ], 201);
    }

    /**
     * Mettre à jour une œuvre
     */
    public function updateOeuvre(Request $request, int $id): JsonResponse
    {
        $oeuvre = Oeuvre::findOrFail($id);

        $request->validate([
            'titre' => 'sometimes|required|string|max:255',
            'artiste' => 'nullable|string|max:255',
            'periode' => 'nullable|string|max:255',
            'type_oeuvre' => 'nullable|string|max:255',
            'materiau' => 'nullable|string|max:255',
            'dimensions' => 'nullable|string|max:255',
            'annee_creation' => 'nullable|integer|min:1000|max:' . date('Y'),
            'provenance' => 'nullable|string|max:255',
            'contexte_historique' => 'nullable|string',
            'qr_code' => 'sometimes|required|string|unique:oeuvres,qr_code,' . $id,
            'visible_public' => 'boolean',
            'audio_disponible' => 'boolean',
            'video_disponible' => 'boolean',
        ]);

        $oeuvre->update($request->all());

        return response()->json([
            'data' => $oeuvre
        ]);
    }

    /**
     * Supprimer une œuvre
     */
    public function deleteOeuvre(int $id): JsonResponse
    {
        $oeuvre = Oeuvre::findOrFail($id);
        $oeuvre->delete();

        return response()->json([
            'message' => 'Œuvre supprimée avec succès'
        ]);
    }

    /**
     * Récupérer les descriptions
     */
    public function descriptions(Request $request): JsonResponse
    {
        $descriptions = Description::with(['oeuvre', 'langue'])
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => $descriptions->items(),
            'meta' => [
                'current_page' => $descriptions->currentPage(),
                'last_page' => $descriptions->lastPage(),
                'per_page' => $descriptions->perPage(),
                'total' => $descriptions->total(),
            ]
        ]);
    }

    /**
     * Créer une description
     */
    public function createDescription(Request $request): JsonResponse
    {
        $request->validate([
            'oeuvre_id' => 'required|exists:oeuvres,id',
            'langue_id' => 'required|exists:langues,id',
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'contexte_historique' => 'nullable|string',
            'technique' => 'nullable|string',
            'signification' => 'nullable|string',
            'audio_transcript' => 'nullable|string',
        ]);

        $description = Description::create($request->all());

        return response()->json([
            'data' => $description
        ], 201);
    }

    /**
     * Mettre à jour une description
     */
    public function updateDescription(Request $request, int $id): JsonResponse
    {
        $description = Description::findOrFail($id);

        $request->validate([
            'titre' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'contexte_historique' => 'nullable|string',
            'technique' => 'nullable|string',
            'signification' => 'nullable|string',
            'audio_transcript' => 'nullable|string',
        ]);

        $description->update($request->all());

        return response()->json([
            'data' => $description
        ]);
    }

    /**
     * Supprimer une description
     */
    public function deleteDescription(int $id): JsonResponse
    {
        $description = Description::findOrFail($id);
        $description->delete();

        return response()->json([
            'message' => 'Description supprimée avec succès'
        ]);
    }

    /**
     * Récupérer les médias
     */
    public function medias(Request $request): JsonResponse
    {
        $medias = Media::with('oeuvre')
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => $medias->items(),
            'meta' => [
                'current_page' => $medias->currentPage(),
                'last_page' => $medias->lastPage(),
                'per_page' => $medias->perPage(),
                'total' => $medias->total(),
            ]
        ]);
    }

    /**
     * Uploader un média
     */
    public function uploadMedia(Request $request): JsonResponse
    {
        $request->validate([
            'oeuvre_id' => 'required|exists:oeuvres,id',
            'file' => 'required|file|max:10240', // 10MB max
            'type' => 'required|in:image,audio,video',
            'description' => 'nullable|string',
            'est_principal' => 'boolean',
        ]);

        $file = $request->file('file');
        $path = $file->store('oeuvres', 'public');

        $media = Media::create([
            'oeuvre_id' => $request->oeuvre_id,
            'type' => $request->type,
            'nom_fichier' => $file->getClientOriginalName(),
            'chemin' => $path,
            'mime_type' => $file->getMimeType(),
            'taille' => $file->getSize(),
            'description' => $request->description,
            'est_principal' => $request->get('est_principal', false),
            'ordre' => 0,
        ]);

        return response()->json([
            'data' => $media
        ], 201);
    }

    /**
     * Supprimer un média
     */
    public function deleteMedia(int $id): JsonResponse
    {
        $media = Media::findOrFail($id);
        
        // Supprimer le fichier du stockage
        if ($media->chemin) {
            Storage::disk('public')->delete($media->chemin);
        }
        
        $media->delete();

        return response()->json([
            'message' => 'Média supprimé avec succès'
        ]);
    }

    /**
     * Récupérer les langues
     */
    public function langues(): JsonResponse
    {
        $langues = Langue::orderBy('par_defaut', 'desc')
            ->orderBy('nom')
            ->get();

        return response()->json([
            'data' => $langues
        ]);
    }

    /**
     * Créer une langue
     */
    public function createLangue(Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string|max:5|unique:langues,code',
            'nom' => 'required|string|max:255',
            'nom_natif' => 'required|string|max:255',
            'drapeau' => 'nullable|string|max:10',
            'active' => 'boolean',
            'par_defaut' => 'boolean',
        ]);

        $langue = Langue::create($request->all());

        return response()->json([
            'data' => $langue
        ], 201);
    }

    /**
     * Mettre à jour une langue
     */
    public function updateLangue(Request $request, int $id): JsonResponse
    {
        $langue = Langue::findOrFail($id);

        $request->validate([
            'code' => 'sometimes|required|string|max:5|unique:langues,code,' . $id,
            'nom' => 'sometimes|required|string|max:255',
            'nom_natif' => 'sometimes|required|string|max:255',
            'drapeau' => 'nullable|string|max:10',
            'active' => 'boolean',
            'par_defaut' => 'boolean',
        ]);

        $langue->update($request->all());

        return response()->json([
            'data' => $langue
        ]);
    }

    /**
     * Supprimer une langue
     */
    public function deleteLangue(int $id): JsonResponse
    {
        $langue = Langue::findOrFail($id);
        $langue->delete();

        return response()->json([
            'message' => 'Langue supprimée avec succès'
        ]);
    }

    /**
     * Récupérer les statistiques
     */
    public function statistiques(): JsonResponse
    {
        $stats = [
            'oeuvres' => [
                'total' => Oeuvre::count(),
                'visibles' => Oeuvre::visible()->count(),
                'avec_audio' => Oeuvre::where('audio_disponible', true)->count(),
                'avec_video' => Oeuvre::where('video_disponible', true)->count(),
            ],
            'descriptions' => [
                'total' => Description::count(),
                'par_langue' => Description::with('langue')
                    ->get()
                    ->groupBy('langue.code')
                    ->map(fn($group) => $group->count()),
            ],
            'medias' => [
                'total' => Media::count(),
                'images' => Media::where('type', 'image')->count(),
                'audios' => Media::where('type', 'audio')->count(),
                'videos' => Media::where('type', 'video')->count(),
            ],
            'langues' => [
                'total' => Langue::count(),
                'actives' => Langue::active()->count(),
            ],
        ];

        return response()->json([
            'data' => $stats
        ]);
    }
}

