'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, ArrowUp, ArrowDown, Star } from 'lucide-react';

export default function BrandTable({ initialBrands }) {
  const router = useRouter();
  const [brands, setBrands] = useState(initialBrands);
  const [deletingId, setDeletingId] = useState(null);
  const [movingId, setMovingId] = useState(null);

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

  async function handleMove(brand, direction) {
    setMovingId(brand.id);
    try {
      const res = await fetch('/api/brands/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: brand.id, direction })
      });
      if (!res.ok) throw new Error('Move failed');

      // Mirror the server: swap with the neighbour inside the same group
      setBrands((list) => {
        const group = list.filter((b) => b.featured === brand.featured);
        const groupIndex = group.findIndex((b) => b.id === brand.id);
        const neighbour = group[direction === 'up' ? groupIndex - 1 : groupIndex + 1];
        if (!neighbour) return list;
        const copy = [...list];
        const a = copy.findIndex((b) => b.id === brand.id);
        const n = copy.findIndex((b) => b.id === neighbour.id);
        [copy[a], copy[n]] = [copy[n], copy[a]];
        return copy;
      });
      router.refresh();
    } catch {
      alert('Could not change the order. Try again.');
    } finally {
      setMovingId(null);
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
            <th className="pb-3 font-semibold">Order</th>
            <th className="pb-3 font-semibold">Logo</th>
            <th className="pb-3 font-semibold">Name</th>
            <th className="pb-3 font-semibold">Homepage</th>
            <th className="pb-3 font-semibold"></th>
          </tr>
        </thead>
        <tbody>
          {brands.map((b) => {
            const group = brands.filter((x) => x.featured === b.featured);
            const isFirst = group[0]?.id === b.id;
            const isLast = group[group.length - 1]?.id === b.id;
            return (
              <tr key={b.id} className="border-b border-slate-50 last:border-0">
                <td className="py-3">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMove(b, 'up')}
                      disabled={isFirst || movingId !== null}
                      aria-label={`Move ${b.name} up`}
                      className="text-slate-400 hover:text-brand disabled:opacity-30 disabled:hover:text-slate-400"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(b, 'down')}
                      disabled={isLast || movingId !== null}
                      aria-label={`Move ${b.name} down`}
                      className="text-slate-400 hover:text-brand disabled:opacity-30 disabled:hover:text-slate-400"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                </td>
                <td className="py-3">
                  {b.logo ? (
                    <img src={b.logo} alt="" className="w-12 h-9 object-contain rounded border border-slate-100 bg-white" />
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
                <td className="py-3 font-medium text-brand-navy">{b.name}</td>
                <td className="py-3">
                  {b.featured ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-brand-light text-brand">
                      <Star className="w-3 h-3 fill-brand" /> Highlighted
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Logo tile</span>
                  )}
                </td>
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
