import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

const LoadingDemo = () => {
  const [activeDemo, setActiveDemo] = useState(null);

  const demos = [
    {
      id: 'museum',
      name: 'Musée Classique',
      description: 'Animation inspirée de l\'art africain traditionnel',
      variant: 'museum',
      size: 'large'
    },
    {
      id: 'pulse',
      name: 'Pulsation Dorée',
      description: 'Effet de pulsation avec des tons chauds',
      variant: 'pulse',
      size: 'large'
    },
    {
      id: 'wave',
      name: 'Vagues Artistiques',
      description: 'Animation en vagues élégantes',
      variant: 'wave',
      size: 'large'
    },
    {
      id: 'dots',
      name: 'Points Dansants',
      description: 'Points animés avec rythme africain',
      variant: 'dots',
      size: 'large'
    }
  ];

  const messages = [
    'Chargement des œuvres...',
    'Préparation de l\'exposition...',
    'Synchronisation des données...',
    'Initialisation du musée...',
    'Chargement de la collection...'
  ];

  const startDemo = (demoId) => {
    setActiveDemo(demoId);
    setTimeout(() => {
      setActiveDemo(null);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Animations de Chargement
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez nos animations de chargement élégantes, inspirées de l'art africain 
            et parfaitement intégrées au thème du Musée des Civilisations Noires.
          </p>
        </motion.div>

        {/* Grille des démos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {demos.map((demo, index) => (
            <motion.div
              key={demo.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {demo.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {demo.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {demo.description}
                </p>
                <motion.button
                  onClick={() => startDemo(demo.id)}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-2 px-4 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Tester
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Zone de démonstration */}
        <motion.div
          className="bg-white rounded-2xl shadow-2xl p-12 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            Zone de Démonstration
          </h2>
          
          <div className="min-h-[300px] flex items-center justify-center">
            {activeDemo ? (
              <motion.div
                key={activeDemo}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <LoadingSpinner
                  variant={demos.find(d => d.id === activeDemo)?.variant}
                  size="xl"
                  text={messages[Math.floor(Math.random() * messages.length)]}
                  showText={true}
                />
              </motion.div>
            ) : (
              <motion.div
                className="text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-lg">Cliquez sur un bouton pour voir l'animation</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Informations techniques */}
        <motion.div
          className="mt-12 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Caractéristiques Techniques
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">F</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Framer Motion</h4>
              <p className="text-sm text-gray-600">Animations fluides et performantes</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">T</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Thème Africain</h4>
              <p className="text-sm text-gray-600">Couleurs et motifs inspirés de l'art africain</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">R</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Responsive</h4>
              <p className="text-sm text-gray-600">Adaptation parfaite à tous les écrans</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingDemo;
