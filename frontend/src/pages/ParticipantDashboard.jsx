import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import api from '../api/client';
import StatusPill from '../components/StatusPill';

export default function ParticipantDashboard() {
  const { user, myRegistrations } = useApp();
  const [myRank, setMyRank] = useState(null);
  const totalPoints = myRegistrations.filter(r => r.status === 'checked-in').reduce((sum, r) => sum + (r.event?.points || 0), 0);

  useEffect(() => {
    api.get('/leaderboard').then(({ data }) => {
      setMyRank(data.find(l => l.userId === user.userId) || null);
    });
  }, [user.userId, totalPoints]);

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <h1 className="font-display font-bold text-2xl mb-1">Hey, {user.name.split(' ')[0]} 👋</h1>
      <p className="text-white/40 text-sm mb-8">Your fest, at a glance.</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-5"><p className="text-xs text-white/30 mb-1">Registered</p><p className="font-display font-bold text-2xl">{myRegistrations.length}</p></div>
        <div className="card p-5"><p className="text-xs text-white/30 mb-1">Points (checked-in)</p><p className="font-display font-bold text-2xl">{totalPoints}</p></div>
        <div className="card p-5"><p className="text-xs text-white/30 mb-1">Leaderboard Rank</p><p className="font-display font-bold text-2xl">{myRank ? `#${myRank.rank}` : '—'}</p></div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-semibold text-lg">My Registered Sub-Events</h2>
        <Link to="/schedule" className="text-sm text-purple-light hover:underline">View my schedule →</Link>
      </div>

      {myRegistrations.length === 0 ? (
        <div className="card p-10 text-center text-white/40">
          You haven't registered for anything yet.
          <div className="mt-4"><Link to="/events" className="btn-primary">Browse Sub-Events</Link></div>
        </div>
      ) : (
        <div className="space-y-2">
          {myRegistrations.map(r => (
            <div key={r.registrationId} className="card flex items-center justify-between p-4">
              <div>
                <Link to={`/events/${r.subEventId}`} className="font-medium text-sm hover:text-purple-light">{r.event?.title}</Link>
                <p className="text-xs text-white/40">{r.event && new Date(r.event.dateTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })} · {r.event?.venue}</p>
              </div>
              <StatusPill status={r.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
