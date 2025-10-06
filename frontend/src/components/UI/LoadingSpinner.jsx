import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ 
  size = 'large', 
  variant = 'museum', 
  text = 'Chargement...',
  showText = true 
}) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xl: 'text-xl'
  };

  // Animation variants pour différents styles
  const spinnerVariants = {
    museum: {
      animate: {
        rotate: 360,
        scale: [1, 1.1, 1],
      },
      transition: {
        rotate: {
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        },
        scale: {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },
    pulse: {
      animate: {
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7]
      },
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    wave: {
      animate: {
        y: [0, -10, 0],
        rotate: [0, 5, -5, 0]
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const containerVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  const textVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.5
      }
    }
  };

  const dotsVariants = {
    animate: {
      opacity: [0.3, 1, 0.3],
      scale: [0.8, 1.2, 0.8]
    },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'museum':
        return (
          <motion.div
            className={`${sizeClasses[size]} relative`}
            variants={spinnerVariants.museum}
            animate="animate"
          >
            {/* Cercle principal avec gradient africain */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 opacity-20"></div>
            
            {/* Cercle animé */}
            <motion.div
              className="absolute inset-1 rounded-full border-4 border-transparent"
              style={{
                background: 'linear-gradient(45deg, #8B4513, #D4AF37, #E67E22, #8B4513)',
                backgroundSize: '400% 400%'
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Cercle intérieur avec rotation inverse */}
            <motion.div
              className="absolute inset-2 rounded-full border-2 border-amber-300"
              animate={{ rotate: -360 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Point central */}
            <motion.div
              className="absolute top-1/2 left-1/2 w-2 h-2 bg-amber-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        );

      case 'pulse':
        return (
          <motion.div
            className={`${sizeClasses[size]} relative`}
            variants={spinnerVariants.pulse}
            animate="animate"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 opacity-60"></div>
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        );

      case 'wave':
        return (
          <motion.div
            className={`${sizeClasses[size]} flex items-center justify-center space-x-1`}
            variants={spinnerVariants.wave}
            animate="animate"
          >
            {[0, 1, 2, 3].map((index) => (
              <motion.div
                key={index}
                className="w-2 h-8 bg-gradient-to-t from-amber-400 to-orange-500 rounded-full"
                animate={{
                  scaleY: [1, 2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.2
                }}
              />
            ))}
          </motion.div>
        );

      case 'dots':
        return (
          <motion.div
            className={`${sizeClasses[size]} flex items-center justify-center space-x-2`}
            initial="initial"
            animate="animate"
          >
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-3 h-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                variants={dotsVariants}
                animate="animate"
                transition={{
                  delay: index * 0.2,
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        );

      default:
        return (
          <motion.div
            className={`${sizeClasses[size]} border-4 border-amber-200 border-t-amber-500 rounded-full`}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        );
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center space-y-4"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {renderSpinner()}
      
      {showText && (
        <motion.div
          className="text-center"
          variants={textVariants}
          initial="initial"
          animate="animate"
        >
          <motion.p
            className={`${textSizeClasses[size]} text-amber-600 font-medium`}
            animate={{
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {text}
          </motion.p>
          
          {/* Points de suspension animés */}
          <motion.div
            className="flex justify-center space-x-1 mt-1"
            initial="initial"
            animate="animate"
          >
            {[0, 1, 2].map((index) => (
              <motion.span
                key={index}
                className="text-amber-500"
                animate={{
                  opacity: [0.3, 1, 0.3]
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
      )}
    </motion.div>
  );
};

export default LoadingSpinner;
