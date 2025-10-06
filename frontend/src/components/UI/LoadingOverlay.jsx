import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

const LoadingOverlay = ({ 
  isLoading, 
  message = 'Chargement...', 
  variant = 'museum',
  size = 'medium',
  showText = true,
  overlay = true,
  className = ''
}) => {
  const overlayVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  const contentVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: { 
      scale: 0.8,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className={`fixed inset-0 z-50 flex items-center justify-center ${
            overlay ? 'bg-black/50 backdrop-blur-sm' : ''
          } ${className}`}
          variants={overlayVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <motion.div
            className={`${
              overlay 
                ? 'bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8' 
                : ''
            }`}
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <LoadingSpinner
              variant={variant}
              size={size}
              text={message}
              showText={showText}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingOverlay;
