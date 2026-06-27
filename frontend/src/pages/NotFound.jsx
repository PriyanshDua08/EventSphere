import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-5 py-24 text-center">
      <p className="font-display font-bold text-5xl mb-3">404</p>
      <p className="text-white/40 mb-6">This page doesn't exist — maybe it's between sub-events.</p>
      <Link to="/" className="btn-primary">Back home</Link>
    </div>
  );
}
