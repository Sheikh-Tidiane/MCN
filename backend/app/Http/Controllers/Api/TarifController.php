<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class TarifController extends Controller
{
    public function index(): JsonResponse
    {
        $tarifs = [
            [
                'code' => 'standard',
                'label' => 'Adulte',
                'prix' => 5000,
                'conditions' => 'Billet plein tarif pour adultes.',
            ],
            [
                'code' => 'etudiant',
                'label' => 'Étudiant',
                'prix' => 3000,
                'conditions' => "Sur présentation d'une carte étudiante en cours de validité.",
                'preuve' => 'Carte étudiante',
            ],
            [
                'code' => 'enfant',
                'label' => 'Enfant',
                'prix' => 2000,
                'conditions' => 'Enfants de 4 à 12 ans.',
            ],
        ];

        return response()->json(['data' => $tarifs]);
    }
}



