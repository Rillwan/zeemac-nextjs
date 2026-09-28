'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/admin/ImageUploader';
import PdfUploader from '@/components/admin/PdfUploader';

const EMPTY = {
  name: '', partNumber: '', brandId: '', categoryId: '', subcategory: '',
  shortDescription: '', fullDescription: '', specifications: '', applications: '',
  compatibleModels: '', crossReference: '', datasheetUrl: '', catalogueUrl: '',
  featured: false, status: 'active', seoTitle: '', metaDescription: '', focusKeyword: '',
  images: []
};

export default function ProductForm({ initialProduct }) {
  const router = useRouter();
  const isEdit = Boolean(initialProduct);

  const [form, setForm] = useState(() =>
    initialProduct
      ? {
          ...EMPTY,
          ...initialProduct,
          brandId: initialProduct.brandId ?? '',
          categoryId: initialProduct.categoryId ?? '',
          images: (initialProduct.images || []).map((img) => img.url)
        }
      : EMPTY
  );
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/brands').then((r) => r.json()).then((d) => setBrands(d.brands || []));
    fetch('/api/categories').then((r) => r.json()).then((d) => setCategories(d.categories || []));
  }, []);

  function update(field) {
    return (e) => {
      const value = e?.target
        ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value)
        : e;
      setForm((f) => ({ ...f, [field]: value }));
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const url = isEdit ? `/api/products/${initialProduct.id}` : '/api/products';
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 ">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <section className="card space-y-4">
        <h3 className="font-bold text-brand-navy">Basics</h3>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Product Name *</label>
          <input required className="finder-input-light border-1 border-black" value={form.name} onChange={update('name')} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Part Number</label>
            <input className="finder-input-light" value={form.partNumber || ''} onChange={update('partNumber')} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Subcategory</label>
            <input className="finder-input-light" value={form.subcategory || ''} onChange={update('subcategory')} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Brand</label>
            <select className="finder-input-light" value={form.brandId} onChange={update('brandId')}>
              <option value="">— Select brand —</option>
              {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Category</label>
            <select className="finder-input-light" value={form.categoryId} onChange={update('categoryId')}>
              <option value="">— Select category —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm font-medium text-brand-navy">
            <input type="checkbox" checked={form.featured} onChange={update('featured')} />
            Featured on homepage
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-brand-navy">
            Status
            <select className="finder-input-light w-auto" value={form.status} onChange={update('status')}>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </label>
        </div>
      </section>

      <section className="card space-y-4">
        <h3 className="font-bold text-brand-navy">Images</h3>
        <ImageUploader value={form.images} onChange={update('images')} />
      </section>

      <section className="card space-y-4">
        <h3 className="font-bold text-brand-navy">Description &amp; Specs</h3>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Short Description</label>
          <textarea rows={2} className="finder-input-light" value={form.shortDescription || ''} onChange={update('shortDescription')} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Full Description</label>
          <textarea rows={4} className="finder-input-light" value={form.fullDescription || ''} onChange={update('fullDescription')} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Specifications</label>
          <textarea rows={3} className="finder-input-light" value={form.specifications || ''} onChange={update('specifications')} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Applications</label>
          <textarea rows={3} className="finder-input-light" value={form.applications || ''} onChange={update('applications')} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Compatible Models</label>
          <textarea rows={2} className="finder-input-light" value={form.compatibleModels || ''} onChange={update('compatibleModels')} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Cross Reference</label>
          <textarea rows={2} className="finder-input-light" value={form.crossReference || ''} onChange={update('crossReference')} />
        </div>
      </section>

      <section className="card space-y-4">
        <h3 className="font-bold text-brand-navy">Documents</h3>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Datasheet (PDF)</label>
          <PdfUploader value={form.datasheetUrl} onChange={update('datasheetUrl')} label="datasheet" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Catalogue (PDF)</label>
          <PdfUploader value={form.catalogueUrl} onChange={update('catalogueUrl')} label="catalogue" />
        </div>
      </section>

      <section className="card space-y-4">
        <h3 className="font-bold text-brand-navy">SEO</h3>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">SEO Title</label>
          <input className="finder-input-light" value={form.seoTitle || ''} onChange={update('seoTitle')} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Meta Description</label>
          <textarea rows={2} className="finder-input-light" value={form.metaDescription || ''} onChange={update('metaDescription')} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Focus Keyword</label>
          <input className="finder-input-light" value={form.focusKeyword || ''} onChange={update('focusKeyword')} />
        </div>
      </section>

      <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
        {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
      </button>
    </form>
  );
}
