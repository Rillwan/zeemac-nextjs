import { prisma } from '@/lib/prisma';
import BannerSlider from '@/components/site/BannerSlider';

function safeLink(value) {
  if (typeof value !== 'string') return '';
  const v = value.trim();
  if (v.startsWith('/') && !v.startsWith('//')) return v;
  return /^https?:\/\//i.test(v) ? v : '';
}

export default async function Banners() {
  const rows = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: [{ order: 'asc' }, { id: 'asc' }]
  });

  if (rows.length === 0) return null;

  const banners = rows.map((b) => ({
    id: b.id,
    image: b.image,
    mobileImage: b.mobileImage || '',
    alt: b.alt,
    link: safeLink(b.link)
  }));

  // Phones get a taller 4:3 frame only when every banner has its own phone picture
  const mobileFrame = banners.every((b) => b.mobileImage);

  return (
    <section aria-label="Featured banners" className="bg-white">
      <BannerSlider banners={banners} mobileFrame={mobileFrame} />
    </section>
  );
}
