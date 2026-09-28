import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, PackageSearch } from 'lucide-react';

export default function ProductCard({ product }) {
  return (
    <article className="product-card bg-blue-100/30">
      <Link href={`/products/${product.slug}`} className="product-card-img block">
        {product.images?.[0] ? (
          <Image src={product.images[0].url} alt={product.name}
            // fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            width={400}
            height={400} 
            className="object-cover w-full h-auto" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <PackageSearch className="w-8 h-8" />
          </div>
        )}
      </Link>
      <p className="text-blue-600 text-[12px] tracking-[0.1px] uppercase font-bold">{[product.brand?.name, product.category?.name].filter(Boolean).join(' • ')}</p>
      <h3 className="text-black text-xl font-bold mt-3">
        <Link href={`/products/${product.slug}`}>{product.name}</Link>
      </h3>
      {product.shortDescription && <p className="text-[14px] text-slate-600">{product.shortDescription}</p>}
      <Link href={`/products/${product.slug}`} className="mt-2 text-lg font-semibold">View Details <ArrowRight className="w-3.5 h-3.5" /></Link>
    </article>
  );
}
