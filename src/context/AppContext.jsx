import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/client';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null); // null | {userId, name, role, email}
  const [subEvents, setSubEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]); // current user's registrations (raw, with .event)
  const [loading, setLoading] = useState(true);

  const fetchSubEvents = useCallback(async () => {
    const { data } = await api.get('/subevents');
    setSubEvents(data);
    return data;
  }, []);

  const fetchMyRegistrations = useCallback(async () => {
    const { data } = await api.get('/registrations/me');
    setRegistrations(data);
    return data;
  }, []);

  // Bootstrap: restore session from token, load sub-events
  useEffect(() => {
    (async () => {
      await fetchSubEvents();
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await api.get('/auth/me');
          setUser(data);
        } catch {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    })();
  }, [fetchSubEvents]);

  // Load registrations whenever a participant logs in
  useEffect(() => {
    if (user?.role === 'participant') fetchMyRegistrations();
    else setRegistrations([]);
  }, [user, fetchMyRegistrations]);

  async function signup({ name, email, password, role }) {
    const { data } = await api.post('/auth/signup', { name, email, password, role });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data.user;
  }

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
  }

  function isRegistered(subEventId) {
    return registrations.some(r => r.subEventId === subEventId || r.event?.subEventId === subEventId);
  }

  async function register(subEventId) {
    await api.post('/registrations', { subEventId });
    await Promise.all([fetchSubEvents(), fetchMyRegistrations()]);
  }

  async function checkIn(registrationId) {
    await api.patch(`/registrations/${registrationId}/checkin`);
  }

  async function getRegistrationsForSubEvent(subEventId) {
    const { data } = await api.get(`/registrations/subevent/${subEventId}`);
    return data.map(r => ({ ...r, subEventId, participantName: r.participantId?.name }));
  }

  async function createSubEvent(payload) {
    await api.post('/subevents', payload);
    await fetchSubEvents();
  }

  async function updateSubEvent(subEventId, payload) {
    await api.put(`/subevents/${subEventId}`, payload);
    await fetchSubEvents();
  }

  async function deleteSubEvent(subEventId) {
    await api.delete(`/subevents/${subEventId}`);
    await fetchSubEvents();
  }

  const myRegistrations = registrations.map(r => ({ ...r, subEventId: r.event?.subEventId }));

  return (
    <AppContext.Provider value={{
      user, signup, login, logout, loading,
      subEvents, registrations, myRegistrations,
      isRegistered, register, checkIn, getRegistrationsForSubEvent,
      createSubEvent, deleteSubEvent, updateSubEvent,
      refreshSubEvents: fetchSubEvents,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
