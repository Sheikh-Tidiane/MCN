/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs principales du Musée des Civilisations Noires
        'museum-primary': '#2C3E50',      // Bleu profond africain
        'museum-secondary': '#E67E22',     // Orange terre d'Afrique
        'museum-accent': '#F39C12',        // Or africain
        'museum-dark': '#1A252F',          // Bleu très sombre
        'museum-light': '#ECF0F1',         // Gris très clair
        'museum-earth': '#8B4513',         // Terre cuite
        'museum-gold': '#D4AF37',          // Or traditionnel
        'museum-bronze': '#CD7F32',        // Bronze africain
        'museum-terracotta': '#E2725B',    // Terre cuite rouge
        'museum-ivory': '#F5F5DC',         // Ivoire
        'museum-charcoal': '#36454F'        // Charbon
      },
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
        'display': ['Cinzel', 'serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px'
      }
    },
  },
  plugins: [],
}