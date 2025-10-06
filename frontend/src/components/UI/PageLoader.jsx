import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

const PageLoader = ({ 
  isLoading, 
  message = 'Chargement...', 
  progress = 0,
  variant = 'museum',
  showProgress = false,
  showParticles = true 
}) => {
  const containerVariants = {
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
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  const backgroundVariants = {
    initial: { scale: 1.1, opacity: 0 },
    animate: { 
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const contentVariants = {
    initial: { y: 30, opacity: 0 },
    animate: { 
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.2,
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const progressVariants = {
    initial: { width: 0 },
    animate: (progress) => ({
      width: `${progress}%`,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  // Génération de particules flottantes
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2
  }));

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="page-loader"
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* Arrière-plan animé */}
          <motion.div
            className="absolute inset-0"
            variants={backgroundVariants}
            initial="initial"
            animate="animate"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/10 via-orange-100/5 to-amber-50/10"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-200/5 to-transparent"></div>
          </motion.div>

          {/* Particules flottantes */}
          {showParticles && (
            <div className="absolute inset-0 overflow-hidden">
              {particles.map((particle) => (
                <motion.div
                  key={particle.id}
                  className="particle"
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                  }}
                  animate={{
                    y: [-20, 20, -20],
                    x: [-10, 10, -10],
                    rotate: [0, 360, 0],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{
                    duration: particle.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: particle.delay
                  }}
                />
              ))}
            </div>
          )}

          {/* Contenu principal */}
          <motion.div
            className="relative z-10 flex flex-col items-center justify-center space-y-6"
            variants={contentVariants}
            initial="initial"
            animate="animate"
          >
            {/* Logo ou icône du musée */}
            <motion.div
              className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 flex items-center justify-center shadow-2xl"
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.div
                className="w-8 h-8 text-white"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </motion.div>
            </motion.div>

            {/* Spinner de chargement */}
            <LoadingSpinner
              size="large"
              variant={variant}
              text={message}
              showText={true}
            />

            {/* Barre de progression */}
            {showProgress && (
              <motion.div
                className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 rounded-full"
                  variants={progressVariants}
                  initial="initial"
                  animate="animate"
                  custom={progress}
                />
              </motion.div>
            )}

            {/* Message de chargement avec animation de points */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.p
                className="text-amber-100 text-lg font-medium"
                animate={{
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {message}
              </motion.p>
              
              {/* Points de suspension animés */}
              <motion.div
                className="flex justify-center space-x-1 mt-2"
                initial="initial"
                animate="animate"
              >
                {[0, 1, 2].map((index) => (
                  <motion.span
                    key={index}
                    className="text-amber-300 text-xl"
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scale: [0.8, 1.2, 0.8]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.3
                    }}
                  >
                    .
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>

            {/* Texte d'inspiration */}
            <motion.div
              className="text-center max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <motion.p
                className="text-amber-200/80 text-sm italic"
                animate={{
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                "L'art est le langage universel de l'humanité"
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLoader;
