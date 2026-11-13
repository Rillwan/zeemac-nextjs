'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SingleImageUploader from '@/components/admin/SingleImageUploader';

// Compares the shape of an uploaded picture with the shape the slider expects
function useRatioNote(src, target, label) {
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!src) {
      setNote('');
      return undefined;
    }
    let cancelled = false;
    const img = new window.Image();
    img.onload = () => {
      if (cancelled || !img.naturalWidth || !img.naturalHeight) return;
      const ratio = img.naturalWidth / img.naturalHeight;
      if (Math.abs(ratio - target) / target > 0.06) {
        setNote(
          `This picture is ${img.naturalWidth} x ${img.naturalHeight} px, not ${label}. The edges may be cut off on the website, and any text near the edges can be lost.`
        );
      } else {
        setNote('');
      }
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src, target, label]);

  return note;
}

export default function BannerForm({ initialBanner }) {
  const router = useRouter();
  const isEdit = Boolean(initialBanner);

  const [form, setForm] = useState({
    title: initialBanner?.title || '',
    image: initialBanner?.image || '',
    mobileImage: initialBanner?.mobileImage || '',
    alt: initialBanner?.alt || '',
    link: initialBanner?.link || '',
    order: isEdit ? String(initialBanner.order) : '',
    isActive: initialBanner ? initialBanner.isActive : true
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const desktopNote = useRatioNote(form.image, 3, '3:1 (1920 x 640 px)');
  const mobileNote = useRatioNote(form.mobileImage, 4 / 3, '4:3 (1200 x 900 px)');

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
      const url = isEdit ? `/api/banners/${initialBanner.id}` : '/api/banners';
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      router.push('/admin/banners');
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
        <h3 className="font-bold text-brand-navy">Desktop picture *</h3>
        <SingleImageUploader value={form.image} onChange={update('image')} />
        <p className="text-xs text-slate-400">Wide picture, 1920 x 640 px (3:1), under 300 KB. It is shown full width and is not cropped when it is exactly 3:1.</p>
        {desktopNote && <p className="text-sm text-amber-600">{desktopNote}</p>}
      </section>

      <section className="card space-y-4">
        <h3 className="font-bold text-brand-navy">Phone picture (optional)</h3>
        <SingleImageUploader value={form.mobileImage} onChange={update('mobileImage')} />
        <p className="text-xs text-slate-400">
          1200 x 900 px (4:3), under 300 KB, with the text large enough to read on a phone. If you leave it empty the desktop picture is
          shown on phones, where its text will be small. Add a phone picture to every banner, or to none.
        </p>
        {mobileNote && <p className="text-sm text-amber-600">{mobileNote}</p>}
      </section>

      <section className="card space-y-4">
        <h3 className="font-bold text-brand-navy">Details</h3>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Name (only you see it) *</label>
          <input required className="finder-input-light" value={form.title} onChange={update('title')} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Alt text: describe what the banner says *</label>
          <input
            required
            className="finder-input-light"
            value={form.alt}
            onChange={update('alt')}
          />
          <p className="text-xs text-slate-400 mt-1">The words inside the picture are not readable by search engines or screen readers, so write them here.</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Link when the banner is clicked (optional)</label>
          <input
            className="finder-input-light"
            value={form.link}
            onChange={update('link')}
            placeholder="/brands/lefong-filter or https://..."
          />
          <p className="text-xs text-slate-400 mt-1">A page of this website (starting with /) or a full web address. Empty means the banner is not clickable.</p>
        </div>
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
            Show this banner on the website
          </label>
        </div>
      </section>

      <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
        {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Banner'}
      </button>
    </form>
  );
}
