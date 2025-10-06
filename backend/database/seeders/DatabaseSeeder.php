<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Database\Seeders\AdministrateurSeeder;
use Database\Seeders\LangueSeeder;
use Database\Seeders\OeuvreSeeder;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Optionnel: Utilisateur test
        // User::factory(10)->create();
        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        // Seed des administrateurs
        $this->call([
            AdministrateurSeeder::class,
            LangueSeeder::class,
            OeuvreSeeder::class,
        ]);
    }
}
