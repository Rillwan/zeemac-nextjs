import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import Preloader from '@/components/site/Preloader';
import WhatsAppButton from '@/components/site/WhatsAppButton';
import { prisma } from '@/lib/prisma';
import { getSettings } from '@/lib/settings';

export default async function SiteLayout({ children }) {
  const [categories, industries, settings] = await Promise.all([
    prisma.category.findMany({
      orderBy: [{ order: 'asc' }, { id: 'asc' }],
      select: { name: true, slug: true }
    }),
    prisma.homepageItem.findMany({
      where: { section: 'industries' },
      orderBy: { order: 'asc' },
      select: { id: true, title: true }
    }),
    getSettings()
  ]);

  return (
    <>
      <Preloader />
      <Header categories={categories} industries={industries} />
      <main id="home-wrap">{children}</main>
      <Footer settings={settings} />
      <WhatsAppButton number={settings.whatsappNumber} />
    </>
  );
}
