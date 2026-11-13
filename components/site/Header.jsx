"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ArrowRight, ChevronDown, Search } from "lucide-react";
import Image from "next/image";

const SECTION_IDS = ["home", "industries"];

export default function Header({ categories = [], industries = [] }) {
  const pathname = usePathname();
  const router = useRouter();
  const path = pathname || "/";
  const resolveHref = (href) =>
    href.startsWith("#") && path !== "/" ? `/${href}` : href;

  const headerRef = useRef(null);
  const searchInputRef = useRef(null);
  const lastScroll = useRef(0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState("home");

  const isHome = path === "/" && activeId === "home";
  const isProducts =
    path.startsWith("/products") ||
    path.startsWith("/categories") ||
    path.startsWith("/brands");
  const isOilBattery = path.startsWith("/oil-battery");
  const isIndustries = path === "/" && activeId === "industries";
  const isAbout = path.startsWith("/about");
  const isContact = path.startsWith("/contact");

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      const header = headerRef.current;
      if (!header) return;
      if (y > lastScroll.current && y > 160) {
        header.style.transform = "translateY(-100%)";
      } else {
        header.style.transform = "translateY(0)";
      }
      lastScroll.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = SECTION_IDS.map((id) =>
      document.getElementById(id),
    ).filter(Boolean);
    if (!("IntersectionObserver" in window) || sections.length === 0)
      return undefined;

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }),
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("nav-open", menuOpen);
  }, [menuOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1280) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    setSearchOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!searchOpen) return undefined;
    if (searchInputRef.current) searchInputRef.current.focus();
    const onKey = (e) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  function submitSearch(e) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setSearchOpen(false);
    setMenuOpen(false);
    router.push(`/products?q=${encodeURIComponent(q)}`);
  }

  const chevron = (
    <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
  );

  return (
    <>
      <header
        id="site-header"
        ref={headerRef}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "scrolled" : ""}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 flex items-center justify-between h-16 xl:h-20">
          <Link
            href={resolveHref("#home")}
            className="flex items-center gap-2 min-w-0"
            aria-label="Zeemac Filters home"
          >
            <Image
              src="/images/logo.png"
              alt="Zeemac Filters"
              width={100}
              height={50}
              priority
              className="w-[56px] h-auto"
            />
            <span className="leading-tight min-w-0">
              <span className="block text-lg sm:text-xl font-extrabold text-brand-navy truncate">
                Zeemac<span className="text-brand"> Filters</span>
              </span>
              <span className="hidden sm:block text-[8px] tracking-[0.18em] text-slate-800 font-medium -mt-0.5 whitespace-nowrap">
                COMPLETE FILTRATION SOLUTIONS
              </span>
            </span>
          </Link>

          <nav
            className="hidden xl:flex items-center gap-6 2xl:gap-8"
            aria-label="Primary"
          >
            <Link
              href={resolveHref("#home")}
              className={`nav-link ${isHome ? "is-active" : ""}`}
            >
              Home
            </Link>

            <div className="nav-group relative group">
              <Link
                href="/products"
                className={`nav-link inline-flex items-center gap-1 ${isProducts ? "is-active" : ""}`}
              >
                Products {chevron}
              </Link>
              <div className="nav-dropdown absolute left-0 top-full pt-4">
                <div className="min-w-[240px] rounded-2xl bg-white border border-slate-100 shadow-xl p-2">
                  <Link href="/products" className="nav-dropdown-link">
                    All Products
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/categories/${cat.slug}`}
                      className="nav-dropdown-link"
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <div className="my-1 border-t border-slate-100" />
                  <Link href="/brands" className="nav-dropdown-link">
                    Browse by Brand
                  </Link>
                </div>
              </div>
            </div>

            <Link
              href="/oil-battery"
              className={`nav-link ${isOilBattery ? "is-active" : ""}`}
            >
              Oil &amp; Battery
            </Link>

            {industries.length > 0 ? (
              <div className="nav-group relative group">
                <Link
                  href={resolveHref("#industries")}
                  className={`nav-link inline-flex items-center gap-1 ${isIndustries ? "is-active" : ""}`}
                >
                  Industries {chevron}
                </Link>
                <div className="nav-dropdown absolute left-0 top-full pt-4">
                  <div className="min-w-[240px] rounded-2xl bg-white border border-slate-100 shadow-xl p-2">
                    {industries.map((item) => (
                      <Link
                        key={item.id}
                        href={resolveHref("#industries")}
                        className="nav-dropdown-link"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href={resolveHref("#industries")}
                className={`nav-link ${isIndustries ? "is-active" : ""}`}
              >
                Industries
              </Link>
            )}

            <Link
              href="/about"
              className={`nav-link ${isAbout ? "is-active" : ""}`}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className={`nav-link ${isContact ? "is-active" : ""}`}
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex items-center justify-center w-10 h-10 rounded-full text-brand-navy hover:bg-slate-100 transition-colors shrink-0"
              aria-label={searchOpen ? "Close search" : "Search products"}
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((v) => !v)}
            >
              {searchOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>
            <Link
              href="/contact"
              className="!hidden sm:!inline-flex whitespace-nowrap btn-primary px-6 py-3 text-[14px] text-white"
            >
              Request a Quote <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              className="xl:hidden flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 shrink-0"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="absolute inset-x-0 top-full bg-white border-b border-slate-100 shadow-lg">
            <form
              onSubmit={submitSearch}
              className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3"
              role="search"
            >
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by product name or part number"
                aria-label="Search products"
                className="flex-1 min-w-0 bg-transparent outline-none text-[15px] text-slate-800 placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="btn-primary px-5 py-2.5 text-[14px] text-white"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </header>

      <div
        id="mobile-nav"
        className={`xl:hidden fixed inset-0 top-16 bg-white z-40 ${menuOpen ? "open" : ""}`}
      >
        <nav className="flex flex-col gap-1 p-6" aria-label="Mobile">
          <Link
            href={resolveHref("#home")}
            className="mobile-link"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/products"
            className="mobile-link"
            onClick={() => setMenuOpen(false)}
          >
            Products
          </Link>
          <Link
            href="/categories"
            className="mobile-link"
            onClick={() => setMenuOpen(false)}
          >
            Categories
          </Link>
          <Link
            href="/brands"
            className="mobile-link"
            onClick={() => setMenuOpen(false)}
          >
            Brands
          </Link>
          <Link
            href="/oil-battery"
            className="mobile-link"
            onClick={() => setMenuOpen(false)}
          >
            Oil &amp; Battery
          </Link>
          <Link
            href={resolveHref("#industries")}
            className="mobile-link"
            onClick={() => setMenuOpen(false)}
          >
            Industries
          </Link>
          <Link
            href="/about"
            className="mobile-link"
            onClick={() => setMenuOpen(false)}
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="mobile-link"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </Link>
          <Link
            href="/contact"
            className="btn-primary justify-center mt-4"
            onClick={() => setMenuOpen(false)}
          >
            Request a Quote <ArrowRight className="w-4 h-4" />
          </Link>
        </nav>
      </div>
    </>
  );
}
