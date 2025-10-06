import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import CalendarService from '../../services/calendarService';

dayjs.locale('fr');

const WEEK_DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export default function VisitCalendar({ value, onChange }) {
  const initialMonth = value ? dayjs(value).format('YYYY-MM') : dayjs().format('YYYY-MM');
  const [month, setMonth] = useState(initialMonth);
  const [closures, setClosures] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const firstDay = useMemo(() => dayjs(`${month}-01`), [month]);
  const daysInMonth = firstDay.daysInMonth();
  const startWeekdayIndex = (firstDay.day() + 6) % 7; // Lundi=0

  const days = useMemo(() => {
    const result = [];
    for (let i = 0; i < startWeekdayIndex; i++) result.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      result.push(dayjs(`${month}-${String(d).padStart(2,'0')}`));
    }
    return result;
  }, [month, daysInMonth, startWeekdayIndex]);

  const closureSet = useMemo(() => new Set(closures.map(c => dayjs(c.date).format('YYYY-MM-DD'))), [closures]);
  const eventsMap = useMemo(() => {
    const m = new Map();
    for (const ev of events) {
      const key = dayjs(ev.date).format('YYYY-MM-DD');
      const arr = m.get(key) || [];
      arr.push(ev);
      m.set(key, arr);
    }
    return m;
  }, [events]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      try {
        const data = await CalendarService.getMonth({ month });
        if (!ignore) {
          setClosures(data.closures || []);
          setEvents(data.events || []);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [month]);

  function prevMonth() {
    setMonth(dayjs(`${month}-01`).subtract(1, 'month').format('YYYY-MM'));
  }
  function nextMonth() {
    setMonth(dayjs(`${month}-01`).add(1, 'month').format('YYYY-MM'));
  }

  function selectDate(d) {
    if (!d) return;
    const key = d.format('YYYY-MM-DD');
    if (closureSet.has(key)) return; // disabled
    if (d.isBefore(dayjs().startOf('day'))) return; // past date disabled
    onChange?.(key);
  }

  return (
    <div className="border rounded-xl overflow-hidden bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <button onClick={prevMonth} className="p-2 rounded hover:bg-gray-100 transition" aria-label="Mois précédent"><ChevronLeft size={18} /></button>
        <div className="font-serif font-semibold text-lg md:text-xl capitalize tracking-wide">{firstDay.format('MMMM YYYY')}</div>
        <button onClick={nextMonth} className="p-2 rounded hover:bg-gray-100 transition" aria-label="Mois suivant"><ChevronRight size={18} /></button>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {WEEK_DAYS.map((wd, i) => (
          <div key={i} className="bg-gray-50 text-[11px] uppercase tracking-wide text-gray-600 font-medium text-center py-2">{wd}</div>
        ))}
        {days.map((d, i) => {
          if (!d) return <div key={i} className="bg-white h-12" />;
          const key = d.format('YYYY-MM-DD');
          const closed = closureSet.has(key);
          const dayEvents = eventsMap.get(key) || [];
          const isToday = key === dayjs().format('YYYY-MM-DD');
          const selected = value === key;
          const isPast = d.isBefore(dayjs().startOf('day'));
          return (
            <button
              key={i}
              onClick={() => selectDate(d)}
              className={
                `relative bg-white h-16 md:h-20 text-sm text-left px-2 py-1 transition ${
                  closed || isPast ? 'text-gray-300 cursor-not-allowed bg-gray-50' : 'hover:bg-gray-50'
                } ${selected ? 'ring-2 ring-museum-primary/70 bg-museum-primary/5' : 'border-transparent'}`
              }
              disabled={closed || isPast}
            >
              <div className={`font-medium ${isToday ? 'text-museum-primary' : 'text-gray-800'}`}>{d.date()}</div>
              {dayEvents.length > 0 && (
                <div className="absolute bottom-1 left-1 right-1 flex gap-1.5 flex-wrap">
                  {dayEvents.slice(0,3).map((ev, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-museum-primary/10 text-museum-primary">
                      <span className="w-1.5 h-1.5 rounded-full bg-museum-primary" /> {ev.title}
                    </span>
                  ))}
                  {dayEvents.length > 3 && (
                    <span className="text-[10px] text-gray-500">+{dayEvents.length - 3}</span>
                  )}
                </div>
              )}
              {closed && (
                <span className="absolute bottom-1 right-1 text-[10px] text-red-500">Fermé</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4 px-4 py-3 border-t text-xs">
        <div className="inline-flex items-center gap-2"><span className="w-3 h-3 inline-block rounded bg-gray-200" /> Jour vide</div>
        <div className="inline-flex items-center gap-2"><span className="w-3 h-3 inline-block rounded bg-red-200" /> Fermé</div>
        <div className="inline-flex items-center gap-2"><span className="w-3 h-3 inline-block rounded bg-museum-primary/20" /> Événement</div>
      </div>

      {loading && (
        <div className="px-4 py-2 text-xs text-gray-500">Chargement du calendrier…</div>
      )}
    </div>
  );
}


