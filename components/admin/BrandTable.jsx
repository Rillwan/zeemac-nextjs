'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';

export default function BrandTable({ initialBrands }) {
  const router = useRouter();
  const [brands, setBrands] = useState(initialBrands);
  const [deletingId, setDeletingId] = useState(null);

  async function handleDelete(id) {
    if (!confirm('Delete this brand? Products with it will lose the brand link.')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/brands/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setBrands((list) => list.filter((b) => b.id !== id));
      router.refresh();
    } catch {
      alert('Could not delete this brand. Try again.');
    } finally {
      setDeletingId(null);
    }
  }

  if (brands.length === 0) {
    return <p className="text-slate-500 text-sm">No brands yet — add your first one.</p>;
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-400 border-b border-slate-100">
            <th className="pb-3 font-semibold">Name</th>
            <th className="pb-3 font-semibold">Slug</th>
            <th className="pb-3 font-semibold"></th>
          </tr>
        </thead>
        <tbody>
          {brands.map((b) => (
            <tr key={b.id} className="border-b border-slate-50 last:border-0">
              <td className="py-3 font-medium text-brand-navy">{b.name}</td>
              <td className="py-3 text-slate-400">{b.slug}</td>
              <td className="py-3 text-right">
                <div className="flex items-center justify-end gap-3">
                  <Link href={`/admin/brands/${b.id}/edit`} aria-label="Edit" className="text-slate-400 hover:text-brand">
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(b.id)}
                    disabled={deletingId === b.id}
                    aria-label="Delete"
                    className="text-slate-400 hover:text-red-500 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
