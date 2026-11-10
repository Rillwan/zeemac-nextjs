'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Star, Trash2 } from 'lucide-react';

export default function ReviewTable({ initialReviews }) {
  const router = useRouter();
  const [reviews, setReviews] = useState(initialReviews);
  const [deletingId, setDeletingId] = useState(null);

  async function handleDelete(id) {
    if (!confirm('Delete this review? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setReviews((list) => list.filter((r) => r.id !== id));
      router.refresh();
    } catch {
      alert('Could not delete this review. Try again.');
    } finally {
      setDeletingId(null);
    }
  }

  if (reviews.length === 0) {
    return <p className="text-slate-500 text-sm">No reviews yet. The Reviews section stays hidden on the homepage until you add one.</p>;
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-400 border-b border-slate-100">
            <th className="pb-3 font-semibold">Order</th>
            <th className="pb-3 font-semibold">Reviewer</th>
            <th className="pb-3 font-semibold">Rating</th>
            <th className="pb-3 font-semibold">Review</th>
            <th className="pb-3 font-semibold">Status</th>
            <th className="pb-3 font-semibold"></th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((r) => (
            <tr key={r.id} className="border-b border-slate-50 last:border-0 align-top">
              <td className="py-3 text-slate-500">{r.order}</td>
              <td className="py-3 font-medium text-brand-navy whitespace-nowrap">{r.authorName}</td>
              <td className="py-3 whitespace-nowrap">
                <span className="inline-flex items-center gap-1 text-slate-600">
                  {r.rating} <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </span>
              </td>
              <td className="py-3 text-slate-500 max-w-xs">
                <span className="line-clamp-2">{r.text || '—'}</span>
              </td>
              <td className="py-3">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${r.isActive ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                  {r.isActive ? 'Showing' : 'Hidden'}
                </span>
              </td>
              <td className="py-3 text-right">
                <div className="flex items-center justify-end gap-3">
                  <Link href={`/admin/reviews/${r.id}/edit`} aria-label="Edit" className="text-slate-400 hover:text-brand">
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(r.id)}
                    disabled={deletingId === r.id}
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
