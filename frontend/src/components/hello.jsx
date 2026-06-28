const CATEGORY_DOT = {
  Tech: 'bg-purple-light',
  Cultural: 'bg-warning',
  Sports: 'bg-success',
  Workshop: 'bg-white/50',
};
xport default function SubEventCard({ event, registered, onRegister, compact }) {
  const seatsLeft = event.capacity - event.registered;
  const isFull = seatsLeft <= 0;
  const day = new Date(event.dateTime).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  const time = new Date(event.dateTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
