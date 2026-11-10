import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, FileText, Info, PackageSearch, Settings2 } from 'lucide-react';
import { getSpecHighlights } from '@/lib/specs';
import { PRODUCT_WHATSAPP_NUMBER } from '@/lib/contact';

export default function ProductCard({ product }) {
  const href = `/products/${product.slug}`;
  const specs = getSpecHighlights(product.specifications, 2);
  const enquiryText = `Hi Zeemac Filters, I'd like to enquire about: ${product.name}${product.partNumber ? ` (Part No: ${product.partNumber})` : ''}`;
  const enquiryHref = `https://wa.me/${PRODUCT_WHATSAPP_NUMBER}?text=${encodeURIComponent(enquiryText)}`;

  return (
    <article className="product-card">
      <div className="product-card-main">
        <Link href={href} className="product-card-img" aria-label={product.name}>
          {product.badge && (
            <span className={`product-badge ${product.badge === 'New' ? 'is-new' : ''}`}>{product.badge}</span>
          )}
          {product.images?.[0] ? (
            <Image
              src={product.images[0].url}
              alt={product.name}
              width={400}
              height={400}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <PackageSearch className="w-8 h-8" />
            </div>
          )}
        </Link>

        <div className="product-card-body">
          <h3>
            <Link href={href}>{product.name}</Link>
          </h3>
          {product.partNumber && <p className="product-partno">Part No: {product.partNumber}</p>}
          {product.shortDescription && <p className="product-desc">{product.shortDescription}</p>}

          {specs.length > 0 && (
            <ul className="product-specs">
              {specs.map((spec) => (
                <li key={spec.label}>
                  <Settings2 className="w-4 h-4" />
                  <span>
                    {spec.label}: {spec.value}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="product-actions">
        <a
          href={enquiryHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary btn-sm"
        >
          Enquire Now <ArrowRight className="w-4 h-4" />
        </a>
        {product.datasheetUrl ? (
          <a
            href={product.datasheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="product-doc-btn"
            aria-label={`Download datasheet for ${product.name}`}
          >
            <FileText className="w-5 h-5" />
          </a>
        ) : (
          <Link href={href} className="product-doc-btn" aria-label={`View details of ${product.name}`}>
            <Info className="w-5 h-5" />
          </Link>
        )}
      </div>
    </article>
  );
}
