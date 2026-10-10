'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const TITLE_LIMIT = 60;
const DESC_LIMIT = 160;

export default function SeoForm({ section, initialContent }) {
  const router = useRouter();
  const [form, setForm] = useState({
    seoTitle: initialContent?.seoTitle || '',
    metaDescription: initialContent?.metaDescription || '',
    focusKeyword: initialContent?.focusKeyword || ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
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
      router.push('/admin/seo');
      router.refresh();
    } catch (err) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  const titleLen = form.seoTitle.length;
  const descLen = form.metaDescription.length;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="card space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-500">SEO Title</label>
            <span className={`text-xs ${titleLen > TITLE_LIMIT ? 'text-red-500 font-semibold' : 'text-slate-400'}`}>
              {titleLen}/{TITLE_LIMIT}
            </span>
          </div>
          <input
            className={`finder-input-light ${titleLen > TITLE_LIMIT ? 'border-red-400' : ''}`}
            value={form.seoTitle}
            onChange={update('seoTitle')}
            placeholder="Page title shown in Google search results"
          />
          {titleLen > TITLE_LIMIT && (
            <p className="text-xs text-red-500 mt-1">Too long — may be truncated in search results.</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-500">Meta Description</label>
            <span className={`text-xs ${descLen > DESC_LIMIT ? 'text-red-500 font-semibold' : 'text-slate-400'}`}>
              {descLen}/{DESC_LIMIT}
            </span>
          </div>
          <textarea
            rows={3}
            className={`finder-input-light ${descLen > DESC_LIMIT ? 'border-red-400' : ''}`}
            value={form.metaDescription}
            onChange={update('metaDescription')}
            placeholder="Short summary shown under the title in search results"
          />
          {descLen > DESC_LIMIT && (
            <p className="text-xs text-red-500 mt-1">Too long — may be truncated in search results.</p>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Focus Keyword</label>
          <input
            className="finder-input-light"
            value={form.focusKeyword}
            onChange={update('focusKeyword')}
            placeholder="Main keyword this page should rank for"
          />
        </div>
      </div>

      <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </form>
  );
}