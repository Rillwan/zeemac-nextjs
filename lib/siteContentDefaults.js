// Single source of truth for Hero/About/CTA site-content:
// - which fields each section has
// - the label/input-type for each field
// - the default text shown when nothing has been saved to the DB yet
// Used by both the admin form (SiteContentForm) and the public site
// components (Hero/About/CTA) so the two never drift out of sync.

export const FIELD_META = {
    eyebrow: { label: 'Eyebrow (small label above heading)', type: 'text' },
    heading: { label: 'Heading', type: 'text' },
    headingLine2: { label: 'Heading — Line 2', type: 'text' },
    body1: { label: 'Paragraph 1', type: 'textarea' },
    body2: { label: 'Paragraph 2', type: 'textarea' },
    body3: { label: 'Paragraph 3', type: 'textarea' },
    tagline: { label: 'Tagline points (comma separated)', type: 'text' },
    image: { label: 'Image', type: 'image' },
    imageAlt: { label: 'Image Alt Text (SEO)', type: 'text' }
};

export const SITE_CONTENT_FIELDS = {
    hero: ['eyebrow', 'heading', 'headingLine2', 'body1', 'tagline', 'image', 'imageAlt'],
    about: ['eyebrow', 'heading', 'body1', 'body2', 'body3', 'image', 'imageAlt'],
    cta: ['heading', 'body1', 'image', 'imageAlt'],
    categories: ['eyebrow', 'heading', 'body1'],
    brands: ['eyebrow', 'heading', 'body1'],
    industries: ['eyebrow', 'heading'],
    whychoose: ['eyebrow', 'heading'],
    productfinder: ['eyebrow', 'heading', 'body1']
};

export const SITE_CONTENT_DEFAULTS = {
    hero: {
        eyebrow: '--- Not Available ---',
        heading: 'Complete Heavy',
        headingLine2: 'Filtration Solutions',
        body1: 'Zeemac Filters supplies a comprehensive range of filtration products for marine engines, industrial machinery, hydraulic systems, compressors, power plants and other demanding applications.',
        tagline: 'Quality Products, Trusted Brands, Industrial Expertise, UAE',
        image: '/images/hero.png',
        imageAlt: 'Marine and industrial filtration products'
    },
    about: {
        eyebrow: 'About Us',
        heading: 'Your Trusted Partner for Filtration & Marine Solutions',
        body1: 'At Zeemac Filters, we provide reliable filtration and marine industrial products designed to support the performance, efficiency and longevity of critical equipment.',
        body2: 'From engine filters and hydraulic filtration to industrial and process filtration solutions, our product range serves a wide variety of applications across marine, industrial, construction, power and other sectors.',
        body3: 'With a strong focus on product quality, availability and customer support, we help businesses find the right filtration solution for their specific requirements.',
        image: '/images/about.jpeg',
        imageAlt: 'Zeemac filtration products and marine equipment'
    },
    cta: {
        heading: 'Need the Right Filtration Solution?',
        body1: 'Whether you need a single replacement filter or filtration products for ongoing industrial requirements, our team is ready to assist. Tell us what you need — we\u2019ll help you find the right solution.',
        image: '/images/about.jpeg',
        imageAlt: 'Zeemac filtration solutions'
    },
    categories: {
        eyebrow: 'Explore Our Products',
        heading: 'Find the Right Filtration Solution',
        body1: 'Find the right filtration solution for your equipment and application.'
    },
    brands: {
        eyebrow: 'Trusted Brands. Reliable Filtration.',
        heading: 'Products From Established Manufacturers',
        body1: 'We offer filtration products from established manufacturers and brands serving marine, industrial, hydraulic, engine and process applications.'
    },
    industries: {
        eyebrow: 'Industries We Serve',
        heading: 'Filtration Solutions Across Multiple Industries'
    },
    whychoose: {
        eyebrow: 'Why Choose Us',
        heading: 'Why Businesses Choose Zeemac Filters'
    },
    productfinder: {
        eyebrow: 'Looking for a Specific Filter?',
        heading: 'Can\u2019t find the product you\u2019re looking for?',
        body1: 'Send us the part number, brand, equipment model or filter details, and our team will help you identify the right product.'
    }
};