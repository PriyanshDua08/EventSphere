const STYLES = {
  registered: 'bg-purple-light/20 text-purple-light',
  'checked-in': 'bg-success/20 text-success',
  full: 'bg-danger/20 text-danger',
  open: 'bg-white/10 text-white/70',
};

const LABELS = {
  registered: 'Registered',
  'checked-in': 'Checked In',
  full: 'Full',
  open: 'Open',
};

export default function StatusPill({ status }) {
  return <span className={`pill ${STYLES[status] || STYLES.open}`}>{LABELS[status] || status}</span>;
}
