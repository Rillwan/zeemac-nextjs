'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import LogoutButton from '@/components/admin/LogoutButton';

const TABS = [
  { href: '/admin', label: 'Products' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/brands', label: 'Brands' },
  { href: '/admin/content', label: 'Page content' },
  { href: '/admin/seo', label: 'SEO' },
  { href: '/admin/homepage-items', label: 'Homepage Items' },
  { href: '/admin/hero-slides', label: 'Hero Slides' },
  { href: '/admin/banners', label: 'Banners' },
  { href: '/admin/reviews', label: 'Reviews' },
  { href: '/admin/enquiries', label: 'Enquiries' },
  { href: '/admin/settings', label: 'Site Settings' }
];

function isActive(pathname, href) {
  if (href === '/admin') return pathname === '/admin' || pathname.startsWith('/admin/products');
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminHeader({ email }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the phone menu after every page change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-slate-100">
      <header className="px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-extrabold text-brand-navy">Zeemac Admin</p>
          {email && <p className="text-xs text-slate-400 truncate">{email}</p>}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <LogoutButton />
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="admin-menu"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 text-brand-navy"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Tablet and desktop: tabs in a row (wraps to a second line if needed) */}
      <nav className="hidden md:flex flex-wrap gap-x-6 px-6 border-t border-slate-100" aria-label="Admin sections">
        {TABS.map((tab) => {
          const active = isActive(pathname, tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? 'page' : undefined}
              className={`text-sm font-semibold py-3 border-b-2 transition-colors ${
                active
                  ? 'text-brand border-brand'
                  : 'text-slate-500 border-transparent hover:text-brand hover:border-brand'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      {/* Phone: menu button opens a list */}
      {open && (
        <nav
          id="admin-menu"
          className="md:hidden border-t border-slate-100 max-h-[calc(100vh-4.5rem)] overflow-y-auto"
          aria-label="Admin sections"
        >
          {TABS.map((tab) => {
            const active = isActive(pathname, tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? 'page' : undefined}
                className={`block px-4 py-3 text-sm font-semibold border-b border-slate-50 ${
                  active ? 'text-brand bg-brand-light' : 'text-slate-600'
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
