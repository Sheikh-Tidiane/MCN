<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\OeuvreController;
use App\Http\Controllers\Api\LangueController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\VisiteurController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\BilletController;
use App\Http\Controllers\Api\ProduitController;
use App\Http\Controllers\Api\CommandeController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\CalendrierController;
use App\Http\Controllers\Api\TarifController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Routes publiques
Route::prefix('v1')->group(function () {
    
    // Routes des œuvres
    Route::get('/oeuvres', [OeuvreController::class, 'index']);
    Route::get('/oeuvres/{id}', [OeuvreController::class, 'show']);
    Route::get('/oeuvres/type/{type}', [OeuvreController::class, 'byType']);
    Route::get('/oeuvres/periode/{periode}', [OeuvreController::class, 'byPeriode']);
    Route::get('/oeuvres/search', [OeuvreController::class, 'search']);
    Route::get('/oeuvres/recommandations/{visiteurUuid}', [OeuvreController::class, 'recommandations']);
    Route::get('/scan/{qrCode}', [OeuvreController::class, 'scanQrCode']);
    
    // Routes des langues
    Route::get('/langues', [LangueController::class, 'index']);
    Route::get('/langues/actives', [LangueController::class, 'actives']);
    
    // Routes des médias
    Route::get('/medias/{id}', [MediaController::class, 'show']);
    
    // Routes des visiteurs (pour les préférences et l'historique)
    Route::post('/visiteurs', [VisiteurController::class, 'create']);
    Route::get('/visiteurs/{uuid}', [VisiteurController::class, 'show']);
    Route::put('/visiteurs/{uuid}', [VisiteurController::class, 'update']);
    Route::post('/visiteurs/{uuid}/favorites', [VisiteurController::class, 'addFavorite']);
    Route::delete('/visiteurs/{uuid}/favorites/{oeuvreId}', [VisiteurController::class, 'removeFavorite']);
    Route::post('/visiteurs/{uuid}/historique', [VisiteurController::class, 'addToHistory']);
    
    // Routes de billeterie
    Route::get('/billets/disponibilites', function (Request $request) {
        $date = $request->query('date');
        $type = $request->query('type', 'standard');
        $capaciteParCreneau = 50; // valeur par défaut, peut venir d'une config/DB
        $creneaux = [
            '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'
        ];

        // Si jour fermé, tout est complet
        $isClosed = false;
        if ($date) {
            try {
                if (\Illuminate\Support\Facades\Schema::hasTable('calendar_closures')) {
                    $isClosed = \App\Models\CalendarClosure::whereDate('date', $date)->exists();
                }
            } catch (\Throwable $e) {
                $isClosed = false; // tolérance si table absente
            }
        }

        // Multiplicateur de capacité s'il y a des événements ce jour
        $capacityMultiplier = 1.0;
        if ($date) {
            try {
                if (\Illuminate\Support\Facades\Schema::hasTable('calendar_events')) {
                    $capacityMultiplier = (float) (\App\Models\CalendarEvent::whereDate('date', $date)
                        ->whereNotNull('capacity_multiplier')
                        ->max('capacity_multiplier') ?? 1.0);
                }
            } catch (\Throwable $e) {
                $capacityMultiplier = 1.0; // tolérance si table absente
            }
        }

        $effectiveCapacity = (int) floor($capaciteParCreneau * max(0, $capacityMultiplier));

        $disponibilites = collect($creneaux)->map(function ($heure) use ($date, $type, $effectiveCapacity, $isClosed) {
            if ($isClosed) {
                return [
                    'heure' => $heure,
                    'capacite' => 0,
                    'restants' => 0,
                    'complet' => true,
                ];
            }

            $vendus = \App\Models\Billet::when($date, fn($q) => $q->whereDate('date_visite', $date))
                ->where('heure_visite', $heure)
                ->where('type', $type)
                ->whereIn('statut', ['valide', 'utilise'])
                ->count();
            $restants = max(0, $effectiveCapacity - $vendus);
            return [
                'heure' => $heure,
                'capacite' => $effectiveCapacity,
                'restants' => $restants,
                'complet' => $restants === 0,
            ];
        });

        return response()->json(['data' => $disponibilites]);
    });
    Route::post('/billets', [BilletController::class, 'create']);
    Route::get('/billets/visiteur/{uuid}', [BilletController::class, 'getByVisitor']);
    Route::post('/billets/validate/{qrCode}', [BilletController::class, 'validateQrCode']);
    Route::put('/billets/{id}/cancel', [BilletController::class, 'cancel']);
    
    // Routes de l'e-boutique
    Route::get('/produits', [ProduitController::class, 'index']);
    Route::get('/produits/{id}', [ProduitController::class, 'show']);
    Route::get('/produits/categorie/{categorie}', [ProduitController::class, 'byCategory']);
    Route::get('/produits/promotions', [ProduitController::class, 'promotions']);
    Route::get('/produits/nouveaux', [ProduitController::class, 'nouveaux']);
    Route::get('/produits/bestsellers', [ProduitController::class, 'bestsellers']);
    Route::get('/produits/search', [ProduitController::class, 'search']);
    
    // Routes des commandes
    Route::post('/commandes', [CommandeController::class, 'create']);
    Route::get('/commandes/visiteur/{uuid}', [CommandeController::class, 'getByVisitor']);
    Route::get('/commandes/{id}', [CommandeController::class, 'show']);
    Route::put('/commandes/{id}/status', [CommandeController::class, 'updateStatus']);
    Route::put('/commandes/{id}/cancel', [CommandeController::class, 'cancel']);

    // Paiement Stripe
    Route::post('/paiement/stripe/intent', [PaymentController::class, 'createStripeIntent']);

    // Calendrier (jours fermés / événements)
    Route::get('/calendrier', [CalendrierController::class, 'month']);

    // Tarifs billets
    Route::get('/tarifs', [TarifController::class, 'index']);
    
    // Routes d'administration (protégées par authentification)
    Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
        Route::get('/oeuvres', [AdminController::class, 'oeuvres']);
        Route::post('/oeuvres', [AdminController::class, 'createOeuvre']);
        Route::put('/oeuvres/{id}', [AdminController::class, 'updateOeuvre']);
        Route::delete('/oeuvres/{id}', [AdminController::class, 'deleteOeuvre']);
        
        Route::get('/descriptions', [AdminController::class, 'descriptions']);
        Route::post('/descriptions', [AdminController::class, 'createDescription']);
        Route::put('/descriptions/{id}', [AdminController::class, 'updateDescription']);
        Route::delete('/descriptions/{id}', [AdminController::class, 'deleteDescription']);
        
        Route::get('/medias', [AdminController::class, 'medias']);
        Route::post('/medias', [AdminController::class, 'uploadMedia']);
        Route::delete('/medias/{id}', [AdminController::class, 'deleteMedia']);
        
        Route::get('/langues', [AdminController::class, 'langues']);
        Route::post('/langues', [AdminController::class, 'createLangue']);
        Route::put('/langues/{id}', [AdminController::class, 'updateLangue']);
        Route::delete('/langues/{id}', [AdminController::class, 'deleteLangue']);
        
        Route::get('/statistiques', [AdminController::class, 'statistiques']);
    });
    
    // Route d'authentification admin
    Route::post('/admin/login', [AdminController::class, 'login']);
    Route::post('/admin/logout', [AdminController::class, 'logout'])->middleware('auth:sanctum');
});

// Route de test
Route::get('/health', function () {
    return response()->json([
        'status' => 'OK',
        'timestamp' => now(),
        'version' => '1.0.0'
    ]);
});