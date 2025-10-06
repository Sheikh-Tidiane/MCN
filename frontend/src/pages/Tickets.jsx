import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Ticket, Users, CreditCard, Edit } from 'lucide-react';
import VisitCalendar from '../components/Calendar/VisitCalendar';
import PricingService from '../services/pricingService';
import TariffCard from '../components/Tarifs/TariffCard';
import { useTranslation } from 'react-i18next';
import TicketService from '../services/ticketService';
import OrderService from '../services/orderService';
import PaymentService from '../services/paymentService';
import { useVisitorId } from '../hooks/useVisitorId';
import { useNavigate } from 'react-router-dom';

const stepOrder = ['date', 'creneau', 'type', 'quantite', 'visiteur', 'resume', 'paiement'];

const Tickets = () => {
  const { t } = useTranslation();
  const { visitorId } = useVisitorId();
  const navigate = useNavigate();
  const [step, setStep] = useState('date');
  const [date, setDate] = useState('');
  const [type, setType] = useState('standard');
  const [tarifs, setTarifs] = useState([]);
  const [creneaux, setCreneaux] = useState([]);
  const [heure, setHeure] = useState('');
  const [quantites, setQuantites] = useState({ adulte: 1, etudiant: 0, enfant: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [visitorInfo, setVisitorInfo] = useState({ prenom: '', nom: '', email: '', telephone: '' });

  const total = useMemo(() => {
    const tarifs = { adulte: 5000, etudiant: 3000, enfant: 2000 };
    return Object.entries(quantites).reduce((acc, [k, q]) => acc + (tarifs[k] * q), 0);
  }, [quantites]);

  useEffect(() => {
    // Charger tarifs au montage
    (async () => {
      try {
        const t = await PricingService.getTarifs();
        setTarifs(t);
      } catch (_) {}
    })();
  }, []);

  useEffect(() => {
    const fetchDispo = async () => {
      if (!date) return;
      try {
        setLoading(true);
        setError('');
        const data = await TicketService.getDisponibilites({ date, type });
        setCreneaux(data);
      } catch (e) {
        setError('Impossible de charger les disponibilités.');
      } finally {
        setLoading(false);
      }
    };
    fetchDispo();
  }, [date, type]);

  const goNext = () => {
    const idx = stepOrder.indexOf(step);
    if (idx < stepOrder.length - 1) setStep(stepOrder[idx + 1]);
  };
  const goBack = () => {
    const idx = stepOrder.indexOf(step);
    if (idx > 0) setStep(stepOrder[idx - 1]);
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      setError('');
      // créer un billet par catégorie non-nulle
      const creations = [];
      for (const [categorie, qte] of Object.entries(quantites)) {
        if (qte > 0) {
          for (let i = 0; i < qte; i++) {
            creations.push(TicketService.creerBillet({
              visiteur_uuid: visitorId,
              type: categorie === 'adulte' ? 'standard' : (categorie === 'etudiant' ? 'etudiant' : 'enfant'),
              prix: categorie === 'adulte' ? 5000 : (categorie === 'etudiant' ? 3000 : 2000),
              date_visite: date,
              heure_visite: heure,
            }));
          }
        }
      }
      await Promise.all(creations);
      setStep('paiement');
    } catch (e) {
      setError("La création de la réservation a échoué.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayerSurPlace = async () => {
    try {
      setLoading(true);
      setError('');
      if (!visitorInfo.email || !visitorInfo.prenom || !visitorInfo.nom) {
        setStep('visiteur');
        setError('Veuillez renseigner vos informations (nom, prénom, email).');
        setLoading(false);
        return;
      }
      const items = [
        { type: 'adulte', quantite: quantites.adulte, prix_unitaire: 5000 },
        { type: 'etudiant', quantite: quantites.etudiant, prix_unitaire: 3000 },
        { type: 'enfant', quantite: quantites.enfant, prix_unitaire: 2000 },
      ].filter(i => i.quantite > 0);
      await OrderService.create({ visiteur_uuid: visitorId, items, methode_paiement: 'sur_place', visitor: visitorInfo });
      navigate('/tickets/confirmation', { state: { date, heure, quantites, total } });
    } catch (e) {
      setError('La création de la commande a échoué.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayerEnLigne = async () => {
    try {
      setLoading(true);
      setError('');
      const amount = total * 100; // en XOF centimes si nécessaire
      const cs = await PaymentService.createStripeIntent({ amount, currency: 'xof', metadata: { visitorId } });
      setClientSecret(cs);
      alert('Intent de paiement créé. Intégration Stripe front à compléter.');
    } catch (e) {
      setError("Échec de l'initialisation du paiement en ligne.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-museum-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-museum-primary mb-2">
            {t('tickets.title')}
          </h1>
          <p className="text-gray-700">Réservez vos billets pour une visite inoubliable</p>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Barre de progression + étapes */}
            <div className="space-y-3">
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-museum-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${((stepOrder.indexOf(step)+1)/stepOrder.length)*100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <div className="flex flex-wrap gap-2 text-[11px] sm:text-xs">
                {stepOrder.map((s, i) => (
                  <span
                    key={s}
                    className={`px-3 py-1 rounded-full border transition ${step === s ? 'bg-museum-primary text-white border-museum-primary shadow-sm' : (i < stepOrder.indexOf(step) ? 'bg-museum-primary/10 text-museum-primary border-museum-primary/30' : 'bg-white text-gray-700 border-gray-300')}`}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4 text-red-700">{error}</div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                {/* Étape: Date */}
                {step === 'date' && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center gap-3 mb-4"><Calendar size={20} /> <h3 className="font-semibold">Choisissez votre date</h3></div>
                    <VisitCalendar value={date} onChange={setDate} />
                    <div className="mt-6 flex justify-end">
                      <button disabled={!date} onClick={goNext} className="px-4 py-2 bg-museum-primary text-white rounded disabled:opacity-50">Continuer</button>
                    </div>
                  </div>
                )}

                {/* Étape: Créneau */}
                {step === 'creneau' && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center gap-3 mb-4"><Clock size={20} /> <h3 className="font-semibold">Sélectionnez un créneau</h3></div>
                    {loading ? (
                      <div>Chargement...</div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {creneaux.map(c => (
                          <button key={c.heure} onClick={() => setHeure(c.heure)} className={`border rounded px-3 py-2 text-left ${heure === c.heure ? 'border-black' : 'border-gray-300'}`} disabled={c.complet}>
                            <div className="font-medium">{c.heure}</div>
                            <div className="text-xs text-gray-500">{c.restants} places restantes</div>
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="mt-6 flex justify-between">
                      <button onClick={goBack} className="px-4 py-2 border rounded">Retour</button>
                      <button disabled={!heure} onClick={goNext} className="px-4 py-2 bg-black text-white rounded disabled:opacity-50">Continuer</button>
                    </div>
                  </div>
                )}

                {/* Étape: Type */}
                {step === 'type' && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center gap-3 mb-4"><Ticket size={20} /> <h3 className="font-semibold">Type de billet</h3></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {tarifs.map((tf) => (
                        <TariffCard key={tf.code} tarif={tf} selected={type === tf.code} onSelect={setType} />
                      ))}
                    </div>
                    <div className="mt-6 flex justify-between">
                      <button onClick={goBack} className="px-4 py-2 border rounded">Retour</button>
                      <button onClick={goNext} className="px-4 py-2 bg-museum-primary text-white rounded">Continuer</button>
                    </div>
                  </div>
                )}

                {/* Étape: Quantité */}
                {step === 'quantite' && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center gap-3 mb-4"><Users size={20} /> <h3 className="font-semibold">Nombre de billets</h3></div>
                    {['adulte','etudiant','enfant'].map(cat => (
                      <div key={cat} className="flex items-center justify-between border-b py-3">
                        <span className="capitalize">{cat}</span>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setQuantites(q => ({ ...q, [cat]: Math.max(0, q[cat]-1) }))} className="w-8 h-8 border rounded">-</button>
                          <span className="w-6 text-center">{quantites[cat]}</span>
                          <button onClick={() => setQuantites(q => ({ ...q, [cat]: Math.min(10, q[cat]+1) }))} className="w-8 h-8 border rounded">+</button>
                        </div>
                      </div>
                    ))}
                    <div className="mt-6 flex justify-between">
                      <button onClick={goBack} className="px-4 py-2 border rounded">Retour</button>
                      <button onClick={goNext} className="px-4 py-2 bg-museum-primary text-white rounded">Continuer</button>
                    </div>
                  </div>
                )}

                {/* Étape: Formulaire visiteur */}
                {step === 'visiteur' && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-semibold mb-4">Vos informations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Prénom</label>
                        <input className="w-full border rounded px-3 py-2" value={visitorInfo.prenom} onChange={e => setVisitorInfo(v => ({...v, prenom: e.target.value}))} />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Nom</label>
                        <input className="w-full border rounded px-3 py-2" value={visitorInfo.nom} onChange={e => setVisitorInfo(v => ({...v, nom: e.target.value}))} />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Email</label>
                        <input type="email" className="w-full border rounded px-3 py-2" value={visitorInfo.email} onChange={e => setVisitorInfo(v => ({...v, email: e.target.value}))} />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Téléphone</label>
                        <input className="w-full border rounded px-3 py-2" value={visitorInfo.telephone} onChange={e => setVisitorInfo(v => ({...v, telephone: e.target.value}))} />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-between">
                      <button onClick={goBack} className="px-4 py-2 border rounded">Retour</button>
                      <button disabled={!visitorInfo.email || !visitorInfo.prenom || !visitorInfo.nom} onClick={goNext} className="px-4 py-2 bg-museum-primary text-white rounded disabled:opacity-50">Continuer</button>
                    </div>
                  </div>
                )}

                {/* Étape: Résumé */}
                {step === 'resume' && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-semibold mb-4">Récapitulatif</h3>
                    <ul className="text-sm text-gray-700 mb-4">
                      <li>Date: {date}</li>
                      <li>Créneau: {heure}</li>
                      <li>Quantités: adulte {quantites.adulte}, étudiant {quantites.etudiant}, enfant {quantites.enfant}</li>
                      <li>Visiteur: {visitorInfo.prenom} {visitorInfo.nom} ({visitorInfo.email})</li>
                    </ul>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold">Total: {total} FCFA</div>
                      <div className="flex gap-2">
                        <button onClick={goBack} className="px-4 py-2 border rounded">Retour</button>
                        <button disabled={total === 0} onClick={handleCreate} className="px-4 py-2 bg-museum-primary text-white rounded disabled:opacity-50">Confirmer</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Étape: Paiement */}
                {step === 'paiement' && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center gap-3 mb-4"><CreditCard size={20} /> <h3 className="font-semibold">Paiement</h3></div>
                    <p className="text-gray-600 mb-4">Choisissez votre méthode de paiement ou payez sur place.</p>
                    <div className="flex gap-3">
                      <button onClick={handlePayerEnLigne} className="px-4 py-2 border rounded border-museum-primary text-museum-primary">Payer en ligne</button>
                      <button onClick={handlePayerSurPlace} className="px-4 py-2 border rounded border-museum-secondary text-museum-secondary">Réserver et payer sur place</button>
                    </div>
                    {clientSecret && (
                      <p className="text-xs text-gray-500 mt-3">Client secret reçu (Stripe). Intégrez Elements pour finaliser.</p>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            {/* Fin colonne contenu */}
          </div>
          {/* Résumé latéral */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-5 sticky top-24">
              <h4 className="font-serif text-lg text-museum-primary mb-3">Votre panier</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Date</span><span>{date || '-'}</span></div>
                <div className="flex justify-between"><span>Créneau</span><span>{heure || '-'}</span></div>
                <div className="border-t pt-2">
                  <div className="flex justify-between"><span>Adulte</span><span>{quantites.adulte}</span></div>
                  <div className="flex justify-between"><span>Étudiant</span><span>{quantites.etudiant}</span></div>
                  <div className="flex justify-between"><span>Enfant</span><span>{quantites.enfant}</span></div>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold text-museum-primary">
                  <span>Total</span><span>{total} FCFA</span>
                </div>
              </div>
              <button onClick={() => setStep('quantite')} className="mt-4 w-full flex items-center justify-center gap-2 text-sm text-museum-secondary">
                <Edit size={14} /> Modifier
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Tickets;
