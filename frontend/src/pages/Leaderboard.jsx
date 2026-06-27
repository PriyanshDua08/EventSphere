import { useEffect, useState } from 'react';
import api from '../api/client';

const MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function Leaderboard() {
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/leaderboard').then(({ data }) => setBoard(data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <h1 className="font-display font-bold text-2xl mb-1">Leaderboard</h1>
      <p className="text-white/40 text-sm mb-7">Top participants by total points across the fest.</p>

      {loading ? (
        <div className="card p-10 text-center text-white/40">Loading…</div>
      ) : board.length === 0 ? (
        <div className="card p-10 text-center text-white/40">No points awarded yet — check back once check-ins begin.</div>
      ) : (
        <div className="space-y-2">
          {board.map(p => (
            <div key={p.userId} className={`card flex items-center gap-4 p-4 ${p.rank <= 3 ? 'border-purple-light/30' : ''}`}>
              <span className="w-8 text-center font-display font-bold text-white/60">{MEDAL[p.rank] || `#${p.rank}`}</span>
              <span className="flex-1 font-medium text-sm">{p.name}</span>
              <span className="text-sm text-white/40">{p.points} pts</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
