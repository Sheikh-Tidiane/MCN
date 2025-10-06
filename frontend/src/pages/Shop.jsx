import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Shop = () => {
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
            {t('shop.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez notre sélection de produits inspirés des collections du musée
          </p>
        </motion.div>

        <div className="text-center py-12">
          <ShoppingBag className="text-gray-400 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Boutique en cours de développement
          </h3>
          <p className="text-gray-600">
            La boutique sera bientôt disponible avec une sélection de produits exclusifs
          </p>
        </div>
      </div>
    </div>
  );
};

export default Shop;
