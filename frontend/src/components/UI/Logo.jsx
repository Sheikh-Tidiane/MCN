import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Logo = ({ 
  size = 'lg', 
  showText = false, 
  className = '', 
  linkTo = '/',
  animated = true 
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12 sm:w-16 sm:h-16',
    md: 'w-16 h-16 sm:w-20 sm:h-20',
    lg: 'w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32',
    xl: 'w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40',
    xxl: 'w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48'
  };

  const LogoContent = () => (
    <div className={`flex items-center group ${className}`}>
      <motion.div 
        whileHover={animated ? { scale: 1.02 } : {}}
        className={`relative ${sizeClasses[size]} overflow-hidden rounded-lg sm:rounded-xl`}
      >
        <img
          src="/images/logo.jpeg"
          alt="Logo Musée des Civilisations Noires"
          className="w-full h-full object-cover"
        />
      </motion.div>
      {showText && (
        <div className="ml-3 sm:ml-4">
          <h1 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900">
            Musée des Civilisations Noires
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
            Dakar, Sénégal
          </p>
        </div>
      )}
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo}>
        <LogoContent />
      </Link>
    );
  }

  return <LogoContent />;
};

export default Logo;
