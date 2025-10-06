import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import QRScanner from '../components/QRScanner/QRScanner';

const Scan = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-700 hover:text-museum-primary transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Retour</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <QrCode className="text-museum-primary" size={24} />
              <h1 className="text-2xl font-serif font-bold text-gray-900">
                Scanner QR Code
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="w-24 h-24 bg-museum-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
            <QrCode className="text-museum-primary" size={40} />
          </div>
          
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
            Scanner une œuvre
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Pointez votre caméra vers le QR code situé près de l'œuvre pour accéder 
            à ses informations détaillées, son guide audio et ses médias.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowScanner(true)}
            className="bg-museum-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-museum-secondary transition-colors flex items-center space-x-2 mx-auto"
          >
            <QrCode size={20} />
            <span>Commencer le scan</span>
          </motion.button>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-museum-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="text-museum-primary" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Scan instantané
            </h3>
            <p className="text-gray-600">
              Accédez instantanément aux informations de l'œuvre
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-museum-secondary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="text-museum-secondary" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Informations complètes
            </h3>
            <p className="text-gray-600">
              Description, historique, guide audio et vidéos
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-museum-accent bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="text-museum-accent" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Multilingue
            </h3>
            <p className="text-gray-600">
              Disponible en français, anglais et wolof
            </p>
          </div>
        </motion.div>
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          onClose={() => setShowScanner(false)}
          onScanSuccess={(artwork) => {
            setShowScanner(false);
            navigate(`/oeuvre/${artwork.id}`);
          }}
        />
      )}
    </div>
  );
};

export default Scan;
