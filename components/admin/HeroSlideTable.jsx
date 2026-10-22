'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';

export default function HeroSlideTable({ initialSlides }) {
  const router = useRouter();
  const [slides, setSlides] = useState(initialSlides);
  const [deletingId, setDeletingId] = useState(null);

  async function handleDelete(id) {
    if (!confirm('Delete this slide? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/hero-slides/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setSlides((list) => list.filter((s) => s.id !== id));
      router.refresh();
    } catch {
      alert('Could not delete this slide. Try again.');
    } finally {
      setDeletingId(null);
    }
  }

  if (slides.length === 0) {
    return <p className="text-slate-500 text-sm">No slides yet. The homepage shows the default hero until you add one.</p>;
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-400 border-b border-slate-100">
            <th className="pb-3 font-semibold">Order</th>
            <th className="pb-3 font-semibold">Image</th>
            <th className="pb-3 font-semibold">Heading</th>
            <th className="pb-3 font-semibold">Status</th>
            <th className="pb-3 font-semibold"></th>
          </tr>
        </thead>
        <tbody>
          {slides.map((s) => (
            <tr key={s.id} className="border-b border-slate-50 last:border-0">
              <td className="py-3 text-slate-500">{s.order}</td>
              <td className="py-3">
                {s.image ? (
                  <img src={s.image} alt="" className="w-16 h-12 object-cover rounded-md border border-slate-100" />
                ) : (
                  <span className="text-slate-300">—</span>
                )}
              </td>
              <td className="py-3 font-medium text-brand-navy">
                {s.heading}
                {s.headingLine2 ? <span className="text-brand"> {s.headingLine2}</span> : null}
              </td>
              <td className="py-3">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${s.isActive ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                  {s.isActive ? 'Showing' : 'Hidden'}
                </span>
              </td>
              <td className="py-3 text-right">
                <div className="flex items-center justify-end gap-3">
                  <Link href={`/admin/hero-slides/${s.id}/edit`} aria-label="Edit" className="text-slate-400 hover:text-brand">
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(s.id)}
                    disabled={deletingId === s.id}
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
