import React from 'react';
import { Info, CheckCircle2 } from 'lucide-react';

export default function TariffCard({ tarif, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect?.(tarif.code)}
      className={`relative w-full text-left border rounded-xl p-4 transition shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-museum-primary/60 ${
        selected ? 'border-museum-primary ring-2 ring-museum-primary/60 bg-museum-primary/5' : 'border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-gray-600">{tarif.label}</div>
          <div className="text-2xl md:text-3xl font-semibold text-museum-primary">{tarif.prix} FCFA</div>
        </div>
        {selected && (
          <CheckCircle2 className="text-museum-primary" />
        )}
      </div>
      {tarif.conditions && (
        <div className="mt-2 text-xs text-gray-600 inline-flex items-center gap-1">
          <Info size={12} /> {tarif.conditions}
        </div>
      )}
      {tarif.preuve && (
        <div className="mt-1 text-[11px] text-gray-500">Preuve: {tarif.preuve}</div>
      )}
    </button>
  );
}


