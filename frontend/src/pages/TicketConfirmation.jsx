import React from 'react';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const TicketConfirmation = () => {
  const location = useLocation();
  const state = location.state || {};

  return (
    <div className="min-h-screen bg-museum-light">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}>
          <CheckCircle size={56} className="mx-auto text-museum-secondary mb-4" />
        </motion.div>
        <h1 className="text-2xl font-serif font-bold text-museum-primary mb-2">Réservation enregistrée</h1>
        <p className="text-gray-700 mb-6">Vous avez choisi de <strong>payer sur place</strong>. 
        Veuillez vous présenter à l’accueil du musée à la date et à l’heure sélectionnées pour finaliser votre achat et retirer votre billet.</p>

        <div className="bg-white rounded-lg shadow p-6 text-left">
          <h2 className="font-semibold mb-3">Récapitulatif</h2>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>Date: {state.date || '-'}</li>
            <li>Créneau: {state.heure || '-'}</li>
            <li>Adulte: {state.quantites?.adulte ?? 0}</li>
            <li>Étudiant: {state.quantites?.etudiant ?? 0}</li>
            <li>Enfant: {state.quantites?.enfant ?? 0}</li>
            <li>Total: {state.total ?? 0} FCFA</li>
          </ul>
        </div>

        <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
          <Link to="/" className="inline-block mt-8 px-6 py-3 border rounded border-museum-primary text-museum-primary shadow-sm hover:shadow-md">Retour à l’accueil</Link>
        </motion.div>
      </div>
    </div>
  );
};

export default TicketConfirmation;


