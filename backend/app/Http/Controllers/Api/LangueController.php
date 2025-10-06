<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Langue;
use Illuminate\Http\JsonResponse;

class LangueController extends Controller
{
    /**
     * Récupérer toutes les langues
     */
    public function index(): JsonResponse
    {
        $langues = Langue::orderBy('par_defaut', 'desc')
            ->orderBy('nom')
            ->get();

        return response()->json([
            'data' => $langues
        ]);
    }

    /**
     * Récupérer les langues actives
     */
    public function actives(): JsonResponse
    {
        $langues = Langue::active()
            ->orderBy('par_defaut', 'desc')
            ->orderBy('nom')
            ->get();

        return response()->json([
            'data' => $langues
        ]);
    }
}

