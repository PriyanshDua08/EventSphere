// Navigation Bar
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const navLink = ({ isActive }) =>
  `text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-white/50 hover:text-white/80'}`;

export default function Navbar() {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-base/80 border-b border-white/5">
      <nav className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-light to-purple-dark grid place-items-center text-xs">ES</span>
          EventSphere
        </Link>

        <div className="hidden md:flex items-center gap-7">
          <NavLink to="/events" className={navLink}>Sub-Events</NavLink>
          <NavLink to="/schedule" className={navLink}>Schedule</NavLink>
          <NavLink to="/leaderboard" className={navLink}>Leaderboard</NavLink>
          <NavLink to="/contact" className={navLink}>Contact</NavLink>
          {user?.role === 'participant' && <NavLink to="/dashboard" className={navLink}>My Dashboard</NavLink>}
          {user?.role === 'organizer' && <NavLink to="/organizer" className={navLink}>Organizer</NavLink>}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:inline text-xs text-white/40">{user.name} · {user.role}</span>
              <button onClick={handleLogout} className="btn-ghost !px-4 !py-2 text-sm">Log out</button>
            </>
          ) : (
            <Link to="/login" className="btn-primary !px-4 !py-2 text-sm">Log in</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
