import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Logo from '../UI/Logo';

const Footer = () => {
  const { t } = useTranslation();

  const footerSections = [
    {
      title: t('nav.collections'),
      links: [
        { label: 'Peintures', href: '/collections/peintures' },
        { label: 'Sculptures', href: '/collections/sculptures' },
        { label: 'Art contemporain', href: '/collections/contemporain' },
        { label: 'Art traditionnel', href: '/collections/traditionnel' }
      ]
    },
    {
      title: t('nav.visit'),
      links: [
        { label: 'Horaires', href: '/visit/hours' },
        { label: 'Tarifs', href: '/visit/prices' },
        { label: 'Visites guidées', href: '/visit/guided' },
        { label: 'Accessibilité', href: '/visit/accessibility' }
      ]
    },
    {
      title: t('nav.shop'),
      links: [
        { label: 'Livres', href: '/shop/books' },
        { label: 'Souvenirs', href: '/shop/souvenirs' },
        { label: 'Artisanat', href: '/shop/artisanat' },
        { label: 'Nouveautés', href: '/shop/new' }
      ]
    },
    {
      title: 'Informations',
      links: [
        { label: 'À propos', href: '/about' },
        { label: 'Contact', href: '/contact' },
        { label: 'Presse', href: '/press' },
        { label: 'Partenaires', href: '/partners' }
      ]
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Museum Info */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="mb-4">
                <Logo 
                  size="lg" 
                  showText={false} 
                  linkTo="/"
                  className="text-white"
                />
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Découvrez l'histoire et la culture des civilisations noires à travers 
                une collection exceptionnelle d'œuvres d'art et d'objets historiques.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-300">
                  <MapPin size={16} />
                  <span>Avenue Cheikh Anta Diop, Dakar, Sénégal</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Phone size={16} />
                  <span>+221 33 825 98 22</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Mail size={16} />
                  <span>contact@mcn.sn</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Clock size={16} />
                  <span>Ouvert tous les jours 9h-18h</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-4 text-museum-primary">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Social Media */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 mt-8 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-museum-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-museum-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-museum-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-museum-primary transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </a>
            </div>
            
            <p className="text-gray-400 text-sm">
              © 2025 Musée des Civilisations Noires. Tous droits réservés.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;