<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\Visiteur;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\ReservationConfirmation;

class CommandeController extends Controller
{
    public function create(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'visiteur_uuid' => 'required|string',
            'items' => 'required|array|min:1', // [{type, quantite, prix_unitaire}]
            'items.*.type' => 'required|string',
            'items.*.quantite' => 'required|integer|min:1',
            'items.*.prix_unitaire' => 'required|numeric|min:0',
            'methode_paiement' => 'required|string|in:sur_place,stripe',
            'visitor.prenom' => 'nullable|string',
            'visitor.nom' => 'nullable|string',
            'visitor.email' => 'nullable|email',
            'visitor.telephone' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $montantTotal = collect($request->input('items'))
            ->reduce(fn($sum, $it) => $sum + ($it['prix_unitaire'] * $it['quantite']), 0);

        $visiteur = Visiteur::byUuid($request->input('visiteur_uuid'))->first();
        if (!$visiteur) {
            return response()->json(['message' => 'Visiteur introuvable'], 404);
        }

        $commande = new Commande();
        $commande->visiteur_id = $visiteur->id;
        $commande->numero_commande = Commande::generateOrderNumber();
        $commande->statut = 'en_attente';
        $commande->montant_total = $montantTotal;
        $commande->montant_tva = 0;
        $commande->montant_remise = 0;
        $commande->methode_paiement = $request->input('methode_paiement');
        $commande->statut_paiement = 'en_attente';
        $commande->donnees_facturation = array_filter([
            'visiteur_uuid' => $request->input('visiteur_uuid'),
            'prenom' => $request->input('visitor.prenom'),
            'nom' => $request->input('visitor.nom'),
            'email' => $request->input('visitor.email'),
            'telephone' => $request->input('visitor.telephone'),
        ], fn($v) => !is_null($v) && $v !== '');
        $commande->donnees_livraison = [];
        $commande->notes = json_encode($request->input('items'));
        $commande->email_confirmation = false;
        $commande->save();

        // Envoyer un email de confirmation si paiement sur place et email fourni
        $email = data_get($commande->donnees_facturation, 'email');
        if ($commande->methode_paiement === 'sur_place' && $email) {
            try {
                Mail::to($email)->send(new ReservationConfirmation($commande));
            } catch (\Throwable $e) {
                // Soft-fail: ne bloque pas l'API si email échoue
            }
        }

        return response()->json(['data' => $commande], 201);
    }

    public function getByVisitor(string $uuid): JsonResponse
    {
        $commandes = Commande::whereJsonContains('donnees_facturation->visiteur_uuid', $uuid)
            ->orderByDesc('created_at')
            ->get();
        return response()->json(['data' => $commandes]);
    }

    public function show(int $id): JsonResponse
    {
        $commande = Commande::findOrFail($id);
        return response()->json(['data' => $commande]);
    }

    public function updateStatus(int $id, Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'statut' => 'nullable|string|in:en_attente,confirmee,en_preparation,expediee,livree,annulee',
            'statut_paiement' => 'nullable|string|in:en_attente,paye,echec,rembourse',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $commande = Commande::find($id);
        if (!$commande) {
            return response()->json(['message' => 'Commande introuvable'], 404);
        }
        if ($request->filled('statut')) $commande->statut = $request->input('statut');
        if ($request->filled('statut_paiement')) $commande->statut_paiement = $request->input('statut_paiement');
        $commande->save();
        return response()->json(['message' => 'Statut mis à jour', 'data' => $commande]);
    }

    public function cancel(int $id): JsonResponse
    {
        $commande = Commande::find($id);
        if (!$commande) {
            return response()->json(['message' => 'Commande introuvable'], 404);
        }
        if (! $commande->canBeCancelled()) {
            return response()->json(['message' => "La commande ne peut pas être annulée"], 409);
        }
        $commande->statut = 'annulee';
        if ($commande->statut_paiement !== 'paye') {
            $commande->statut_paiement = 'echec';
        }
        $commande->save();
        return response()->json(['message' => 'Commande annulée', 'data' => $commande]);
    }
}
