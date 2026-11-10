import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import Preloader from '@/components/site/Preloader';
import WhatsAppButton from '@/components/site/WhatsAppButton';
import { prisma } from '@/lib/prisma';

export default async function SiteLayout({ children }) {
  const [categories, industries] = await Promise.all([
    prisma.category.findMany({
      orderBy: [{ order: 'asc' }, { id: 'asc' }],
      select: { name: true, slug: true }
    }),
    prisma.homepageItem.findMany({
      where: { section: 'industries' },
      orderBy: { order: 'asc' },
      select: { id: true, title: true }
    })
  ]);

  return (
    <>
      <Preloader />
      <Header categories={categories} industries={industries} />
      <main id="home-wrap">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
