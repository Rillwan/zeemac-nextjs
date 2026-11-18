'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SingleImageUploader from '@/components/admin/SingleImageUploader';

const HIGHLIGHT_SLOTS = 3;

function initialHighlights(raw) {
  let list = [];
  try {
    list = JSON.parse(raw || '[]');
  } catch {
    list = [];
  }
  return Array.from({ length: HIGHLIGHT_SLOTS }, (_, i) => ({
    value: list[i]?.value || '',
    label: list[i]?.label || ''
  }));
}

export default function ShowcaseBrandForm({ initialBrand, brands = [] }) {
  const router = useRouter();
  const isEdit = Boolean(initialBrand);

  const [form, setForm] = useState({
    name: initialBrand?.name || '',
    logo: initialBrand?.logo || '',
    image: initialBrand?.image || '',
    imageAlt: initialBrand?.imageAlt || '',
    badge: initialBrand?.badge || '',
    tagline: initialBrand?.tagline || '',
    title: initialBrand?.title || '',
    paragraphs: initialBrand?.paragraphs || '',
    highlights: initialHighlights(initialBrand?.highlights),
    accent: initialBrand?.accent || '#1E63D6',
    tint: initialBrand?.tint || '#EAF3FE',
    productsLink: initialBrand?.productsLink || '/products',
    quoteLink: initialBrand?.quoteLink || '/contact',
    isActive: initialBrand ? initialBrand.isActive : true
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

  function updateHighlight(index, field) {
    return (e) => {
      const value = e.target.value;
      setForm((f) => ({
        ...f,
        highlights: f.highlights.map((item, i) => (i === index ? { ...item, [field]: value } : item))
      }));
    };
  }

  const brandLinks = brands.map((b) => ({ label: b.name, value: `/products?brand=${b.slug}` }));
  const knownLinks = ['/products', ...brandLinks.map((b) => b.value)];
  const customLink = form.productsLink && !knownLinks.includes(form.productsLink) ? form.productsLink : '';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const url = isEdit ? `/api/brand-showcase/${initialBrand.id}` : '/api/brand-showcase';
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      router.push('/admin/brand-showcase');
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
        <h3 className="font-bold text-brand-navy">Tab and logo</h3>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Brand name * (shown on the tab)</label>
          <input required className="finder-input-light" value={form.name} onChange={update('name')} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Brand logo</label>
          <SingleImageUploader value={form.logo} onChange={update('logo')} />
          <p className="text-xs text-slate-400 mt-1">
            Wide logo with a transparent or white background (PNG or WebP). If left empty, the brand name is shown as text.
          </p>
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="font-bold text-brand-navy">Text on the left</h3>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Small coloured heading (tagline)</label>
          <input
            className="finder-input-light"
            value={form.tagline}
            onChange={update('tagline')}
            placeholder="e.g. Designed for Demanding Marine Duty"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Large title *</label>
          <input required className="finder-input-light" value={form.title} onChange={update('title')} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Description</label>
          <textarea
            rows={6}
            className="finder-input-light"
            value={form.paragraphs}
            onChange={update('paragraphs')}
            placeholder="Write the description. Press Enter to start a new paragraph."
          />
          <p className="text-xs text-slate-400 mt-1">Each new line becomes its own paragraph. Two short paragraphs look best.</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-2">Key highlights (up to 3, optional)</label>
          <div className="space-y-2">
            {form.highlights.map((item, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  className="finder-input-light"
                  value={item.value}
                  onChange={updateHighlight(i, 'value')}
                  placeholder="Number or text, e.g. 25+ or OEM Grade"
                />
                <input
                  className="finder-input-light"
                  value={item.label}
                  onChange={updateHighlight(i, 'label')}
                  placeholder="Label, e.g. Years in the market"
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Numbers such as 25+, 99% or 1,000+ count up on the site. Both fields are needed for a highlight to show.
          </p>
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="font-bold text-brand-navy">Picture on the right</h3>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Product picture *</label>
          <SingleImageUploader value={form.image} onChange={update('image')} />
          <p className="text-xs text-slate-400 mt-1">
            Landscape picture, about 5:4 (for example 1200 x 960 px), product on a clean background, under 300 KB.
          </p>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Picture alt text (SEO)</label>
          <input
            className="finder-input-light"
            value={form.imageAlt}
            onChange={update('imageAlt')}
            placeholder="Describe the picture, e.g. Marine oil filters"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Small badge on the picture (optional)</label>
          <input
            className="finder-input-light"
            value={form.badge}
            onChange={update('badge')}
            placeholder="e.g. Authorised Distributor"
          />
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="font-bold text-brand-navy">Colours</h3>
        <div className="flex flex-wrap gap-6">
          <label className="text-xs font-semibold text-slate-500 flex items-center gap-3">
            <input
              type="color"
              value={form.accent}
              onChange={update('accent')}
              className="w-12 h-10 rounded border border-slate-200 bg-white p-1"
            />
            Brand colour (tagline and numbers)
          </label>
          <label className="text-xs font-semibold text-slate-500 flex items-center gap-3">
            <input
              type="color"
              value={form.tint}
              onChange={update('tint')}
              className="w-12 h-10 rounded border border-slate-200 bg-white p-1"
            />
            Light background colour
          </label>
        </div>
        <p className="text-xs text-slate-400">
          Pick the brand&apos;s main colour, and a very light shade of it for the background.
        </p>
      </div>

      <div className="card space-y-4">
        <h3 className="font-bold text-brand-navy">Buttons</h3>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">&quot;Explore Products&quot; goes to</label>
          <select
            className="finder-input-light"
            value={form.productsLink}
            onChange={update('productsLink')}
          >
            <option value="/products">All products</option>
            {brandLinks.map((b) => (
              <option key={b.value} value={b.value}>
                Only products of {b.label}
              </option>
            ))}
            {customLink && <option value={customLink}>{customLink}</option>}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">&quot;Request a Quote&quot; goes to</label>
          <input
            className="finder-input-light"
            value={form.quoteLink}
            onChange={update('quoteLink')}
            placeholder="/contact"
          />
          <p className="text-xs text-slate-400 mt-1">A page on this site (like /contact) or a full https:// address.</p>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-brand-navy">
        <input type="checkbox" checked={form.isActive} onChange={update('isActive')} />
        Show on the homepage
      </label>

      <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
        {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Brand Slide'}
      </button>
    </form>
  );
}
