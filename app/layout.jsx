import './globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Script from 'next/script';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap'
});

const SITE_URL = 'https://www.zeemacfilters.com';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Zeemac Filters | Marine & Industrial Filtration Solutions',
    template: '%s | Zeemac Filters'
  },
  icons:{
    icon: '/images/logo.png',
  },
  description: 'Zeemac Filters supplies a comprehensive range of filtration products for marine engines, industrial machinery, hydraulic systems, compressors, power plants and other demanding applications.',
  keywords: ['marine filters', 'industrial filtration', 'hydraulic filters', 'oil filters', 'fuel filters', 'air filters', 'water filters', 'compressor filters', 'Zeemac Filters', 'UAE filtration supplier'],
  authors: [{ name: 'Zeemac Filters' }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    title: 'Zeemac Filters | Marine & Industrial Filtration Solutions',
    description: 'Reliable filters for marine, industrial and heavy-duty applications. Quality products, trusted brands, industrial expertise — UAE.',
    url: SITE_URL,
    siteName: 'Zeemac Filters',
    images: [{ url: 'https://placehold.co/1200x630/123d8a/ffffff?text=Zeemac+Group', width: 1200, height: 630 }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zeemac Filters | Marine & Industrial Filtration Solutions',
    description: 'Reliable filters for marine, industrial and heavy-duty applications — UAE.',
    images: ['https://placehold.co/1200x630/123d8a/ffffff?text=Zeemac+Group']
  }
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Zeemac Filters',
  url: SITE_URL,
  description: 'Supplier of marine and industrial filtration products including engine, oil, fuel, air, hydraulic, water/RO and compressor filters.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Dubai',
    addressCountry: 'AE'
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+971-4-591-3307',
    email: 'sales@zeemacfilters.com',
    contactType: 'sales',
    areaServed: 'AE'
  }
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Zeemac Filters',
  url: SITE_URL
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={jakarta.variable} suppressHydrationWarning>
      <body className="font-sans text-brand-navy antialiased overflow-x-hidden" suppressHydrationWarning>
        {children}

        <Script
          id="ld-organization"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Script
          id="ld-website"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </body>
    </html>
  );
}
