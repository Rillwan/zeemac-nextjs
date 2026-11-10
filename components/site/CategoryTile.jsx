import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Filter } from 'lucide-react';
import { ICON_MAP } from '@/lib/icons';

export default function CategoryTile({ category, count }) {
  const Icon = ICON_MAP[category.icon] || Filter;

  return (
    <Link href={`/categories/${category.slug}`} className="category-tile">
      <div className="category-tile-body">
        <span className="category-tile-icon">
          <Icon className="w-6 h-6" />
        </span>
        <h3>{category.name}</h3>
        {category.description && <p className="line-clamp-3">{category.description}</p>}
        {typeof count === 'number' && (
          <span className="mt-2 text-xs font-medium text-slate-700">
            {count} product{count === 1 ? '' : 's'}
          </span>
        )}
        <span className="category-tile-link">
          Explore Category <ArrowRight className="w-4 h-4" />
        </span>
      </div>
      {category.image && (
        <div className="category-tile-img">
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="(min-width: 1024px) 160px, 40vw"
          />
        </div>
      )}
    </Link>
  );
}
