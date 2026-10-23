'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SingleImageUploader from '@/components/admin/SingleImageUploader';

export default function BrandForm({ initialBrand }) {
  const router = useRouter();
  const isEdit = Boolean(initialBrand);

  const [form, setForm] = useState({
    name: initialBrand?.name || '',
    logo: initialBrand?.logo || '',
    description: initialBrand?.description || '',
    featured: Boolean(initialBrand?.featured)
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
      const url = isEdit ? `/api/brands/${initialBrand.id}` : '/api/brands';
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      router.push('/admin/brands');
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
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Name *</label>
          <input required className="finder-input-light" value={form.name} onChange={update('name')} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Description</label>
          <textarea
            rows={4}
            className="finder-input-light"
            value={form.description}
            onChange={update('description')}
            placeholder="Short introduction about this brand"
          />
          <p className="text-xs text-slate-400 mt-1">Shown on the brand page and on the homepage when the brand is highlighted.</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Logo</label>
          <SingleImageUploader value={form.logo} onChange={update('logo')} />
        </div>
        <label className="flex items-center gap-2 text-sm font-medium text-brand-navy">
          <input type="checkbox" checked={form.featured} onChange={update('featured')} />
          Highlight on homepage
        </label>
        <p className="text-xs text-slate-400 -mt-2">
          Highlighted brands appear as large cards with logo, name and description. All other brands appear below them as small logo tiles.
        </p>
      </div>
      <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
        {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Brand'}
      </button>
    </form>
  );
}
