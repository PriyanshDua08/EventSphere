import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import AllEvents from './pages/AllEvents';
import EventDetail from './pages/EventDetail';
import Schedule from './pages/Schedule';
import Leaderboard from './pages/Leaderboard';
import Contact from './pages/Contact';
import Login from './pages/Login';
import ParticipantDashboard from './pages/ParticipantDashboard';
import OrganizerDashboard from './pages/OrganizerDashboard';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-64px)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<AllEvents />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute role="participant"><ParticipantDashboard /></ProtectedRoute>} />
          <Route path="/organizer" element={<ProtectedRoute role="organizer"><OrganizerDashboard /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}
