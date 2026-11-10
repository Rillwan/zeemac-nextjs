'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PackageSearch } from 'lucide-react';

export default function ProductGallery({ images = [], name, badge }) {
  const [index, setIndex] = useState(0);
  const active = images[index] || images[0];

  return (
    <div>
      <div className="product-gallery-main">
        {badge && (
          <span className={`product-badge ${badge === 'New' ? 'is-new' : ''}`}>{badge}</span>
        )}
        {active ? (
          <Image
            src={active.url}
            alt={name}
            fill
            sizes="(min-width: 1024px) 560px, 100vw"
            priority
            className="object-contain p-6"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <PackageSearch className="w-12 h-12" />
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              className="product-thumb"
              aria-label={`Show picture ${i + 1} of ${images.length}`}
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
            >
              <Image src={img.url} alt="" fill sizes="76px" className="object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
