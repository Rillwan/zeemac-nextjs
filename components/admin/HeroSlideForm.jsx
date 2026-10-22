'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SingleImageUploader from '@/components/admin/SingleImageUploader';

export default function HeroSlideForm({ initialSlide }) {
  const router = useRouter();
  const isEdit = Boolean(initialSlide);

  const [form, setForm] = useState({
    eyebrow: initialSlide?.eyebrow || '',
    heading: initialSlide?.heading || '',
    headingLine2: initialSlide?.headingLine2 || '',
    description: initialSlide?.description || '',
    tagline: initialSlide?.tagline || '',
    image: initialSlide?.image || '',
    imageAlt: initialSlide?.imageAlt || '',
    primaryButtonText: isEdit ? initialSlide.primaryButtonText || '' : 'Explore Products',
    primaryButtonLink: isEdit ? initialSlide.primaryButtonLink || '' : '/products',
    secondaryButtonText: isEdit ? initialSlide.secondaryButtonText || '' : 'Request a Quote',
    secondaryButtonLink: isEdit ? initialSlide.secondaryButtonLink || '' : '#contact',
    order: isEdit ? String(initialSlide.order) : '',
    isActive: initialSlide ? initialSlide.isActive : true
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
      const url = isEdit ? `/api/hero-slides/${initialSlide.id}` : '/api/hero-slides';
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      router.push('/admin/hero-slides');
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
        <h3 className="font-bold text-brand-navy">Text</h3>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Eyebrow (small label above the heading)</label>
          <input disabled placeholder='not available' className="finder-input-light" value={form.eyebrow} onChange={update('eyebrow')} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Heading — Line 1 *</label>
          <input required className="finder-input-light" value={form.heading} onChange={update('heading')} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Heading — Line 2 (shown in blue)</label>
          <input className="finder-input-light" value={form.headingLine2} onChange={update('headingLine2')} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Description</label>
          <textarea rows={4} className="finder-input-light" value={form.description} onChange={update('description')} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Tagline points (comma separated)</label>
          <input
            className="finder-input-light"
            value={form.tagline}
            onChange={update('tagline')}
            placeholder="Quality Products, Trusted Brands, Industrial Expertise"
          />
        </div>
      </section>

      <section className="card space-y-4">
        <h3 className="font-bold text-brand-navy">Image</h3>
        <SingleImageUploader value={form.image} onChange={update('image')} />
        <p className="text-xs text-slate-400">Landscape pictures about 1200 x 900 px look best. Every slide is cropped to the same shape.</p>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Image Alt Text</label>
          <input
            className="finder-input-light"
            value={form.imageAlt}
            onChange={update('imageAlt')}
            placeholder="Describe the picture for search engines and screen readers"
          />
        </div>
      </section>

      <section className="card space-y-4">
        <h3 className="font-bold text-brand-navy">Buttons</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Primary button text</label>
            <input className="finder-input-light" value={form.primaryButtonText} onChange={update('primaryButtonText')} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Primary button link</label>
            <input className="finder-input-light" value={form.primaryButtonLink} onChange={update('primaryButtonLink')} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Secondary button text</label>
            <input className="finder-input-light" value={form.secondaryButtonText} onChange={update('secondaryButtonText')} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Secondary button link</label>
            <input className="finder-input-light" value={form.secondaryButtonLink} onChange={update('secondaryButtonLink')} />
          </div>
        </div>
        <p className="text-xs text-slate-400">Leave a button text empty to hide that button. Links like /products or #contact work.</p>
      </section>

      <section className="card space-y-4">
        <h3 className="font-bold text-brand-navy">Display</h3>
        <div className="grid sm:grid-cols-2 gap-4 items-end">
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Order (lowest number plays first)</label>
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
            Show this slide on the website
          </label>
        </div>
      </section>

      <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
        {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Slide'}
      </button>
    </form>
  );
}
