import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FEST, SUB_EVENTS } from '../data/mockData';

function useCountdown(target) {
  const [left, setLeft] = useState(target - Date.now());
  useEffect(() => {
    const id = setInterval(() => setLeft(target - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);
  const clamped = Math.max(left, 0);
  const d = Math.floor(clamped / 86400000);
  const h = Math.floor((clamped % 86400000) / 3600000);
  const m = Math.floor((clamped % 3600000) / 60000);
  const s = Math.floor((clamped % 60000) / 1000);
  return { d, h, m, s };
}

export default function Home() {
  const { d, h, m, s } = useCountdown(new Date(FEST.startDate).getTime());
  const highlights = SUB_EVENTS.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-5 pt-20 pb-16 text-center">
        <p className="text-purple-light font-medium text-sm mb-4 tracking-wide">{FEST.venue} · Sept 12–13, 2026</p>
        <h1 className="font-display font-bold text-4xl sm:text-6xl leading-[1.05] mb-5">
          {FEST.name}.<br />One pass, every event.
        </h1>
        <p className="text-white/50 max-w-xl mx-auto mb-10">
          Register once, unlock 9 sub-events, and get a personal clash-free schedule —
          no more juggling separate forms for every competition.
        </p>

        <div className="flex justify-center gap-3 sm:gap-5 mb-12">
          {[['Days', d], ['Hours', h], ['Mins', m], ['Secs', s]].map(([label, val]) => (
            <div key={label} className="card w-16 sm:w-20 py-3">
              <div className="font-display font-bold text-2xl tabular-nums">{String(val).padStart(2, '0')}</div>
              <div className="text-[10px] text-white/40 uppercase tracking-wide mt-1">{label}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-3">
          <Link to="/events" className="btn-primary">Browse Sub-Events</Link>
          <Link to="/schedule" className="btn-ghost">View Fest Schedule</Link>
        </div>
      </section>

      {/* Highlighted sub-events */}
      <section className="max-w-6xl mx-auto px-5 pb-16">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-semibold text-xl">Highlighted Sub-Events</h2>
          <Link to="/events" className="text-sm text-purple-light hover:underline">See all →</Link>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {highlights.map(ev => (
            <Link key={ev.subEventId} to={`/events/${ev.subEventId}`} className="card p-5 hover:border-purple-light/40 transition-colors">
              <p className="text-xs text-purple-light font-medium mb-2">{ev.category}</p>
              <h3 className="font-display font-semibold mb-1">{ev.title}</h3>
              <p className="text-xs text-white/40">{new Date(ev.dateTime).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} · {ev.venue}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Organizing committee */}
      <section className="max-w-6xl mx-auto px-5 pb-20">
        <div className="card p-6 flex flex-wrap gap-6 justify-between items-center">
          <div>
            <h3 className="font-display font-semibold mb-1">Organizing Committee</h3>
            <p className="text-sm text-white/40">Team CodeSpark · Student Council, with faculty oversight on venue allocation</p>
          </div>
          <Link to="/contact" className="btn-ghost text-sm">Get in touch</Link>
        </div>
      </section>
    </div>
  );
}
