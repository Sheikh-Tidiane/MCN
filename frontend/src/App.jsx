import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';

// Import i18n
import './i18n';

// Components
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import PageLoader from './components/UI/PageLoader';
import LoadingSpinner from './components/UI/LoadingSpinner';
import { useVisitorId } from './hooks/useVisitorId';
import OfflineIndicator from './components/UI/OfflineIndicator';

// Hooks
import { useGlobalLoading, usePageLoading } from './hooks/useLoading';

// Pages
import Home from './pages/Home';
import Collections from './pages/Collections';
import OeuvreDetail from './components/Oeuvre/OeuvreDetail';
import Visit from './pages/Visit';
import Shop from './pages/Shop';
import Tickets from './pages/Tickets';
import TicketConfirmation from './pages/TicketConfirmation';
import About from './pages/About';
import Contact from './pages/Contact';
import Scan from './pages/Scan';
import LoadingDemo from './components/UI/LoadingDemo';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import RequireAuth from './components/Auth/RequireAuth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
};

function App() {
  const { visitorId } = useVisitorId();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { globalLoading, loadingMessage, showGlobalLoading, hideGlobalLoading } = useGlobalLoading();
  const { pageLoading, loadingProgress, startPageLoading, updateProgress, completePageLoading } = usePageLoading();

  // Simulation du chargement initial de l'application
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Gestion du chargement des pages
  useEffect(() => {
    const handleRouteChange = () => {
      startPageLoading();
      
      // Simulation du chargement de la page
      const progressInterval = setInterval(() => {
        updateProgress(prev => {
          const newProgress = prev + Math.random() * 30;
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            completePageLoading();
            return 100;
          }
          return newProgress;
        });
      }, 200);
    };

    // Écouter les changements de route
    window.addEventListener('beforeunload', handleRouteChange);
    
    return () => {
      window.removeEventListener('beforeunload', handleRouteChange);
    };
  }, [startPageLoading, updateProgress, completePageLoading]);

  // Fonction pour simuler le chargement global
  const simulateGlobalLoading = () => {
    showGlobalLoading('Chargement des données...');
    setTimeout(() => {
      hideGlobalLoading();
    }, 3000);
  };

  if (isInitialLoading) {
    return (
      <PageLoader
        isLoading={true}
        message="Initialisation du Musée..."
        variant="museum"
        showProgress={true}
        showParticles={true}
      />
    );
  }

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen bg-gray-50">
            {/* Loader global */}
            <PageLoader
              isLoading={globalLoading}
              message={loadingMessage}
              variant="museum"
              showProgress={true}
              showParticles={true}
            />

            {/* Loader de page */}
            {pageLoading && (
              <div className="fixed top-0 left-0 w-full h-1 z-50">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}

            {window.location.pathname !== '/mcn-admin/login' && <Header />}
            
            <AnimatePresence mode="wait">
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Home />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/collections" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Collections />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/oeuvre/:id" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <OeuvreDetail />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/visit" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Visit />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/shop" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Shop />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/tickets" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Tickets />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/tickets/confirmation" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <TicketConfirmation />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/about" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <About />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/contact" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Contact />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/scan" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Scan />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/loading-demo" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <LoadingDemo />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/mcn-admin/login" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <AdminLogin />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/mcn-admin" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <RequireAuth>
                        <AdminDashboard />
                      </RequireAuth>
                    </motion.div>
                  } 
                />
              </Routes>
            </AnimatePresence>
            
            {window.location.pathname !== '/mcn-admin/login' && <Footer />}
            <OfflineIndicator />
            
            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#8B4513',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
