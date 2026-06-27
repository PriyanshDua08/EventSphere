import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

function overlaps(a, b) {
  const aStart = new Date(a.dateTime).getTime();
  const aEnd = aStart + a.durationMins * 60000;
  const bStart = new Date(b.dateTime).getTime();
  const bEnd = bStart + b.durationMins * 60000;
  return aStart < bEnd && bStart < aEnd;
}

export default function Schedule() {
  const { subEvents, user, myRegistrations } = useApp();
  const myEventIds = myRegistrations.map(r => r.subEventId);

  const clashes = useMemo(() => {
    const mine = subEvents.filter(e => myEventIds.includes(e.subEventId));
    const set = new Set();
    for (let i = 0; i < mine.length; i++) {
      for (let j = i + 1; j < mine.length; j++) {
        if (overlaps(mine[i], mine[j])) { set.add(mine[i].subEventId); set.add(mine[j].subEventId); }
      }
    }
    return set;
  }, [subEvents, myEventIds]);

  const byDay = useMemo(() => {
    const groups = {};
    [...subEvents].sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime)).forEach(e => {
      const day = new Date(e.dateTime).toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'short' });
      (groups[day] ||= []).push(e);
    });
    return groups;
  }, [subEvents]);

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <h1 className="font-display font-bold text-2xl mb-1">Fest Schedule</h1>
      <p className="text-white/40 text-sm mb-2">Every sub-event, in order. {user ? "Your registered events are highlighted." : "Log in to see clashes against your own registrations."}</p>
      {clashes.size > 0 && (
        <div className="card !bg-danger/10 border-danger/30 p-3 mb-6 text-sm text-danger flex items-center gap-2">
          ⚠ You have {clashes.size} overlapping sub-events — see flagged rows below.
        </div>
      )}

      <div className="space-y-8 mt-6">
        {Object.entries(byDay).map(([day, events]) => (
          <div key={day}>
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-3">{day}</h2>
            <div className="space-y-2">
              {events.map(ev => {
                const mine = myEventIds.includes(ev.subEventId);
                const clashed = clashes.has(ev.subEventId);
                return (
                  <Link
                    key={ev.subEventId}
                    to={`/events/${ev.subEventId}`}
                    className={`card flex items-center gap-4 p-4 transition-colors hover:border-purple-light/40
                      ${clashed ? 'border-danger/50 !bg-danger/5' : mine ? 'border-purple-light/40 !bg-purple-light/5' : ''}`}
                  >
                    <div className="w-16 text-sm text-white/60 font-medium shrink-0">
                      {new Date(ev.dateTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="w-px h-8 bg-white/10 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{ev.title}</p>
                      <p className="text-xs text-white/40">{ev.venue} · {ev.category}</p>
                    </div>
                    {clashed && <span className="pill bg-danger/20 text-danger shrink-0">Clash</span>}
                    {mine && !clashed && <span className="pill bg-purple-light/20 text-purple-light shrink-0">Yours</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
