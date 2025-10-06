<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Billet;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class BilletController extends Controller
{
    public function create(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'visiteur_uuid' => 'required|string',
            'type' => 'required|string|in:standard,guide,groupe,reduit,enfant,etudiant',
            'prix' => 'required|numeric|min:0',
            'date_visite' => 'nullable|date|after_or_equal:today',
            'heure_visite' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $qrCode = 'MCN-' . strtoupper(Str::random(10));
        while (Billet::where('qr_code', $qrCode)->exists()) {
            $qrCode = 'MCN-' . strtoupper(Str::random(10));
        }

        $billet = Billet::create([
            'visiteur_uuid' => $request->input('visiteur_uuid'),
            'type' => $request->input('type'),
            'prix' => $request->input('prix'),
            'date_visite' => $request->input('date_visite'),
            'heure_visite' => $request->input('heure_visite'),
            'qr_code' => $qrCode,
            'statut' => 'valide',
        ]);

        return response()->json(['data' => $billet], 201);
    }

    public function getByVisitor(string $uuid): JsonResponse
    {
        $billets = Billet::where('visiteur_uuid', $uuid)
            ->orderByDesc('created_at')
            ->get();
        return response()->json(['data' => $billets]);
    }

    public function validateQrCode(string $qrCode): JsonResponse
    {
        $billet = Billet::where('qr_code', $qrCode)->first();
        if (!$billet) {
            return response()->json(['message' => 'Billet introuvable'], 404);
        }

        if ($billet->statut !== 'valide') {
            return response()->json(['message' => 'Billet non valide', 'statut' => $billet->statut], 409);
        }

        // Marquer comme utilisé
        $billet->statut = 'utilise';
        $billet->save();

        return response()->json(['message' => 'QR Code validé', 'data' => $billet]);
    }

    public function cancel(int $id): JsonResponse
    {
        $billet = Billet::find($id);
        if (!$billet) {
            return response()->json(['message' => 'Billet introuvable'], 404);
        }

        if ($billet->statut === 'utilise') {
            return response()->json(['message' => "Impossible d'annuler un billet utilisé"], 409);
        }

        $billet->statut = 'annule';
        $billet->save();

        return response()->json(['message' => 'Billet annulé', 'data' => $billet]);
    }
}
