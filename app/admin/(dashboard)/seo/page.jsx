import Link from 'next/link';
import { Pencil } from 'lucide-react';

const PAGES = [
  { key: 'hero', label: 'Homepage' },
  { key: 'about', label: 'About Page' }
];

export const metadata = { title: 'SEO' };

export default function AdminSeoPage() {
  return (
    <div className="max-w-xl">
      <h2 className="text-lg font-bold text-brand-navy mb-6">SEO</h2>
      <div className="space-y-3">
        {PAGES.map((p) => (
          <Link key={p.key} href={`/admin/seo/${p.key}/edit`} className="card flex items-center justify-between hover:border-brand transition-colors">
            <span className="font-medium text-brand-navy">{p.label}</span>
            <Pencil className="w-4 h-4 text-slate-400" />
          </Link>
        ))}
      </div>
    </div>
  );
}