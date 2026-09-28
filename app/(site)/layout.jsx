import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import Preloader from '@/components/site/Preloader';
import WhatsAppButton from '@/components/site/WhatsAppButton';

export default function SiteLayout({ children }) {
  return (
    <>
      <Preloader />
      <Header />
      <main id="home-wrap">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}