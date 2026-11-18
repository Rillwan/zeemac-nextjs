'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

export default function ShowcaseBrandTable({ initialBrands }) {
  const router = useRouter();
  const [brands, setBrands] = useState(initialBrands);
  const [deletingId, setDeletingId] = useState(null);
  const [movingId, setMovingId] = useState(null);

  async function handleDelete(id) {
    if (!confirm('Delete this brand slide? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/brand-showcase/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setBrands((list) => list.filter((b) => b.id !== id));
      router.refresh();
    } catch {
      alert('Could not delete this brand slide. Try again.');
    } finally {
      setDeletingId(null);
    }
  }

  async function handleMove(brand, direction) {
    setMovingId(brand.id);
    try {
      const res = await fetch('/api/brand-showcase/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: brand.id, direction })
      });
      if (!res.ok) throw new Error('Move failed');

      setBrands((list) => {
        const index = list.findIndex((b) => b.id === brand.id);
        const neighbour = direction === 'up' ? index - 1 : index + 1;
        if (neighbour < 0 || neighbour >= list.length) return list;
        const copy = [...list];
        [copy[index], copy[neighbour]] = [copy[neighbour], copy[index]];
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
    return (
      <p className="text-slate-500 text-sm">
        No brand slides yet. The &quot;Brands We Distribute&quot; section stays hidden on the homepage until you add one.
      </p>
    );
  }

  return (
    <div className="card overflow-x-auto">
      <table className="admin-table w-full text-sm">
        <thead>
          <tr className="text-left text-slate-400 border-b border-slate-100">
            <th className="pb-3 font-semibold">Order</th>
            <th className="pb-3 font-semibold">Logo</th>
            <th className="pb-3 font-semibold">Tab name</th>
            <th className="pb-3 font-semibold">Title</th>
            <th className="pb-3 font-semibold">Status</th>
            <th className="pb-3 font-semibold"></th>
          </tr>
        </thead>
        <tbody>
          {brands.map((b, index) => (
            <tr key={b.id} className="border-b border-slate-50 last:border-0 align-middle">
              <td data-label="Order" className="py-3">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMove(b, 'up')}
                    disabled={index === 0 || movingId !== null}
                    aria-label={`Move ${b.name} up`}
                    className="text-slate-400 hover:text-brand disabled:opacity-30 disabled:hover:text-slate-400"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(b, 'down')}
                    disabled={index === brands.length - 1 || movingId !== null}
                    aria-label={`Move ${b.name} down`}
                    className="text-slate-400 hover:text-brand disabled:opacity-30 disabled:hover:text-slate-400"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              </td>
              <td data-label="Logo" className="py-3">
                {b.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.logo} alt="" className="w-16 h-10 object-contain rounded border border-slate-100 bg-white" />
                ) : (
                  <span className="text-slate-300">—</span>
                )}
              </td>
              <td data-label="Tab name" className="py-3 font-medium text-brand-navy">{b.name}</td>
              <td data-label="Title" className="py-3 text-slate-500 max-w-[16rem] truncate">{b.title}</td>
              <td data-label="Status" className="py-3">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    b.isActive ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {b.isActive ? 'Showing' : 'Hidden'}
                </span>
              </td>
              <td data-label="" className="py-3 text-right">
                <div className="flex items-center justify-end gap-3">
                  <Link href={`/admin/brand-showcase/${b.id}/edit`} aria-label="Edit" className="text-slate-400 hover:text-brand">
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
