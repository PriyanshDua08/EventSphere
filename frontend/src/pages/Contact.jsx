import { useState } from 'react';

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <div className="max-w-xl mx-auto px-5 py-10">
      <h1 className="font-display font-bold text-2xl mb-1">Contact & Support</h1>
      <p className="text-white/40 text-sm mb-8">Any questions about the fest, a sub-event, or your registration? Reach out.</p>

      <div className="card p-5 mb-6 space-y-2 text-sm">
        <p><span className="text-white/30">Email</span> — fest@college.edu</p>
        <p><span className="text-white/30">Helpdesk</span> — Student Activity Centre, Block C</p>
        <p><span className="text-white/30">Hours</span> — 9am–6pm during fest days</p>
      </div>

      {sent ? (
        <div className="card p-6 text-center text-success text-sm">Thanks — your message has been sent. We'll get back to you shortly.</div>
      ) : (
        <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="space-y-3">
          <input className="input" placeholder="Your name" required />
          <input className="input" type="email" placeholder="Your email" required />
          <textarea className="input" rows={4} placeholder="What's on your mind?" required />
          <button type="submit" className="btn-primary w-full">Send message</button>
        </form>
      )}
    </div>
  );
}
