'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SingleImageUploader from '@/components/admin/SingleImageUploader';
import { SITE_CONTENT_FIELDS, SITE_CONTENT_DEFAULTS, FIELD_META } from '@/lib/siteContentDefaults';

export default function SiteContentForm({ section, initialContent }) {
  const router = useRouter();
  const fields = SITE_CONTENT_FIELDS[section] || [];
  const defaults = SITE_CONTENT_DEFAULTS[section] || {};

  const [form, setForm] = useState(() => {
    const initial = {};
    fields.forEach((key) => {
      initial[key] = initialContent?.[key] || defaults[key] || '';
    });
    return initial;
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function update(field) {
    return (e) => {
      const value = e?.target ? e.target.value : e;
      setForm((f) => ({ ...f, [field]: value }));
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const res = await fetch(`/api/site-content/${section}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      router.push('/admin/content');
      router.refresh();
    } catch (err) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="card space-y-4">
        {fields.map((key) => {
          const meta = FIELD_META[key];
          if (!meta) return null;

          if (meta.type === 'image') {
            return (
              <div key={key}>
                <label className="text-xs font-semibold text-slate-500 block mb-1">{meta.label}</label>
                <SingleImageUploader value={form[key]} onChange={update(key)} />
              </div>
            );
          }

          if (meta.type === 'textarea') {
            return (
              <div key={key}>
                <label className="text-xs font-semibold text-slate-500 block mb-1">{meta.label}</label>
                <textarea rows={3} className="finder-input-light" value={form[key]} onChange={update(key)} />
              </div>
            );
          }

          return (
            <div key={key}>
              <label className="text-xs font-semibold text-slate-500 block mb-1">{meta.label}</label>
              <input className="finder-input-light" value={form[key]} onChange={update(key)} />
            </div>
          );
        })}
      </div>

      <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </form>
  );
}