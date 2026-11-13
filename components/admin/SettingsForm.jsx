'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DEFAULT_SETTINGS } from '@/lib/settingsDefaults';

export default function SettingsForm({ initialSettings }) {
  const router = useRouter();
  const [form, setForm] = useState({
    phone: initialSettings?.phone || '',
    whatsappNumber: initialSettings?.whatsappNumber || '',
    email: initialSettings?.email || '',
    address: initialSettings?.address || '',
    workingHours: initialSettings?.workingHours || '',
    mapEmbedUrl: initialSettings?.mapEmbedUrl || ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setMessage('Saved.');
      router.refresh();
    } catch (err) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {message && <p className="text-green-600 text-sm">{message}</p>}

      <section className="card space-y-4">
        <h3 className="font-bold text-brand-navy">Contact details</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Phone (shown to visitors)</label>
            <input className="finder-input-light" value={form.phone} onChange={update('phone')} placeholder={DEFAULT_SETTINGS.phone} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Email (also receives enquiry alerts when email is set up)</label>
            <input className="finder-input-light" value={form.email} onChange={update('email')} placeholder={DEFAULT_SETTINGS.email} />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Address</label>
          <textarea rows={3} className="finder-input-light" value={form.address} onChange={update('address')} placeholder={DEFAULT_SETTINGS.address} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Working hours (optional, hidden when empty)</label>
          <input className="finder-input-light" value={form.workingHours} onChange={update('workingHours')} />
        </div>
      </section>

      <section className="card space-y-4">
        <h3 className="font-bold text-brand-navy">WhatsApp</h3>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">WhatsApp number</label>
          <input className="finder-input-light" value={form.whatsappNumber} onChange={update('whatsappNumber')} placeholder={DEFAULT_SETTINGS.whatsappNumber} />
        </div>
        <p className="text-xs text-slate-400">
          Digits only, with the country code, and without +, spaces or a 0 after the country code. For a UAE mobile 050 123 4567 write 971501234567.
          A wrong number makes every WhatsApp button open an error page, so test it after saving.
        </p>
      </section>

      <section className="card space-y-4">
        <h3 className="font-bold text-brand-navy">Map</h3>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Google Maps embed code (optional)</label>
          <textarea rows={3} className="finder-input-light" value={form.mapEmbedUrl} onChange={update('mapEmbedUrl')} />
        </div>
        <p className="text-xs text-slate-400">
          On Google Maps open your business, choose Share, then Embed a map, copy the HTML and paste it here. The map shows on the Contact page.
        </p>
      </section>

      <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
        {saving ? 'Saving…' : 'Save Settings'}
      </button>
    </form>
  );
}
