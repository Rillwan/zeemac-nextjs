import { ArrowRight, Star } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import Reveal from '@/components/site/Reveal';
import AccentText from '@/components/site/AccentText';
import GoogleIcon from '@/components/site/GoogleIcon';
import ReviewsCarousel from '@/components/site/ReviewsCarousel';
import { SITE_CONTENT_DEFAULTS } from '@/lib/siteContentDefaults';

const monthYear = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });

function safeLink(value) {
  return typeof value === 'string' && /^https?:\/\//i.test(value.trim()) ? value.trim() : '';
}

export default async function Reviews() {
  const defaults = SITE_CONTENT_DEFAULTS.reviews;
  const [content, rows] = await Promise.all([
    prisma.siteContent.findUnique({ where: { section: 'reviews' } }),
    prisma.review.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { id: 'asc' }]
    })
  ]);

  if (rows.length === 0) return null;

  const reviews = rows.map((r) => ({
    id: r.id,
    authorName: r.authorName,
    authorPhoto: r.authorPhoto || '',
    rating: r.rating,
    text: r.text || '',
    dateLabel: r.reviewDate ? monthYear.format(r.reviewDate) : '',
    url: safeLink(r.reviewUrl)
  }));

  const writeUrl = safeLink(content?.body2);
  const allUrl = safeLink(content?.body3);
  const rating = (content?.tagline || '').trim();
  const total = (content?.headingLine2 || '').trim();

  return (
    <section id="reviews" className="section-pad bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <Reveal as="p" className="section-eyebrow">
            {content?.eyebrow || defaults.eyebrow}
          </Reveal>
          <Reveal as="h2" className="section-title mt-3" delay={0.05}>
            <AccentText text={content?.heading || defaults.heading} />
          </Reveal>
          <Reveal as="p" className="mt-4 text-black" delay={0.1}>
            {content?.body1 || defaults.body1}
          </Reveal>
        </div>

        {rating && (
          <Reveal as="div" className="mb-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2" delay={0.12}>
            <GoogleIcon className="w-8 h-8" />
            <span className="text-3xl font-bold text-brand-navy">{rating}</span>
            <span className="inline-flex gap-0.5" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </span>
            {total && <span className="text-sm text-slate-500">Based on {total} Google reviews</span>}
          </Reveal>
        )}

        <ReviewsCarousel reviews={reviews} fallbackUrl={allUrl} />

        {(writeUrl || allUrl) && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {writeUrl && (
              <a href={writeUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <Star className="w-4 h-4" /> Write a Review
              </a>
            )}
            {allUrl && (
              <a href={allUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
                See All Reviews on Google <ArrowRight className="w-4 h-4" />
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
