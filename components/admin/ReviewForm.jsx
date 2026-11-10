'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SingleImageUploader from '@/components/admin/SingleImageUploader';

function toDateInput(value) {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
}

export default function ReviewForm({ initialReview }) {
  const router = useRouter();
  const isEdit = Boolean(initialReview);

  const [form, setForm] = useState({
    authorName: initialReview?.authorName || '',
    rating: initialReview ? String(initialReview.rating) : '5',
    text: initialReview?.text || '',
    reviewDate: toDateInput(initialReview?.reviewDate),
    authorPhoto: initialReview?.authorPhoto || '',
    reviewUrl: initialReview?.reviewUrl || '',
    order: isEdit ? String(initialReview.order) : '',
    isActive: initialReview ? initialReview.isActive : true
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function update(field) {
    return (e) => {
      let value = e;
      if (e && e.target) {
        value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      }
      setForm((f) => ({ ...f, [field]: value }));
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const url = isEdit ? `/api/reviews/${initialReview.id}` : '/api/reviews';
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      router.push('/admin/reviews');
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

      <section className="card space-y-4">
        <h3 className="font-bold text-brand-navy">Review</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Reviewer name *</label>
            <input required className="finder-input-light" value={form.authorName} onChange={update('authorName')} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Stars</label>
            <select className="finder-input-light" value={form.rating} onChange={update('rating')}>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{n} star{n === 1 ? '' : 's'}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Review text (copy it exactly as the customer wrote it on Google)</label>
          <textarea rows={5} className="finder-input-light" value={form.text} onChange={update('text')} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Review date (shown as month and year)</label>
            <input type="date" className="finder-input-light" value={form.reviewDate} onChange={update('reviewDate')} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Link to this review on Google</label>
            <input
              className="finder-input-light"
              value={form.reviewUrl}
              onChange={update('reviewUrl')}
              placeholder="https://..."
            />
          </div>
        </div>
        <p className="text-xs text-slate-400">
          The link opens when a visitor clicks the review card. On Google Maps, open the review, use Share, and copy the link.
          If you leave it empty, the card opens the "See All Reviews on Google" link from Page content → Reviews Section.
        </p>
      </section>

      <section className="card space-y-4">
        <h3 className="font-bold text-brand-navy">Reviewer picture (optional)</h3>
        <SingleImageUploader value={form.authorPhoto} onChange={update('authorPhoto')} />
        <p className="text-xs text-slate-400">Square picture, about 200 x 200 px. Without a picture the first letter of the name is shown.</p>
      </section>

      <section className="card space-y-4">
        <h3 className="font-bold text-brand-navy">Display</h3>
        <div className="grid sm:grid-cols-2 gap-4 items-end">
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Order (lowest number first)</label>
            <input
              type="number"
              className="finder-input-light"
              value={form.order}
              onChange={update('order')}
              placeholder="Leave empty to add at the end"
            />
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-brand-navy pb-2">
            <input type="checkbox" checked={form.isActive} onChange={update('isActive')} />
            Show this review on the website
          </label>
        </div>
      </section>

      <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
        {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Review'}
      </button>
    </form>
  );
}
