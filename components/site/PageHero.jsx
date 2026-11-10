import { Headset, ShieldCheck, Truck } from 'lucide-react';
import AccentText from '@/components/site/AccentText';
import Breadcrumbs from '@/components/site/Breadcrumbs';

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: ['Genuine', 'Manufacturers'] },
  { icon: Truck, label: ['Wide Product', 'Range'] },
  { icon: Headset, label: ['Technical', 'Support'] },
];

// Light header band used at the top of the listing pages (products, categories, brands and their detail pages)
export default function PageHero({ eyebrow, title, description, breadcrumbs = [], showTrust = false, children }) {
  return (
    <section className="page-hero pt-28 pb-10 lg:pt-36 lg:pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <Breadcrumbs items={breadcrumbs} />

        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
            <h1 className="section-title mt-3">
              <AccentText text={title} />
            </h1>
            {description && (
              <p className="mt-4 text-slate-500 whitespace-pre-line">{description}</p>
            )}
          </div>

          {children}

          {showTrust && (
            <div className="hidden lg:flex items-center">
              {TRUST_ITEMS.map(({ icon: Icon, label }) => (
                <div key={label[0]} className="trust-item">
                  <Icon className="w-6 h-6 text-brand shrink-0" />
                  <span>
                    {label[0]}
                    <br />
                    {label[1]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
