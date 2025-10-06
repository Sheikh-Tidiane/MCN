import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Ticket, Accessibility, Info, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useVisitorId } from '../hooks/useVisitorId';
import { oeuvreService } from '../services/oeuvreService';

const Visit = () => {
  const { t } = useTranslation();
  const { visitorId } = useVisitorId();

  const [openFaq, setOpenFaq] = useState(null);
  const [tour, setTour] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef(null);

  // Build a simple playlist from available mock or API
  useEffect(() => {
    async function load() {
      try {
        const res = await oeuvreService.getAll({ limit: 10 });
        const list = (res?.data || res || []).slice(0, 6); // support mock and real
        setTour(list);
      } catch (_) {}
    }
    load();
  }, []);

  // Deep link support: step from querystring
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const step = parseInt(params.get('step') || '0', 10);
    if (!Number.isNaN(step)) setCurrentIndex(Math.max(0, step));
  }, []);

  const currentItem = useMemo(() => tour[currentIndex], [tour, currentIndex]);

  function goNext() {
    setCurrentIndex((i) => Math.min(i + 1, Math.max(tour.length - 1, 0)));
  }
  function goPrev() {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }

  function shareTour() {
    const url = new URL(window.location.href);
    url.searchParams.set('step', String(currentIndex));
    const shareUrl = url.toString();
    if (navigator.share) {
      navigator.share({ title: 'Visite virtuelle', url: shareUrl }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl).catch(() => {});
    }
  }

  // Persist and restore position per visitor
  useEffect(() => {
    if (!visitorId) return;
    const key = `tour_position_${visitorId}`;
    const saved = Number(localStorage.getItem(key));
    if (!Number.isNaN(saved) && saved >= 0) {
      setCurrentIndex(saved);
    }
  }, [visitorId]);

  useEffect(() => {
    if (!visitorId) return;
    const key = `tour_position_${visitorId}`;
    localStorage.setItem(key, String(currentIndex));
  }, [visitorId, currentIndex]);

  // Ask service worker to precache current tour items for offline
  async function precacheTour() {
    if (!('serviceWorker' in navigator)) return;
    const reg = await navigator.serviceWorker.getRegistration();
    if (!reg?.active) return;
    const urls = [];
    tour.forEach((item) => {
      if (item.image_principale) urls.push(item.image_principale);
      if (Array.isArray(item.medias)) {
        item.medias.forEach((m) => m?.url && urls.push(m.url));
      }
      if (item.audio_url) urls.push(item.audio_url);
      // detail page for each oeuvre (HTML shell + API will be cached as used)
      urls.push(`/oeuvre/${item.id}`);
    });
    reg.active.postMessage({ type: 'PRECACHE_URLS', payload: { urls } });
  }

  const faqs = [
    { q: 'Quels sont les horaires ?', a: 'Ouvert du lundi au vendredi: 9h00-18h00, samedi-dimanche: 10h00-19h00.' },
    { q: 'Où acheter des billets ?', a: 'En ligne (recommandé) ou sur place selon disponibilité.' },
    { q: 'Le musée est-il accessible PMR ?', a: 'Oui, ascenseurs, rampes d’accès, et sanitaires adaptés sont disponibles.' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/entre-musee.jpeg" alt="Entrée du musée" className="w-full h-[46vh] md:h-[56vh] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/30" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">{t('visit.title')}</h1>
            <p className="text-lg md:text-xl text-white/90 mb-6">Préparez votre visite: horaires, billets, accès et services.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="/tickets" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-museum-primary text-white font-semibold hover:bg-museum-secondary transition-colors">
                <Ticket size={18} /> Réserver des billets
              </a>
              <a href="#access" className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white/90 text-gray-900 font-semibold hover:bg-white transition-colors">Comment venir</a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Visite virtuelle simple */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Visite virtuelle</h2>
            <div className="flex gap-2">
              <button onClick={goPrev} className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200">Précédent</button>
              <button onClick={goNext} className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200">Suivant</button>
              <button onClick={shareTour} className="px-3 py-2 rounded bg-museum-primary text-white hover:bg-museum-secondary">Partager</button>

            </div>
          </div>

          {currentItem ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl overflow-hidden border border-gray-100">
                <img src={currentItem.image_principale || currentItem.medias?.[0]?.url || '/placeholder-artwork.svg'} alt={currentItem.titre} className="w-full h-80 object-cover" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{currentItem.titre}</h3>
                <p className="text-gray-700 mb-4 line-clamp-5">{currentItem.description || 'Description à venir.'}</p>
                {/* Audio guide si disponible */}
                {currentItem.audio_url && (
                  <audio ref={audioRef} controls className="w-full">
                    <source src={currentItem.audio_url} type="audio/mpeg" />
                  </audio>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-600">Chargement de la playlist…</p>
          )}

          {/* Vignettes */}
          {tour.length > 0 && (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {tour.map((item, idx) => (
                <button key={idx} onClick={() => setCurrentIndex(idx)} className={`rounded-lg overflow-hidden border ${idx === currentIndex ? 'border-museum-primary' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-museum-primary`}>
                  <img src={item.image_principale || item.medias?.[0]?.url || '/placeholder-artwork.svg'} alt={item.titre} className="w-full h-24 object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Infos principales */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4"><Clock className="text-museum-primary" size={22} /><h2 className="text-xl font-semibold">{t('visit.hours')}</h2></div>
            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between border-b border-gray-100 pb-2"><span>Lundi - Vendredi</span><span className="font-medium">9h00 - 18h00</span></div>
              <div className="flex justify-between"><span>Samedi - Dimanche</span><span className="font-medium">10h00 - 19h00</span></div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4"><Ticket className="text-museum-secondary" size={22} /><h2 className="text-xl font-semibold">Tarifs</h2></div>
            <ul className="space-y-2 text-gray-700">
              <li className="flex justify-between"><span>Plein tarif</span><span className="font-semibold">3 000 FCFA</span></li>
              <li className="flex justify-between"><span>Étudiants</span><span className="font-semibold">1 500 FCFA</span></li>
              <li className="flex justify-between"><span>-12 ans</span><span className="font-semibold">Gratuit</span></li>
            </ul>
            <a href="/tickets" className="mt-4 inline-block w-full text-center px-4 py-2 rounded-lg bg-museum-primary text-white font-semibold hover:bg-museum-secondary transition-colors">Acheter un billet</a>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4"><Shield className="text-amber-600" size={22} /><h2 className="text-xl font-semibold">Informations</h2></div>
            <ul className="text-gray-700 list-disc list-inside space-y-1">
              <li>Vestiaires et consignes disponibles</li>
              <li>Photos sans flash autorisées</li>
              <li>Wi-Fi gratuit dans le hall</li>
            </ul>
          </motion.div>
        </div>

        {/* Accès */}
        <div id="access" className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4"><MapPin className="text-museum-primary" size={22} /><h2 className="text-xl font-semibold">Accès</h2></div>
            <div className="space-y-3 text-gray-700">
              <p>Avenue Cheikh Anta Diop, Dakar, Sénégal</p>
              <p>Bus: Lignes 1, 3, 7 – Arrêt Musée</p>
              <p>Parking public à proximité</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-white rounded-2xl shadow overflow-hidden border border-gray-100">
            <div className="aspect-video w-full">
              <iframe title="Carte d'accès" src="https://www.google.com/maps?q=Dakar&output=embed" className="w-full h-full border-0" />
            </div>
          </motion.div>
        </div>

        {/* Services et accessibilité */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4"><Info className="text-museum-secondary" size={22} /><h2 className="text-xl font-semibold">Services</h2></div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
              <li>Guide audio (fr/en/wo)</li>
              <li>Visites guidées</li>
              <li>Boutique & librairie</li>
              <li>Café / Restaurant</li>
            </ul>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4"><Accessibility className="text-museum-primary" size={22} /><h2 className="text-xl font-semibold">Accessibilité</h2></div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
              <li>Ascenseurs et rampes</li>
              <li>Fauteuils roulants sur demande</li>
              <li>Signalétique claire</li>
              <li>Sanitaires adaptés</li>
            </ul>
          </motion.div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Questions fréquentes</h2>
          <div className="divide-y divide-gray-100">
            {faqs.map((item, idx) => (
              <div key={idx} className="py-3">
                <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)} className="w-full text-left flex items-center justify-between">
                  <span className="font-medium text-gray-900">{item.q}</span>
                  <span className="text-gray-500">{openFaq === idx ? '-' : '+'}</span>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === idx && (
                    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-gray-700 mt-2">
                      {item.a}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visit;
