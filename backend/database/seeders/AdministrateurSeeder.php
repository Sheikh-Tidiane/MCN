<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Administrateur;
use Illuminate\Support\Facades\Hash;

class AdministrateurSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $administrateurs = [
            [
                'nom' => 'Administrateur Principal',
                'email' => 'admin@mcn-dakar.com',
                'password' => Hash::make('admin123'),
                'role' => 'super_admin',
                'actif' => true,
            ],
            [
                'nom' => 'Gestionnaire Contenu',
                'email' => 'content@museum-dakar.com',
                'password' => Hash::make('content123'),
                'role' => 'admin',
                'actif' => true,
            ],
        ];

        foreach ($administrateurs as $admin) {
            Administrateur::create($admin);
        }
    }
}

