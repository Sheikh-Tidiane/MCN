<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProduitController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $produits = Produit::paginate($request->get('per_page', 15));
        return response()->json(['data' => $produits->items()]);
    }

    public function show(int $id): JsonResponse
    {
        $produit = Produit::findOrFail($id);
        return response()->json(['data' => $produit]);
    }

    public function byCategory(string $categorie): JsonResponse
    {
        $produits = Produit::where('categorie', $categorie)->get();
        return response()->json(['data' => $produits]);
    }

    public function promotions(): JsonResponse
    {
        $produits = Produit::where('en_promotion', true)->get();
        return response()->json(['data' => $produits]);
    }

    public function nouveaux(): JsonResponse
    {
        $produits = Produit::orderBy('created_at', 'desc')->limit(10)->get();
        return response()->json(['data' => $produits]);
    }

    public function bestsellers(): JsonResponse
    {
        // TODO: Implémenter la logique des bestsellers
        $produits = Produit::limit(10)->get();
        return response()->json(['data' => $produits]);
    }

    public function search(Request $request): JsonResponse
    {
        $query = $request->get('q');
        $produits = Produit::where('nom', 'like', "%{$query}%")->get();
        return response()->json(['data' => $produits]);
    }
}
