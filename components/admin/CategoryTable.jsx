'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';

export default function CategoryTable({ initialCategories }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [deletingId, setDeletingId] = useState(null);

  async function handleDelete(id) {
    if (!confirm('Delete this category? Products in it will become uncategorized.')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setCategories((list) => list.filter((c) => c.id !== id));
      router.refresh();
    } catch {
      alert('Could not delete this category. Try again.');
    } finally {
      setDeletingId(null);
    }
  }

  if (categories.length === 0) {
    return <p className="text-slate-500 text-sm">No categories yet — add your first one.</p>;
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
          {categories.map((c) => (
            <tr key={c.id} className="border-b border-slate-50 last:border-0">
              <td className="py-3 font-medium text-brand-navy">{c.name}</td>
              <td className="py-3 text-slate-400">{c.slug}</td>
              <td className="py-3 text-right">
                <div className="flex items-center justify-end gap-3">
                  <Link href={`/admin/categories/${c.id}/edit`} aria-label="Edit" className="text-slate-400 hover:text-brand">
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(c.id)}
                    disabled={deletingId === c.id}
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
