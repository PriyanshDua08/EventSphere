import { Link } from 'react-router-dom';
import StatusPill from './StatusPill';

const CATEGORY_DOT = {
  Tech: 'bg-purple-light',
  Cultural: 'bg-warning',
  Sports: 'bg-success',
  Workshop: 'bg-white/50',
};

export default function SubEventCard({ event, registered, onRegister, compact }) {
  const seatsLeft = event.capacity - event.registered;
  const isFull = seatsLeft <= 0;
  const day = new Date(event.dateTime).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  const time = new Date(event.dateTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="card p-5 flex flex-col gap-3 hover:border-purple-light/40 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${CATEGORY_DOT[event.category]}`} />
            <span className="text-xs text-white/40 font-medium">{event.category}</span>
          </div>
          <Link to={`/events/${event.subEventId}`} className="font-display font-semibold text-base leading-tight hover:text-purple-light transition-colors">
            {event.title}
          </Link>
        </div>
        <span className="pill bg-white/5 text-white/60 whitespace-nowrap">{event.points} pts</span>
      </div>

      {!compact && <p className="text-sm text-white/50 leading-relaxed">{event.description}</p>}

      <div className="flex items-center gap-4 text-xs text-white/40">
        <span>{day} · {time}</span>
        <span>{event.venue}</span>
      </div>

      <div className="flex items-center justify-between pt-2 mt-auto border-t border-white/5">
        <span className={`text-xs font-medium ${isFull ? 'text-danger' : seatsLeft <= 10 ? 'text-warning' : 'text-white/40'}`}>
          {isFull ? 'No seats left' : `${seatsLeft} seats left`}
        </span>

        {registered ? (
          <StatusPill status="registered" />
        ) : isFull ? (
          <StatusPill status="full" />
        ) : (
          <button onClick={() => onRegister(event.subEventId)} className="btn-primary !px-4 !py-1.5 text-sm">
            Register
          </button>
        )}
      </div>
    </div>
  );
}
