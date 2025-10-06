<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
{
    public function createStripeIntent(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'required|integer|min:100', // amount in smallest currency unit
            'currency' => 'required|string|in:xof,eur,usd',
            'metadata' => 'nullable|array',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $secret = config('services.stripe.secret');
        if (!$secret) {
            return response()->json(['message' => 'Stripe non configuré'], 500);
        }

        try {
            $stripe = new \Stripe\StripeClient($secret);
            $intent = $stripe->paymentIntents->create([
                'amount' => $request->integer('amount'),
                'currency' => $request->input('currency'),
                'automatic_payment_methods' => ['enabled' => true],
                'metadata' => $request->input('metadata') ?? [],
            ]);
            return response()->json(['client_secret' => $intent->client_secret]);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Erreur Stripe', 'error' => $e->getMessage()], 500);
        }
    }
}


