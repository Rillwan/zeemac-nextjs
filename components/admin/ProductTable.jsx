'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, Star } from 'lucide-react';

export default function ProductTable({ initialProducts }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [deletingId, setDeletingId] = useState(null);

  async function handleDelete(id) {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setProducts((list) => list.filter((p) => p.id !== id));
      router.refresh();
    } catch {
      alert('Could not delete this product. Try again.');
    } finally {
      setDeletingId(null);
    }
  }

  if (products.length === 0) {
    return <p className="text-slate-500 text-sm">No products yet — add your first one.</p>;
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-400 border-b border-slate-100">
            <th className="pb-3 font-semibold">Product</th>
            <th className="pb-3 font-semibold">Category</th>
            <th className="pb-3 font-semibold">Brand</th>
            <th className="pb-3 font-semibold">Status</th>
            <th className="pb-3 font-semibold"></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-slate-50 last:border-0">
              <td className="py-3 font-medium text-brand-navy flex items-center gap-2">
                {p.featured && <Star className="w-3.5 h-3.5 fill-brand text-brand" />}
                {p.name}
              </td>
              <td className="py-3 text-slate-500">{p.category?.name || '—'}</td>
              <td className="py-3 text-slate-500">{p.brand?.name || '—'}</td>
              <td className="py-3">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${p.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                  {p.status}
                </span>
              </td>
              <td className="py-3 text-right">
                <div className="flex items-center justify-end gap-3">
                  <Link href={`/admin/products/${p.id}/edit`} aria-label="Edit" className="text-slate-400 hover:text-brand">
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={deletingId === p.id}
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
