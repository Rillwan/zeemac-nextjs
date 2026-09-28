'use client';

import { useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search } from 'lucide-react';

export default function ProductFilters({ categories, brands }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const debounceRef = useRef(null);

  function updateParam(key, value) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  function updateSearchDebounced(value) {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateParam('q', value), 350);
  }

  return (
    <div className="grid sm:grid-cols-3 gap-3 mb-10">
      <div className="relative sm:col-span-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          defaultValue={searchParams.get('q') || ''}
          onChange={(e) => updateSearchDebounced(e.target.value)}
          placeholder="Search products…"
          className="finder-input-light !pl-8"
        />
      </div>
      <select
        className="finder-input-light"
        defaultValue={searchParams.get('category') || ''}
        onChange={(e) => updateParam('category', e.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
      </select>
      <select
        className="finder-input-light"
        defaultValue={searchParams.get('brand') || ''}
        onChange={(e) => updateParam('brand', e.target.value)}
      >
        <option value="">All Brands</option>
        {brands.map((b) => <option key={b.id} value={b.slug}>{b.name}</option>)}
      </select>
    </div>
  );
}
