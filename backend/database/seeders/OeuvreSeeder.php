<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Oeuvre;
use App\Models\Description;
use App\Models\Media;
use App\Models\Langue;

class OeuvreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $langueFr = Langue::where('code', 'fr')->first();
        $langueEn = Langue::where('code', 'en')->first();
        $langueWo = Langue::where('code', 'wo')->first();

        $oeuvres = [
            [
                'titre' => 'Masque Dan',
                'description' => 'Masque en bois sculpté utilisé lors des cérémonies d’initiation et de danse.',
                'artiste' => 'Artiste inconnu',
                'periode' => 'XIXe siècle',
                'type_oeuvre' => 'masque',
                'materiau' => 'Bois, fibres, pigments',
                'dimensions' => '25 x 18 x 12 cm',
                'annee_creation' => 1901,
                'provenance' => 'Côte d\'Ivoire',
                'contexte_historique' => 'Le masque Dan est utilisé dans les cérémonies d\'initiation et de danse.',
                'image_principale' => 'masques/dan-mask.jpg',
                'audio_guide' => 'audio/dan-mask.mp3',
                'qr_code' => 'DAN001',
                'visible_public' => true,
                'audio_disponible' => true,
                'video_disponible' => false,
                'ordre_affichage' => 1,
            ],
            [
                'titre' => 'Statue Baoulé',
                'description' => 'Statue rituelle représentant un ancêtre, ornée de perles et coquillages.',
                'artiste' => 'Maître Baoulé',
                'periode' => 'XXe siècle',
                'type_oeuvre' => 'statue',
                'materiau' => 'Bois, perles, coquillages',
                'dimensions' => '45 x 15 x 12 cm',
                'annee_creation' => 1920,
                'provenance' => 'Côte d\'Ivoire',
                'contexte_historique' => 'Cette statue représente un ancêtre et était utilisée dans les rituels familiaux.',
                'image_principale' => 'statues/baoule-statue.jpg',
                'audio_guide' => 'audio/baoule-statue.mp3',
                'qr_code' => 'BAO001',
                'visible_public' => true,
                'audio_disponible' => true,
                'video_disponible' => true,
                'ordre_affichage' => 2,
            ],
            [
                'titre' => 'Tissu Kente',
                'description' => 'Tissu traditionnel Ashanti porté lors des cérémonies royales et festives.',
                'artiste' => 'Tisserand Ashanti',
                'periode' => 'XXe siècle',
                'type_oeuvre' => 'textile',
                'materiau' => 'Soie, coton',
                'dimensions' => '200 x 150 cm',
                'annee_creation' => 1950,
                'provenance' => 'Ghana',
                'contexte_historique' => 'Le Kente est un tissu traditionnel porté lors des cérémonies importantes.',
                'image_principale' => 'textiles/kente-fabric.jpg',
                'audio_guide' => 'audio/kente-fabric.mp3',
                'qr_code' => 'KEN001',
                'visible_public' => true,
                'audio_disponible' => true,
                'video_disponible' => false,
                'ordre_affichage' => 3,
            ],
            [
                'titre' => 'Masque Bwa',
                'description' => 'Grand masque en bois utilisé lors des rites agraires au Burkina Faso.',
                'artiste' => 'Atelier traditionnel',
                'periode' => 'XXe siècle',
                'type_oeuvre' => 'masque',
                'materiau' => 'Bois, pigments naturels',
                'dimensions' => '180 x 40 x 12 cm',
                'annee_creation' => 1965,
                'provenance' => 'Burkina Faso',
                'contexte_historique' => 'Porté lors des cérémonies marquant les saisons agricoles.',
                'image_principale' => 'masques/bwa-mask.jpg',
                'audio_guide' => 'audio/bwa-mask.mp3',
                'qr_code' => 'BWA001',
                'visible_public' => true,
                'audio_disponible' => true,
                'video_disponible' => false,
                'ordre_affichage' => 4,
            ],
            [
                'titre' => 'Bronze du Bénin',
                'description' => 'Plaque en bronze coulée à la cire perdue, art de la cour d’Ifé/Benin.',
                'artiste' => 'Fondateur de guilde',
                'periode' => 'Antique',
                'type_oeuvre' => 'sculpture',
                'materiau' => 'Bronze',
                'dimensions' => '35 x 25 x 5 cm',
                'annee_creation' => 1901,
                'provenance' => 'Nigéria',
                'contexte_historique' => 'Symboles royaux représentés sur des plaques destinées au palais.',
                'image_principale' => 'sculptures/benin-bronze.jpg',
                'audio_guide' => 'audio/benin-bronze.mp3',
                'qr_code' => 'BEN001',
                'visible_public' => true,
                'audio_disponible' => true,
                'video_disponible' => false,
                'ordre_affichage' => 5,
            ],
            [
                'titre' => 'Peinture urbaine Dakar',
                'description' => 'Oeuvre contemporaine inspirée du street art dakarois.',
                'artiste' => 'Collectif contemporain',
                'periode' => 'Contemporain',
                'type_oeuvre' => 'peinture',
                'materiau' => 'Acrylique sur toile',
                'dimensions' => '120 x 80 cm',
                'annee_creation' => 2022,
                'provenance' => 'Sénégal',
                'contexte_historique' => 'Influences des fresques urbaines et mouvements artistiques locaux.',
                'image_principale' => 'peintures/dakar-urban.jpg',
                'audio_guide' => 'audio/dakar-urban.mp3',
                'qr_code' => 'DKR001',
                'visible_public' => true,
                'audio_disponible' => true,
                'video_disponible' => true,
                'ordre_affichage' => 6,
            ],
            [
                'titre' => 'Statuette Nok',
                'description' => 'Terracotta attribuée à la culture Nok, l’une des plus anciennes d’Afrique.',
                'artiste' => 'Civilisation Nok',
                'periode' => 'Antique',
                'type_oeuvre' => 'sculpture',
                'materiau' => 'Terre cuite',
                'dimensions' => '30 x 12 x 10 cm',
                'annee_creation' => 1901,
                'provenance' => 'Nigéria',
                'contexte_historique' => 'Objet rituel associé à des pratiques funéraires et culturelles.',
                'image_principale' => 'sculptures/nok-terracotta.jpg',
                'audio_guide' => 'audio/nok-terracotta.mp3',
                'qr_code' => 'NOK001',
                'visible_public' => true,
                'audio_disponible' => false,
                'video_disponible' => true,
                'ordre_affichage' => 7,
            ],
        ];

        foreach ($oeuvres as $oeuvreData) {
            // Idempotent via qr_code
            $oeuvre = Oeuvre::updateOrCreate(
                ['qr_code' => $oeuvreData['qr_code']],
                $oeuvreData
            );

            // Créer les descriptions multilingues
            $descriptions = [
                [
                    'langue_id' => $langueFr->id,
                    'titre' => $oeuvreData['titre'],
                    'description' => 'Description détaillée en français de cette œuvre exceptionnelle.',
                    'contexte_historique' => $oeuvreData['contexte_historique'],
                    'technique' => 'Technique traditionnelle transmise de génération en génération.',
                    'signification' => 'Cette œuvre revêt une importance culturelle et spirituelle majeure.',
                    'audio_transcript' => 'Transcription complète de l\'audio guide en français.',
                ],
                [
                    'langue_id' => $langueEn->id,
                    'titre' => $oeuvreData['titre'],
                    'description' => 'Detailed description in English of this exceptional artwork.',
                    'contexte_historique' => 'Historical context of this piece in English.',
                    'technique' => 'Traditional technique passed down through generations.',
                    'signification' => 'This artwork holds major cultural and spiritual importance.',
                    'audio_transcript' => 'Complete transcript of the audio guide in English.',
                ],
                [
                    'langue_id' => $langueWo->id,
                    'titre' => $oeuvreData['titre'],
                    'description' => 'Jëfandikoo ci wolof ci yoonu Afrig bi.',
                    'contexte_historique' => 'Jëfandikoo ci taarix ci wolof.',
                    'technique' => 'Jëfandikoo ci wolof.',
                    'signification' => 'Yoonu Afrig bi am na jëfandikoo ci aada ak ci xel.',
                    'audio_transcript' => 'Jëfandikoo ci wolof ci audio guide.',
                ],
            ];

            foreach ($descriptions as $descriptionData) {
                $descriptionData['oeuvre_id'] = $oeuvre->id;
                Description::updateOrCreate(
                    [
                        'oeuvre_id' => $oeuvre->id,
                        'langue_id' => $descriptionData['langue_id'],
                    ],
                    $descriptionData
                );
            }

            // Créer les médias
            $medias = [
                [
                    'type' => 'image',
                    'nom_fichier' => $oeuvreData['image_principale'],
                    'chemin' => 'oeuvres/' . $oeuvreData['image_principale'],
                    'mime_type' => 'image/jpeg',
                    'taille' => 1024000,
                    'largeur' => 800,
                    'hauteur' => 600,
                    'description' => 'Image principale de l\'œuvre',
                    'est_principal' => true,
                    'ordre' => 1,
                ],
            ];

            if ($oeuvreData['audio_guide']) {
                $medias[] = [
                    'type' => 'audio',
                    'nom_fichier' => basename($oeuvreData['audio_guide']),
                    'chemin' => 'audio/' . basename($oeuvreData['audio_guide']),
                    'mime_type' => 'audio/mpeg',
                    'taille' => 2048000,
                    'duree' => 180,
                    'description' => 'Audio guide de l\'œuvre',
                    'est_principal' => false,
                    'ordre' => 2,
                ];
            }

            // Réinitialiser les médias pour cohérence
            Media::where('oeuvre_id', $oeuvre->id)->delete();
            foreach ($medias as $mediaData) {
                $mediaData['oeuvre_id'] = $oeuvre->id;
                Media::create($mediaData);
            }
        }
    }
}

