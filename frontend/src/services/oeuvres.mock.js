export const MOCK_OEUVRES = [
  {
    id: 1,
    titre: 'Masque Baoulé',
    artiste: 'Anonyme',
    periode: 'XXe siècle',
    type_oeuvre: 'sculpture',
    annee_creation: '1950',
    image_principale: '/images/civilisation.jpeg',
    audio_disponible: true,
    video_disponible: false,
    qr_code: 'MCN-QR-0001',
    description: 'Masque en bois sculpté originaire de Côte d’Ivoire.',
    medias: [
      { id: 11, type: 'image', url: '/images/civilisation.jpeg', est_principal: true, ordre: 1 },
      { id: 12, type: 'image', url: '/images/entre-musee.jpeg', est_principal: false, ordre: 2 }
    ]
  },
  {
    id: 2,
    titre: 'Textile Bogolan',
    artiste: 'Collectif Bambara',
    periode: 'Contemporain',
    type_oeuvre: 'artisanat',
    annee_creation: '2020',
    image_principale: '/images/entree.jpeg',
    audio_disponible: false,
    video_disponible: false,
    qr_code: 'MCN-QR-0002',
    description: 'Tissu traditionnel malien aux motifs symboliques.',
    medias: [
      { id: 21, type: 'image', url: '/images/entree.jpeg', est_principal: true, ordre: 1 }
    ]
  },
  {
    id: 3,
    titre: 'Statuette Nok',
    artiste: 'Civilisation Nok',
    periode: 'Antique',
    type_oeuvre: 'sculpture',
    annee_creation: '500 av. J.-C.',
    image_principale: '/images/musee.jpeg',
    audio_disponible: false,
    video_disponible: true,
    qr_code: 'MCN-QR-0003',
    description: 'Terracotta de la culture Nok (Nigéria).',
    medias: [
      { id: 31, type: 'image', url: '/images/musee.jpeg', est_principal: true, ordre: 1 }
    ]
  }
];

export const MOCK_OEUVRE_DETAILS = {
  1: {
    id: 1,
    titre: 'Masque Baoulé',
    description: 'Masque en bois utilisé lors des cérémonies.',
    contexte_historique: 'Culture Baoulé, Côte d’Ivoire.',
    technique: 'Bois sculpté',
    signification: 'Masque de divertissement et d’apparat.',
    audio_transcript: 'Transcription de l’audio...',
    artiste: 'Anonyme',
    periode: 'XXe siècle',
    type_oeuvre: 'sculpture',
    materiau: 'Bois',
    dimensions: '35×20×15 cm',
    annee_creation: '1950',
    provenance: 'Côte d’Ivoire',
    image_principale: '/images/civilisation.jpeg',
    images_supplementaires: ['/images/entre-musee.jpeg'],
    audio_guide: '/videos/sample-audio.mp3',
    video_url: null,
    audio_disponible: true,
    video_disponible: false,
    qr_code: 'MCN-QR-0001',
    medias: [
      { id: 11, type: 'image', nom_fichier: 'baoule.jpg', url: '/images/civilisation.jpeg', mime_type: 'image/jpeg', taille: null, largeur: null, hauteur: null, duree: null, description: null, est_principal: true, ordre: 1 },
      { id: 12, type: 'image', nom_fichier: 'detail.jpg', url: '/images/entre-musee.jpeg', mime_type: 'image/jpeg', taille: null, largeur: null, hauteur: null, duree: null, description: null, est_principal: false, ordre: 2 }
    ],
    langue_actuelle: 'fr',
    langues_disponibles: ['fr', 'en', 'wo']
  },
  2: {
    id: 2,
    titre: 'Textile Bogolan',
    description: 'Tissu traditionnel malien teint à la boue.',
    contexte_historique: 'Culture Bambara, Mali.',
    technique: 'Teinture à la boue',
    signification: 'Motifs symboliques de protection.',
    audio_transcript: null,
    artiste: 'Collectif Bambara',
    periode: 'Contemporain',
    type_oeuvre: 'artisanat',
    materiau: 'Coton',
    dimensions: '200×120 cm',
    annee_creation: '2020',
    provenance: 'Mali',
    image_principale: '/images/entree.jpeg',
    images_supplementaires: [],
    audio_guide: null,
    video_url: null,
    audio_disponible: false,
    video_disponible: false,
    qr_code: 'MCN-QR-0002',
    medias: [
      { id: 21, type: 'image', nom_fichier: 'bogolan.jpg', url: '/images/entree.jpeg', mime_type: 'image/jpeg', taille: null, largeur: null, hauteur: null, duree: null, description: null, est_principal: true, ordre: 1 }
    ],
    langue_actuelle: 'fr',
    langues_disponibles: ['fr', 'en', 'wo']
  },
  3: {
    id: 3,
    titre: 'Statuette Nok',
    description: 'Terracotta emblématique de la civilisation Nok.',
    contexte_historique: 'Culture Nok, Nigéria (1000 av. J.-C. – 300 apr. J.-C.).',
    technique: 'Modelage et cuisson de terre cuite',
    signification: 'Représentations humaines stylisées, fonctions rituelles possibles.',
    audio_transcript: null,
    artiste: 'Civilisation Nok',
    periode: 'Antique',
    type_oeuvre: 'sculpture',
    materiau: 'Terre cuite',
    dimensions: '28×12×10 cm',
    annee_creation: '500 av. J.-C.',
    provenance: 'Nigéria',
    image_principale: '/images/musee.jpeg',
    images_supplementaires: ['/images/entre-musee.jpeg'],
    audio_guide: null,
    video_url: 'https://www.youtube.com/watch?v=KqSqmk6NHT8',
    audio_disponible: false,
    video_disponible: true,
    qr_code: 'MCN-QR-0003',
    medias: [
      { id: 31, type: 'image', nom_fichier: 'nok.jpg', url: '/images/musee.jpeg', mime_type: 'image/jpeg', taille: null, largeur: null, hauteur: null, duree: null, description: null, est_principal: true, ordre: 1 }
    ],
    langue_actuelle: 'fr',
    langues_disponibles: ['fr', 'en', 'wo']
  }
};

export const mockGetAll = async ({ page = 1, per_page = 15 } = {}) => {
  // Simule pagination
  const start = (page - 1) * per_page;
  const data = MOCK_OEUVRES.slice(start, start + per_page);
  return {
    data,
    meta: {
      current_page: page,
      last_page: Math.max(1, Math.ceil(MOCK_OEUVRES.length / per_page)),
      per_page,
      total: MOCK_OEUVRES.length
    }
  };
};

export const mockGetById = async (id) => {
  const detail = MOCK_OEUVRE_DETAILS[id];
  if (!detail) throw new Error('Not found');
  return { data: detail };
};


