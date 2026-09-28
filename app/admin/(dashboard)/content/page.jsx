import Link from 'next/link';
import { Pencil } from 'lucide-react';

const SECTIONS = [
  { key: 'hero', label: 'Homepage Hero' },
  { key: 'about', label: 'About Section' },
  { key: 'cta', label: 'Quote CTA Banner' }
];

export const metadata = { title: 'Site Content' };

export default function AdminContentPage() {
  return (
    <div className="">
      <h2 className="text-lg font-bold text-brand-navy mb-6">Site Content</h2>
      <div className="space-y-3">
        {SECTIONS.map((s) => (
          <Link key={s.key} href={`/admin/content/${s.key}/edit`} className="card flex items-center justify-between hover:border-brand transition-colors">
            <span className="font-medium text-brand-navy">{s.label}</span>
            <Pencil className="w-4 h-4 text-slate-400" />
          </Link>
        ))}
      </div>
    </div>
  );
}