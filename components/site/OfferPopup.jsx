'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, X } from 'lucide-react';

const SHOW_DELAY_MS = 1800;
const CLOSE_MS = 200;

// Turns "get **15% OFF** today" into text with the starred part in bold
function renderBold(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={i} className="font-bold text-brand-navy">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function linkProps(href) {
  if (/^https?:\/\//i.test(href)) {
    return { href, target: '_blank', rel: 'noopener noreferrer' };
  }
  return { href };
}

export default function OfferPopup({ data, version, intervalMinutes = 15 }) {
  const [open, setOpen] = useState(false);
  const [entered, setEntered] = useState(false);
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);
  const lastFocus = useRef(null);
  const closingRef = useRef(false);

  // Show on arrival, then again only when the visitor returns after the admin-set number of minutes
  // (or straight away when the admin saved a new version of the offer). Waits for the preloader first.
  useEffect(() => {
    const key = 'zeemac-offer-popup';
    const waitMs = Math.max(0, Number(intervalMinutes) || 0) * 60000;

    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const last = JSON.parse(raw);
        if (last && last.v === version && Date.now() - last.t < waitMs) return undefined;
      }
    } catch {
      // storage blocked or unreadable: treat as a first visit
    }

    let timer;
    const schedule = () => {
      timer = setTimeout(() => {
        try {
          window.localStorage.setItem(key, JSON.stringify({ v: version, t: Date.now() }));
        } catch {
          // storage blocked
        }
        lastFocus.current = document.activeElement;
        setOpen(true);
      }, SHOW_DELAY_MS);
    };

    if (document.body.classList.contains('loaded')) {
      schedule();
    } else {
      window.addEventListener('zeemac:loaded', schedule, { once: true });
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('zeemac:loaded', schedule);
    };
  }, [version, intervalMinutes]);

  const close = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setEntered(false);
    setTimeout(() => {
      setOpen(false);
      closingRef.current = false;
      if (lastFocus.current && typeof lastFocus.current.focus === 'function') {
        lastFocus.current.focus();
      }
    }, CLOSE_MS);
  }, []);

  // Open animation, scroll lock, focus handling, Esc to close and Tab kept inside the dialog
  useEffect(() => {
    if (!open) return undefined;

    const frame = requestAnimationFrame(() => {
      setEntered(true);
      if (closeBtnRef.current) closeBtnRef.current.focus();
    });

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e) => {
      if (e.key === 'Escape') {
        close();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll(
        'a[href], button:not([disabled])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="presentation">
      <div
        onClick={close}
        className={`absolute inset-0 bg-brand-navy/60 backdrop-blur-sm transition-opacity duration-200 ${entered ? 'opacity-100' : 'opacity-0'}`}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="offer-popup-title"
        className={`relative w-full max-w-3xl max-h-[92svh] overflow-y-auto rounded-3xl border-2 border-brand/70 bg-white p-5 shadow-2xl transition-all duration-200 sm:p-8 ${entered ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-3 scale-95 opacity-0'}`}
      >
        <button
          ref={closeBtnRef}
          type="button"
          onClick={close}
          aria-label="Close offer"
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-brand-navy transition-colors hover:bg-slate-100"
        >
          <X className="h-6 w-6" />
        </button>

        <div className={`grid items-center gap-6 ${data.image ? 'md:grid-cols-[0.9fr_1.1fr]' : ''}`}>
          {data.image && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100 md:aspect-square">
              <Image
                src={data.image}
                alt={data.imageAlt || data.heading}
                fill
                sizes="(min-width: 768px) 320px, 90vw"
                className="object-cover"
              />
            </div>
          )}

          <div className="pt-6 md:pt-0">
            {data.eyebrow && (
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">{data.eyebrow}</p>
            )}
            <h2
              id="offer-popup-title"
              className="mt-2 text-3xl font-semibold leading-tight text-brand-navy sm:text-4xl"
            >
              {data.heading}
            </h2>
            {data.body && (
              <p className="mt-4 text-[15px] leading-relaxed text-slate-600 sm:text-base">
                {renderBold(data.body)}
              </p>
            )}
          </div>
        </div>

        <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:gap-4">
          <a {...linkProps(data.primaryLink)} onClick={close} className="btn-primary justify-center">
            {data.primaryText} <ArrowRight className="h-4 w-4" />
          </a>
          {data.secondaryText && (
            <a href="/products" onClick={close} className="btn-outline justify-center">
              {data.secondaryText} <ArrowRight className="h-4 w-4" />
            </a>
          )}
        </div>

        {data.terms && <p className="mt-4 text-center text-xs text-slate-500">{data.terms}</p>}
      </div>
    </div>
  );
}
