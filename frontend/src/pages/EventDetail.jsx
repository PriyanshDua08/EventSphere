import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import StatusPill from '../components/StatusPill';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { subEvents, user, isRegistered, register } = useApp();
  const ev = subEvents.find(e => e.subEventId === id);

  if (!ev) return <div className="max-w-2xl mx-auto px-5 py-16 text-center text-white/40">Sub-event not found.</div>;

  const seatsLeft = ev.capacity - ev.registered;
  const isFull = seatsLeft <= 0;
  const registered = isRegistered(ev.subEventId);

  function handleRegister() {
    if (!user) { navigate('/login'); return; }
    register(ev.subEventId);
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <Link to="/events" className="text-sm text-white/40 hover:text-white">← All Sub-Events</Link>

      <div className="card p-7 mt-5">
        <div className="flex items-start justify-between gap-4 mb-2">
          <span className="pill bg-purple-light/20 text-purple-light">{ev.category}</span>
          <span className="pill bg-white/5 text-white/60">{ev.points} points</span>
        </div>
        <h1 className="font-display font-bold text-2xl mb-3">{ev.title}</h1>
        <p className="text-white/50 leading-relaxed mb-6">{ev.description}</p>

        <div className="grid sm:grid-cols-2 gap-4 mb-6 text-sm">
          <div><p className="text-white/30 text-xs mb-1">Date & Time</p><p>{new Date(ev.dateTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p></div>
          <div><p className="text-white/30 text-xs mb-1">Venue</p><p>{ev.venue}</p></div>
          <div><p className="text-white/30 text-xs mb-1">Duration</p><p>{Math.round(ev.durationMins / 60 * 10) / 10} hrs</p></div>
          <div><p className="text-white/30 text-xs mb-1">Capacity</p><p className={isFull ? 'text-danger' : seatsLeft <= 10 ? 'text-warning' : ''}>{isFull ? 'Full' : `${seatsLeft} of ${ev.capacity} seats left`}</p></div>
        </div>

        <div className="flex items-center justify-between pt-5 border-t border-white/5">
          {registered ? <StatusPill status="registered" /> : isFull ? <StatusPill status="full" /> : <span className="text-sm text-white/40">Not registered yet</span>}
          {!registered && !isFull && <button onClick={handleRegister} className="btn-primary">Register for this event</button>}
        </div>
      </div>
    </div>
  );
}
