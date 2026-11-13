import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import PageHero from '@/components/site/PageHero';
import ContactForm from '@/components/site/ContactForm';
import { getSettings } from '@/lib/settings';
import { telHref, whatsappUrl } from '@/lib/contact';

export const metadata = {
  title: 'Contact Us',
  description:
    'Contact Zeemac Filters for marine, industrial and automotive filtration products. Send an enquiry, call us or message us on WhatsApp.'
};
export const dynamic = 'force-dynamic';

function InfoRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-4">
      <span className="about-icon">
        <Icon className="w-6 h-6" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p>
        <div className="mt-1 text-brand-navy font-medium break-words">{children}</div>
      </div>
    </div>
  );
}

export default async function ContactPage({ searchParams }) {
  const params = await searchParams;
  const settings = await getSettings();
  const topic = typeof params?.topic === 'string' ? params.topic : 'filters';
  const chatHref = whatsappUrl(settings.whatsappNumber, "Hi Zeemac Filters, I'd like to enquire about your products");

  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title="Let’s Talk About Your **Requirements**"
        description="Send us your enquiry and our team will get back to you with the right solution for your equipment."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
      />

      <section className="py-10 lg:py-14 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-10 items-start">
          <div className="space-y-6">
            <div className="detail-card !p-6 sm:!p-8 space-y-6">
              <InfoRow icon={Phone} label="Phone">
                <a href={telHref(settings.phone)} className="hover:text-brand transition-colors">{settings.phone}</a>
              </InfoRow>
              <InfoRow icon={MessageCircle} label="WhatsApp">
                <a href={chatHref} target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors">
                  Chat with us on WhatsApp
                </a>
              </InfoRow>
              <InfoRow icon={Mail} label="Email">
                <a href={`mailto:${settings.email}`} className="hover:text-brand transition-colors">{settings.email}</a>
              </InfoRow>
              <InfoRow icon={MapPin} label="Address">
                <span className="whitespace-pre-line">{settings.address}</span>
              </InfoRow>
              {settings.workingHours && (
                <InfoRow icon={Clock} label="Working hours">{settings.workingHours}</InfoRow>
              )}
            </div>

            {settings.mapEmbedUrl && (
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <iframe
                  src={settings.mapEmbedUrl}
                  title="Zeemac Filters location on Google Maps"
                  className="w-full h-72 border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            )}
          </div>

          <div className="detail-card !p-6 sm:!p-8" id="enquiry">
            <h2 className="text-xl font-bold text-brand-navy mb-1">Send an Enquiry</h2>
            <p className="text-sm text-slate-500 mb-6">Tell us what you need and we will reply as soon as possible.</p>
            <ContactForm initialTopic={topic} whatsappHref={chatHref} />
          </div>
        </div>
      </section>
    </>
  );
}
