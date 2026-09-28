'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Mail, MapPin } from 'lucide-react';

const FOOTER_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/products', label: 'Products' },
  { href: '/categories', label: 'Categories' },
  { href: '/brands', label: 'Brands' },
  { href: '#industries', label: 'Industries' },
  { href: '#contact', label: 'Contact Us' }
];

export default function Footer() {
  const pathname = usePathname();
  const path = pathname || '/';
  const resolveHref = (href) => (href.startsWith('#') && path !== '/' ? `/${href}` : href);

  return (
    <footer className="footer-dark pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid sm:grid-cols-3 gap-10 pb-10 border-b border-white/10">
          <div>
            <Link href={resolveHref('#home')} className="flex items-center gap-2 min-w-0">
              <svg width="30" height="30" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <circle cx="17" cy="17" r="13" stroke="#4C8DF0" strokeWidth="2.4" />
                <circle cx="17" cy="17" r="3.2" fill="#4C8DF0" />
              </svg>
              <span className="text-lg font-extrabold text-white">Zeemac<span className="text-brand-sky"> Group</span></span>
            </Link>
            <p className="text-sm text-[#9FB4D9] mt-4 max-w-xs">
              Marine &amp; Industrial Filtration Solutions. Reliable products for marine, industrial and heavy-duty applications.
            </p>
          </div>

          <nav className="flex flex-col gap-3 text-sm font-semibold" aria-label="Footer">
            {FOOTER_LINKS.map((l, i) => (
              <Link key={`${l.href}-${i}`} href={resolveHref(l.href)} className="footer-link">{l.label}</Link>
            ))}
          </nav>

          <div className="space-y-4">
            <div className="footer-contact-item">
              <Phone className="w-4 h-4" />
              <span>+971 4 591 3307</span>
            </div>
            <div className="footer-contact-item">
              <Mail className="w-4 h-4" />
              <span>sales@zeemacgroup.com</span>
            </div>
            <div className="footer-contact-item">
              <MapPin className="w-4 h-4" />
              <span>Dubai, UAE</span>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-[#9FB4D9]">
          <p>© 2026 Zeemac Group. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="footer-link">Privacy Policy</Link>
            <Link href="#" className="footer-link">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
