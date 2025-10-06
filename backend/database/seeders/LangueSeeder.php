<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Langue;

class LangueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $langues = [
            [
                'code' => 'fr',
                'nom' => 'Français',
                'nom_natif' => 'Français',
                'drapeau' => '🇫🇷',
                'active' => true,
                'par_defaut' => true,
            ],
            [
                'code' => 'en',
                'nom' => 'English',
                'nom_natif' => 'English',
                'drapeau' => '🇬🇧',
                'active' => true,
                'par_defaut' => false,
            ],
            [    
                'code' => 'wo',
                'nom' => 'Wolof',
                'nom_natif' => 'Wolof',
                'drapeau' => '🇸🇳',
                'active' => true,
                'par_defaut' => false,
            ],
        ];

        foreach ($langues as $langue) {
            Langue::create($langue);
        }
    }
}

