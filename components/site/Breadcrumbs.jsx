import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ items = [], className = 'mb-5' }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={`${className} text-sm text-slate-500`}>
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((crumb, i) => (
          <li key={`${crumb.label}-${i}`} className="flex items-center gap-2">
            {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-brand transition-colors">{crumb.label}</Link>
            ) : (
              <span className="font-medium text-brand-navy" aria-current="page">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
