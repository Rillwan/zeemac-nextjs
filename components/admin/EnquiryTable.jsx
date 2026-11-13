'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Mail, Phone, RotateCcw, Trash2 } from 'lucide-react';
import { ENQUIRY_TOPICS } from '@/lib/contact';

const TOPIC_LABELS = Object.fromEntries(ENQUIRY_TOPICS.map((t) => [t.value, t.label]));

function formatDate(iso) {
  return new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function EnquiryTable({ initialEnquiries }) {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [busyId, setBusyId] = useState(null);

  async function setStatus(id, status) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Update failed');
      setEnquiries((list) => list.map((e) => (e.id === id ? { ...e, status } : e)));
      router.refresh();
    } catch {
      alert('Could not update this enquiry. Try again.');
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id) {
    if (!confirm('Delete this enquiry? This cannot be undone.')) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/enquiries/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setEnquiries((list) => list.filter((e) => e.id !== id));
      router.refresh();
    } catch {
      alert('Could not delete this enquiry. Try again.');
    } finally {
      setBusyId(null);
    }
  }

  if (enquiries.length === 0) {
    return <p className="text-slate-500 text-sm">No enquiries yet.</p>;
  }

  return (
    <div className="space-y-4">
      {enquiries.map((e) => (
        <article key={e.id} className="card">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-brand-navy">{e.name}</h3>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${e.status === 'new' ? 'bg-blue-50 text-brand' : 'bg-green-50 text-green-600'}`}>
                  {e.status === 'new' ? 'New' : 'Handled'}
                </span>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                  {TOPIC_LABELS[e.topic] || e.topic}
                </span>
              </div>
              {e.company && <p className="text-sm text-slate-500 mt-1">{e.company}</p>}
              <p className="text-xs text-slate-400 mt-1">{formatDate(e.createdAt)}</p>
            </div>

            <div className="flex items-center gap-2">
              {e.status === 'new' ? (
                <button
                  type="button"
                  onClick={() => setStatus(e.id, 'handled')}
                  disabled={busyId === e.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-brand-navy hover:border-brand hover:text-brand disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5" /> Mark handled
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setStatus(e.id, 'new')}
                  disabled={busyId === e.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:border-brand hover:text-brand disabled:opacity-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Mark as new
                </button>
              )}
              <button
                type="button"
                onClick={() => remove(e.id)}
                disabled={busyId === e.id}
                aria-label="Delete enquiry"
                className="text-slate-400 hover:text-red-500 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-600 whitespace-pre-line">{e.message}</p>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {e.phone && (
              <a href={`tel:${e.phone.replace(/[^\d+]/g, '')}`} className="inline-flex items-center gap-2 text-brand hover:underline">
                <Phone className="w-4 h-4" /> {e.phone}
              </a>
            )}
            {e.email && (
              <a href={`mailto:${e.email}`} className="inline-flex items-center gap-2 text-brand hover:underline">
                <Mail className="w-4 h-4" /> {e.email}
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
