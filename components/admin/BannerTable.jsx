'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';

export default function BannerTable({ initialBanners }) {
  const router = useRouter();
  const [banners, setBanners] = useState(initialBanners);
  const [deletingId, setDeletingId] = useState(null);

  async function handleDelete(id) {
    if (!confirm('Delete this banner? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/banners/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setBanners((list) => list.filter((b) => b.id !== id));
      router.refresh();
    } catch {
      alert('Could not delete this banner. Try again.');
    } finally {
      setDeletingId(null);
    }
  }

  if (banners.length === 0) {
    return <p className="text-slate-500 text-sm">No banners yet. The banner section stays hidden on the homepage until you add one.</p>;
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-400 border-b border-slate-100">
            <th className="pb-3 font-semibold">Order</th>
            <th className="pb-3 font-semibold">Picture</th>
            <th className="pb-3 font-semibold">Name</th>
            <th className="pb-3 font-semibold">Link</th>
            <th className="pb-3 font-semibold">Status</th>
            <th className="pb-3 font-semibold"></th>
          </tr>
        </thead>
        <tbody>
          {banners.map((b) => (
            <tr key={b.id} className="border-b border-slate-50 last:border-0 align-middle">
              <td className="py-3 text-slate-500">{b.order}</td>
              <td className="py-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.image} alt={b.alt} className="w-40 h-auto rounded-lg border border-slate-100" />
              </td>
              <td className="py-3 font-medium text-brand-navy">{b.title}</td>
              <td className="py-3 text-slate-500 max-w-[12rem] truncate">{b.link || '—'}</td>
              <td className="py-3">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${b.isActive ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                  {b.isActive ? 'Showing' : 'Hidden'}
                </span>
              </td>
              <td className="py-3 text-right">
                <div className="flex items-center justify-end gap-3">
                  <Link href={`/admin/banners/${b.id}/edit`} aria-label="Edit" className="text-slate-400 hover:text-brand">
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
