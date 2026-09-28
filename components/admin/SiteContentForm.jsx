'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SingleImageUploader from '@/components/admin/SingleImageUploader';

export default function SiteContentForm({ section, initialContent }) {
  const router = useRouter();
  const [form, setForm] = useState({
    eyebrow: initialContent?.eyebrow || '',
    heading: initialContent?.heading || '',
    headingLine2: initialContent?.headingLine2 || '',
    body1: initialContent?.body1 || '',
    body2: initialContent?.body2 || '',
    body3: initialContent?.body3 || '',
    image: initialContent?.image || '',
    imageAlt: initialContent?.imageAlt || '',
    tagline: initialContent?.tagline || ''
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
    <form onSubmit={handleSubmit} className="space-y-6 ">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="card space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Eyebrow (small label)</label>
          <input className="finder-input-light" value={form.eyebrow} onChange={update('eyebrow')} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Heading</label>
          <input className="finder-input-light" value={form.heading} onChange={update('heading')} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Heading — Line 2 (Hero only)</label>
          <input className="finder-input-light" value={form.headingLine2} onChange={update('headingLine2')} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Paragraph 1</label>
          <textarea rows={3} className="finder-input-light" value={form.body1} onChange={update('body1')} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Paragraph 2 (About only)</label>
          <textarea rows={3} className="finder-input-light" value={form.body2} onChange={update('body2')} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Paragraph 3 (About only)</label>
          <textarea rows={3} className="finder-input-light" value={form.body3} onChange={update('body3')} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Tagline points (Hero only — comma separated)</label>
          <input className="finder-input-light" value={form.tagline} onChange={update('tagline')} placeholder="Quality Products, Trusted Brands, ..." />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Image</label>
          <SingleImageUploader value={form.image} onChange={update('image')} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Image Alt Text</label>
          <input className="finder-input-light" value={form.imageAlt} onChange={update('imageAlt')} placeholder="Describe the image for SEO/accessibility" />
        </div>
      </div>

      <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </form>
  );
}