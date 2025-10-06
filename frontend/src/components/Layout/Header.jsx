import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, QrCode, Globe, ShoppingBag, Ticket, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../hooks/useLanguage';
import { useDeviceType } from '../../hooks/useDeviceType';
import Logo from '../UI/Logo';
import SearchModal from '../UI/SearchModal';

const Header = () => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  const deviceType = useDeviceType();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const languageRef = useRef(null);

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/collections', label: t('nav.collections') },
    { path: '/visit', label: t('nav.visit') },
    { path: '/shop', label: t('nav.shop') },
    { path: '/tickets', label: t('nav.tickets') },
    { path: '/about', label: t('nav.about') },
    { path: '/contact', label: t('nav.contact') }
  ];

  const isActive = (path) => location.pathname === path;

  // Fermer le menu de langue quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <motion.header 
      className="bg-white shadow-lg sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 sm:h-24 lg:h-32 xl:h-36">
          {/* Logo */}
          <Logo size="lg" showText={false} className="flex-shrink-0" />

          {/* Desktop Navigation */}
          {deviceType !== 'mobile' && (
            <nav className="hidden lg:flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                    isActive(item.path)
                      ? 'text-museum-primary'
                      : 'text-gray-700 hover:text-museum-primary'
                  }`}
                >
                  {item.label}
                  {isActive(item.path) && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-museum-primary"
                      layoutId="activeTab"
                    />
                  )}
                </Link>
              ))}
            </nav>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Language Selector */}
            <div className="relative" ref={languageRef}>
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-1 px-2 sm:px-3 py-2 text-sm font-medium text-gray-700 hover:text-museum-primary transition-colors rounded-lg hover:bg-gray-50"
              >
                <Globe size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline text-xs sm:text-sm">{currentLanguage.toUpperCase()}</span>
                <motion.div
                  animate={{ rotate: isLanguageOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={12} className="sm:w-3.5 sm:h-3.5" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {isLanguageOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-44 sm:w-48 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100"
                  >
                    {availableLanguages.map((lang) => (
                      <motion.button
                        key={lang.code}
                        onClick={() => {
                          changeLanguage(lang.code);
                          setIsLanguageOpen(false);
                        }}
                        whileHover={{ backgroundColor: currentLanguage === lang.code ? '' : '#f3f4f6' }}
                        className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm flex items-center space-x-2 sm:space-x-3 rounded-md mx-1 sm:mx-2 transition-colors ${
                          currentLanguage === lang.code 
                            ? 'bg-museum-primary text-white' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span className="font-medium">{lang.name}</span>
                        {currentLanguage === lang.code && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto"
                          >
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-1.5 sm:p-2 text-gray-700 hover:text-museum-primary transition-colors hover:bg-gray-100 rounded-lg"
                title={t('nav.search')}
              >
                <Search size={16} className="sm:w-5 sm:h-5" />
              </button>
              
              <Link
                to="/scan"
                className="p-1.5 sm:p-2 text-gray-700 hover:text-museum-primary transition-colors"
                title={t('hero.scan')}
              >
                <QrCode size={16} className="sm:w-5 sm:h-5" />
              </Link>
              
              <Link
                to="/shop"
                className="p-1.5 sm:p-2 text-gray-700 hover:text-museum-primary transition-colors relative"
                title={t('nav.shop')}
              >
                <ShoppingBag size={16} className="sm:w-5 sm:h-5" />
                <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-museum-primary text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-xs">
                  0
                </span>
              </Link>
              
              <Link
                to="/tickets"
                className="p-1.5 sm:p-2 text-gray-700 hover:text-museum-primary transition-colors"
                title={t('nav.tickets')}
              >
                <Ticket size={16} className="sm:w-5 sm:h-5" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            {deviceType === 'mobile' && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1.5 sm:p-2 text-gray-700 hover:text-museum-primary transition-colors"
              >
                {isMenuOpen ? <X size={20} className="sm:w-6 sm:h-6" /> : <Menu size={20} className="sm:w-6 sm:h-6" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && deviceType === 'mobile' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-200"
            >
              <nav className="py-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-2 text-base font-medium transition-colors ${
                      isActive(item.path)
                        ? 'text-museum-primary bg-museum-primary/10'
                        : 'text-gray-700 hover:text-museum-primary hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </motion.header>
  );
};

export default Header;
