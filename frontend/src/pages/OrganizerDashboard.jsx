import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';

const EMPTY_FORM = { title: '', description: '', category: 'Tech', venue: '', dateTime: '', durationMins: 60, capacity: 50, points: 20 };

export default function OrganizerDashboard() {
  const { subEvents, createSubEvent, updateSubEvent, deleteSubEvent, checkIn, getRegistrationsForSubEvent } = useApp();
  const [tab, setTab] = useState('events'); // events | registrations
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventRegs, setEventRegs] = useState([]);
  const [editing, setEditing] = useState(null); // subEventId being edited, or 'new'
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (selectedEvent) {
      getRegistrationsForSubEvent(selectedEvent.subEventId).then(setEventRegs);
    } else {
      setEventRegs([]);
    }
  }, [selectedEvent, getRegistrationsForSubEvent]);

  function openCreate() { setForm(EMPTY_FORM); setEditing('new'); setFormError(''); }
  function openEdit(ev) {
    setForm({ ...ev, dateTime: ev.dateTime.slice(0, 16) });
    setEditing(ev.subEventId);
    setFormError('');
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.title || !form.dateTime || !form.venue) { setFormError('Title, date/time, and venue are required.'); return; }
    if (Number(form.capacity) <= 0) { setFormError('Capacity must be greater than zero.'); return; }
    const payload = { ...form, capacity: Number(form.capacity), points: Number(form.points), durationMins: Number(form.durationMins) };
    try {
      if (editing === 'new') await createSubEvent(payload);
      else await updateSubEvent(editing, payload);
      setEditing(null);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not save sub-event.');
    }
  }

  async function handleDelete(id) {
    if (confirm('Delete this sub-event? This cannot be undone.')) await deleteSubEvent(id);
  }

  async function handleCheckIn(registrationId) {
    await checkIn(registrationId);
    const fresh = await getRegistrationsForSubEvent(selectedEvent.subEventId);
    setEventRegs(fresh);
  }

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl">Organizer Dashboard</h1>
        <button onClick={openCreate} className="btn-primary">+ New Sub-Event</button>
      </div>

      <div className="card p-1 flex w-fit mb-6">
        {[['events', 'Sub-Events'], ['registrations', 'Check-in']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors ${tab === key ? 'bg-purple-light text-white' : 'text-white/40'}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'events' && (
        <div className="space-y-2">
          {subEvents.map(ev => (
            <div key={ev.subEventId} className="card flex items-center justify-between p-4 gap-3">
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{ev.title}</p>
                <p className="text-xs text-white/40">{ev.category} · {ev.registered}/{ev.capacity} registered · {ev.points} pts</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(ev)} className="btn-ghost !px-3 !py-1.5 text-xs">Edit</button>
                <button onClick={() => handleDelete(ev.subEventId)} className="btn-ghost !px-3 !py-1.5 text-xs !bg-danger/10 text-danger hover:!bg-danger/20">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'registrations' && (
        <div className="grid sm:grid-cols-[240px_1fr] gap-5">
          <div className="space-y-2">
            {subEvents.map(ev => (
              <button key={ev.subEventId} onClick={() => setSelectedEvent(ev)}
                className={`card w-full text-left p-3 text-sm transition-colors ${selectedEvent?.subEventId === ev.subEventId ? 'border-purple-light/50 !bg-purple-light/5' : ''}`}>
                {ev.title}
                <span className="block text-xs text-white/30 mt-0.5">{ev.registered} registered</span>
              </button>
            ))}
          </div>

          <div>
            {!selectedEvent ? (
              <div className="card p-10 text-center text-white/40">Select a sub-event to view its registration list.</div>
            ) : eventRegs.length === 0 ? (
              <div className="card p-10 text-center text-white/40">No one has registered for {selectedEvent.title} yet.</div>
            ) : (
              <div className="space-y-2">
                {eventRegs.map(r => (
                  <div key={r.registrationId} className="card flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium text-sm">{r.participantName || r.participantId?.name || 'Participant'}</p>
                      <p className="text-xs text-white/40">Registered {new Date(r.registeredAt).toLocaleDateString('en-IN')}</p>
                    </div>
                    {r.status === 'checked-in' ? (
                      <span className="pill bg-success/20 text-success">Checked In</span>
                    ) : (
                      <button onClick={() => handleCheckIn(r.registrationId)} className="btn-primary !px-4 !py-1.5 text-sm">Mark Present</button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create/Edit modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm grid place-items-center p-5 z-50" onClick={() => setEditing(null)}>
          <form onSubmit={handleSave} onClick={e => e.stopPropagation()} className="card p-6 w-full max-w-md space-y-3">
            <h2 className="font-display font-semibold text-lg mb-1">{editing === 'new' ? 'New Sub-Event' : 'Edit Sub-Event'}</h2>
            <input className="input" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <textarea className="input" placeholder="Description" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <input className="input" placeholder="Venue" value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} />
            </div>
            <input className="input" type="datetime-local" value={form.dateTime} onChange={e => setForm({ ...form, dateTime: e.target.value })} />
            <div className="grid grid-cols-3 gap-3">
              <input className="input" type="number" placeholder="Duration (min)" value={form.durationMins} onChange={e => setForm({ ...form, durationMins: e.target.value })} />
              <input className="input" type="number" placeholder="Capacity" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} />
              <input className="input" type="number" placeholder="Points" value={form.points} onChange={e => setForm({ ...form, points: e.target.value })} />
            </div>
            {formError && <p className="text-danger text-xs">{formError}</p>}
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="btn-ghost flex-1">Cancel</button>
              <button type="submit" className="btn-primary flex-1">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
