'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, X } from 'lucide-react';

export default function ProductFilters({ categories, brands }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const debounceRef = useRef(null);
  const lastSentRef = useRef(searchParams.get('q') || '');

  const urlQuery = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const brand = searchParams.get('brand') || '';
  const [query, setQuery] = useState(urlQuery);

  // Keep the box in step when the address changes from elsewhere (for example the header search)
  useEffect(() => {
    if (urlQuery !== lastSentRef.current) {
      lastSentRef.current = urlQuery;
      setQuery(urlQuery);
    }
  }, [urlQuery]);

  function updateParam(key, value) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  function onSearchChange(value) {
    setQuery(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      lastSentRef.current = value.trim();
      updateParam('q', value.trim());
    }, 350);
  }

  function clearAll() {
    clearTimeout(debounceRef.current);
    lastSentRef.current = '';
    setQuery('');
    router.push(pathname);
  }

  const hasFilters = Boolean(urlQuery || category || brand || query);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm mb-8">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_auto] items-center">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or part number"
            aria-label="Search products"
            className="finder-input-light !pl-9"
          />
        </div>
        <select
          className="finder-input-light"
          aria-label="Filter by category"
          value={category}
          onChange={(e) => updateParam('category', e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
        </select>
        <select
          className="finder-input-light"
          aria-label="Filter by brand"
          value={brand}
          onChange={(e) => updateParam('brand', e.target.value)}
        >
          <option value="">All Brands</option>
          {brands.map((b) => <option key={b.id} value={b.slug}>{b.name}</option>)}
        </select>
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-brand-navy hover:border-brand hover:text-brand transition-colors"
          >
            <X className="w-4 h-4" /> Clear
          </button>
        )}
      </div>
    </div>
  );
}
