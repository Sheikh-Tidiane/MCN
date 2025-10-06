import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Contact = () => {
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
            {t('nav.contact')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Contactez-nous pour toute information ou réservation
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-8"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Informations de contact
            </h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="text-museum-primary mt-1" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-900">Adresse</h3>
                  <p className="text-gray-600">
                    Avenue Cheikh Anta Diop<br />
                    Dakar, Sénégal
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Phone className="text-museum-primary mt-1" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-900">Téléphone</h3>
                  <p className="text-gray-600">+221 33 825 98 22</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Mail className="text-museum-primary mt-1" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-600">contact@mcn.sn</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Clock className="text-museum-primary mt-1" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-900">Horaires</h3>
                  <p className="text-gray-600">
                    Lun-Ven: 9h00-18h00<br />
                    Sam-Dim: 10h00-19h00
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-lg shadow-md p-8"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Formulaire de contact
            </h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-museum-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-museum-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-museum-primary focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-museum-primary text-white px-6 py-3 rounded-lg hover:bg-museum-secondary transition-colors"
              >
                Envoyer le message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
