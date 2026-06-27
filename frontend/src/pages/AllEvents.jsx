import { useState, useMemo } from 'react';
import SubEventCard from '../components/SubEventCard';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';

export default function AllEvents() {
  const { subEvents, user, isRegistered, register } = useApp();
  const [category, setCategory] = useState('All');
  const [day, setDay] = useState('All');

  const days = useMemo(() => {
    const set = new Set(subEvents.map(e => new Date(e.dateTime).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })));
    return ['All', ...set];
  }, [subEvents]);

  const filtered = subEvents.filter(e => {
    const evDay = new Date(e.dateTime).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    return (category === 'All' || e.category === category) && (day === 'All' || evDay === day);
  });

  function handleRegister(id) {
    if (!user) { window.location.href = '/login'; return; }
    register(id);
  }

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <h1 className="font-display font-bold text-2xl mb-1">All Sub-Events</h1>
      <p className="text-white/40 text-sm mb-6">{filtered.length} of {subEvents.length} events</p>

      <div className="flex flex-wrap gap-2 mb-7">
        {['All', ...CATEGORIES].map(c => (
          <button key={c} onClick={() => setCategory(c)}
            className={`pill border ${category === c ? 'bg-purple-light border-purple-light text-white' : 'border-white/10 text-white/50 hover:text-white'}`}>
            {c}
          </button>
        ))}
        <span className="w-px bg-white/10 mx-1" />
        {days.map(d => (
          <button key={d} onClick={() => setDay(d)}
            className={`pill border ${day === d ? 'bg-white/10 border-white/20 text-white' : 'border-white/10 text-white/50 hover:text-white'}`}>
            {d}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card p-10 text-center text-white/40">No sub-events match these filters yet.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(ev => (
            <SubEventCard key={ev.subEventId} event={ev} registered={isRegistered(ev.subEventId)} onRegister={handleRegister} />
          ))}
        </div>
      )}
    </div>
  );
}
