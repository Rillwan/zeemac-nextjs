'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react';
import { ENQUIRY_TOPICS } from '@/lib/contact';

const EMPTY = { name: '', company: '', phone: '', email: '', topic: 'filters', message: '', website: '' };

export default function ContactForm({ initialTopic = 'filters', whatsappHref }) {
  const [form, setForm] = useState({
    ...EMPTY,
    topic: ENQUIRY_TOPICS.some((t) => t.value === initialTopic) ? initialTopic : 'filters'
  });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSending(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
      setSent(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="text-center py-10" role="status">
        <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto" />
        <h3 className="mt-5 text-xl font-bold text-brand-navy">Thank you, we received your enquiry</h3>
        <p className="mt-2 text-slate-500">Our team will contact you shortly. For a faster reply you can also message us on WhatsApp.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-primary">
            <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
          </a>
          <button
            type="button"
            className="btn-outline"
            onClick={() => {
              setForm({ ...EMPTY, topic: form.topic });
              setSent(false);
            }}
          >
            Send another enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cf-name" className="text-sm font-semibold text-brand-navy block mb-1.5">Your name *</label>
          <input id="cf-name" required autoComplete="name" className="finder-input-light" value={form.name} onChange={update('name')} />
        </div>
        <div>
          <label htmlFor="cf-company" className="text-sm font-semibold text-brand-navy block mb-1.5">Company</label>
          <input id="cf-company" autoComplete="organization" className="finder-input-light" value={form.company} onChange={update('company')} />
        </div>
        <div>
          <label htmlFor="cf-phone" className="text-sm font-semibold text-brand-navy block mb-1.5">Phone / WhatsApp</label>
          <input id="cf-phone" type="tel" autoComplete="tel" className="finder-input-light" value={form.phone} onChange={update('phone')} />
        </div>
        <div>
          <label htmlFor="cf-email" className="text-sm font-semibold text-brand-navy block mb-1.5">Email</label>
          <input id="cf-email" type="email" autoComplete="email" className="finder-input-light" value={form.email} onChange={update('email')} />
        </div>
      </div>
      <p className="text-xs text-slate-400 -mt-2">Please give at least a phone number or an email so we can reply.</p>

      <div>
        <label htmlFor="cf-topic" className="text-sm font-semibold text-brand-navy block mb-1.5">What is your enquiry about?</label>
        <select id="cf-topic" className="finder-input-light" value={form.topic} onChange={update('topic')}>
          {ENQUIRY_TOPICS.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="cf-message" className="text-sm font-semibold text-brand-navy block mb-1.5">Your requirement *</label>
        <textarea
          id="cf-message"
          required
          rows={5}
          className="finder-input-light"
          placeholder="Equipment, part number or product you need, quantity, location…"
          value={form.message}
          onChange={update('message')}
        />
      </div>

      {/* Hidden trap field for spam bots */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', height: 0, overflow: 'hidden' }}>
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={form.website} onChange={update('website')} />
        </label>
      </div>

      {error && <p className="text-sm text-red-500" role="alert">{error}</p>}

      <button type="submit" disabled={sending} className="btn-primary disabled:opacity-60">
        {sending ? 'Sending…' : 'Send Enquiry'} {!sending && <ArrowRight className="w-4 h-4" />}
      </button>
    </form>
  );
}
