import React from 'react';
import { motion } from 'framer-motion';
import { Building, Users, Award, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            {t('nav.about')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez l'histoire et la mission du Musée des Civilisations Noires
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Building, title: 'Fondé en 2018', description: 'Ouverture officielle' },
            { icon: Users, title: '500+ Œuvres', description: 'Collection exceptionnelle' },
            { icon: Award, title: 'Reconnaissance internationale', description: 'Patrimoine mondial' },
            { icon: BookOpen, title: 'Mission éducative', description: 'Transmission du savoir' }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md p-6 text-center"
            >
              <div className="w-16 h-16 bg-museum-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <item.icon className="text-museum-primary" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
