'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SingleImageUploader from '@/components/admin/SingleImageUploader';
import { ICON_MAP, ICON_OPTIONS } from '@/lib/icons';

export default function CategoryForm({ initialCategory }) {
  const router = useRouter();
  const isEdit = Boolean(initialCategory);

  const [form, setForm] = useState({
    name: initialCategory?.name || '',
    description: initialCategory?.description || '',
    image: initialCategory?.image || '',
    icon: initialCategory?.icon || 'Filter'
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
      const url = isEdit ? `/api/categories/${initialCategory.id}` : '/api/categories';
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      router.push('/admin/categories');
      router.refresh();
    } catch (err) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="card space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Name *</label>
          <input required className="finder-input-light" value={form.name} onChange={update('name')} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Description</label>
          <textarea rows={3} className="finder-input-light" value={form.description} onChange={update('description')} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Icon (small circle on the homepage card)</label>
          <div className="flex items-center gap-3">
            <span className="about-icon">
              {(() => {
                const Icon = ICON_MAP[form.icon] || ICON_MAP.Filter;
                return <Icon className="w-6 h-6" />;
              })()}
            </span>
            <select className="finder-input-light" value={form.icon} onChange={update('icon')}>
              {ICON_OPTIONS.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Image (product photo with white or transparent background, shown on the card)</label>
          <SingleImageUploader value={form.image} onChange={update('image')} />
        </div>
      </div>
      <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
        {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Category'}
      </button>
    </form>
  );
}
