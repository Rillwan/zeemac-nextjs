'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const NAV_ITEMS = [
  { href: '#home', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/products', label: 'Products' },
  { href: '/brands', label: 'Brands' },
  { href: '#industries', label: 'Industries' },
  { href: '#contact', label: 'Contact' }
];

export default function Header() {
  const pathname = usePathname();
  const path = pathname || '/';
  const resolveHref = (href) => (href.startsWith('#') && path !== '/' ? `/${href}` : href);
  const isActive = (item) => {
    if (item.href.startsWith('#')) {
      return pathname === '/' && activeId === item.href.replace('#', '');
    }
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };
  const headerRef = useRef(null);
  const lastScroll = useRef(0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState('home');

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      const header = headerRef.current;
      if (!header) return;
      if (y > lastScroll.current && y > 160) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
      lastScroll.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_ITEMS
      .map((item) => document.getElementById(item.href.replace('#', '')))
      .filter(Boolean);
    if (!('IntersectionObserver' in window) || sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => { if (entry.isIntersecting) setActiveId(entry.target.id); }),
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.classList.toggle('nav-open', menuOpen);
  }, [menuOpen]);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1280) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>
      <header id="site-header" ref={headerRef} className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'scrolled' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 flex items-center justify-between h-16 xl:h-20">
          <Link href={resolveHref('#home')} className="flex items-center gap-2 min-w-0" aria-label="Zeemac Group home">
            {/* <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <circle cx="17" cy="17" r="13" stroke="#1E63D6" strokeWidth="2.4" />
            <circle cx="17" cy="17" r="3.2" fill="#1E63D6" />
            <path d="M17 4V11M17 23V30M4 17H11M23 17H30M7.7 7.7L12.2 12.2M21.8 21.8L26.3 26.3M26.3 7.7L21.8 12.2M12.2 21.8L7.7 26.3" stroke="#1E63D6" strokeWidth="2.4" />
          </svg> */}
            <Image
              src="/images/logo.png"
              alt="Zeemac Group"
              width={100}
              height={50}
              priority
              className="w-[60px] h-auto"
            />
            <span className="leading-tight min-w-0">
              <span className="block text-lg sm:text-xl font-extrabold text-brand-navy truncate">Zeemac<span className="text-brand"> Group</span></span>
              <span className="hidden sm:block text-[8px] tracking-[0.18em] text-slate-800 font-medium -mt-0.5 whitespace-nowrap">MARINE &amp; INDUSTRIAL FILTRATION</span>
            </span>
          </Link>

          <nav className="hidden xl:flex items-center gap-7" aria-label="Primary">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={resolveHref(item.href)} className={`nav-link ${isActive(item) ? 'is-active' : ''}`}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href={resolveHref('#contact')} className="!hidden sm:!inline-flex whitespace-nowrap btn-primary  px-6 py-3 text-[14px] text-white">
              Request a Quote <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              className="xl:hidden flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 shrink-0 "
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-nav" className={`xl:hidden fixed inset-0 top-16 bg-white z-40 ${menuOpen ? 'open' : ''}`}>
        <nav className="flex flex-col gap-1 p-6" aria-label="Mobile">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={resolveHref(item.href)} className="mobile-link" onClick={() => setMenuOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Link href={resolveHref('#contact')} className="btn-primary justify-center mt-4" onClick={() => setMenuOpen(false)}>
            Request a Quote <ArrowRight className="w-4 h-4" />
          </Link>
        </nav>
      </div>
    </>
  );
}
