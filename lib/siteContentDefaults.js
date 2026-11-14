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
    about: ['eyebrow', 'heading', 'body1', 'body2', 'body3', 'image', 'imageAlt', 'tagline', 'headingLine2'],
    cta: ['heading', 'body1', 'image', 'imageAlt'],
    categories: ['eyebrow', 'heading', 'body1'],
    brands: ['eyebrow', 'heading', 'body1'],
    industries: ['eyebrow', 'heading'],
    whychoose: ['eyebrow', 'heading', 'body1'],
    productfinder: ['eyebrow', 'heading', 'body1'],
    featured: ['eyebrow', 'heading', 'body1'],
    reviews: ['eyebrow', 'heading', 'body1', 'tagline', 'headingLine2', 'body2', 'body3'],
    oilbattery: ['eyebrow', 'heading', 'body1', 'image', 'imageAlt', 'image2', 'image3', 'body2', 'body3', 'headingLine2'],
    popup: ['eyebrow', 'heading', 'body1', 'body2', 'image', 'imageAlt', 'tagline', 'body3', 'headingLine2']
};

// Per-section label overrides: the popup re-uses generic columns, so the admin form shows its own wording
export const SECTION_FIELD_META = {
    oilbattery: {
        eyebrow: { label: 'Eyebrow (small label above the heading)', type: 'text' },
        heading: { label: 'Home section heading (put **words** between double stars to show them in blue)', type: 'text' },
        body1: { label: 'Paragraph at the top of the Oil & Battery page', type: 'textarea' },
        image: { label: 'Oil & Battery page top picture (oil and batteries together, 4:3, under 250 KB)', type: 'image' },
        imageAlt: { label: 'Picture Alt Text (SEO)', type: 'text' },
        image2: { label: 'Oil card picture (4:3, white or light background, under 250 KB)', type: 'image' },
        image3: { label: 'Battery card picture (4:3, white or light background, under 250 KB)', type: 'image' },
        body2: { label: 'Gallery picture 1 - oils (Oil & Battery page, portrait 4:5, under 250 KB)', type: 'image' },
        body3: { label: 'Gallery picture 2 - batteries (portrait 4:5, under 250 KB)', type: 'image' },
        headingLine2: { label: 'Gallery picture 3 - product support (portrait 4:5, under 250 KB)', type: 'image' }
    },
    reviews: {
        eyebrow: { label: 'Eyebrow (small label above heading)', type: 'text' },
        heading: { label: 'Heading (put **words** between double stars to show them in blue)', type: 'text' },
        body1: { label: 'Short description under the heading', type: 'textarea' },
        tagline: { label: 'Overall Google rating (e.g. 4.9). Leave empty to hide the rating summary', type: 'text' },
        headingLine2: { label: 'Total number of Google reviews (e.g. 120)', type: 'text' },
        body2: { label: 'Link for the "Write a Review" button (your Google review link). Empty hides the button', type: 'text' },
        body3: { label: 'Link for "See All Reviews on Google" (your Google Maps page). Also used when a review has no link of its own', type: 'text' }
    },
    categories: {
        eyebrow: { label: 'Eyebrow (small label above heading)', type: 'text' },
        heading: { label: 'Heading (put **words** between double stars to show them in blue)', type: 'text' },
        body1: { label: 'Short description under the heading', type: 'textarea' }
    },
    about: {
        tagline: { label: 'Badge on the picture: title (e.g. ISO Certified Filtration Standards)', type: 'text' },
        headingLine2: { label: 'Badge on the picture: small text', type: 'text' }
    },
    whychoose: {
        eyebrow: { label: 'Eyebrow (small label above heading)', type: 'text' },
        heading: { label: 'Heading (put **word** between double stars to show it in blue)', type: 'text' },
        body1: { label: 'Short description under the heading', type: 'textarea' }
    },
    popup: {
        eyebrow: { label: 'Small label above the heading (e.g. Special Offer:)', type: 'text' },
        heading: { label: 'Heading', type: 'text' },
        body1: { label: 'Offer text (put **words** between double stars to make them bold)', type: 'textarea' },
        body2: { label: 'Validity / terms line (optional, e.g. Valid until 31 December 2026. T&C apply.)', type: 'text' },
        image: { label: 'Popup picture (square or 4:3, under 200 KB)', type: 'image' },
        imageAlt: { label: 'Picture Alt Text (SEO)', type: 'text' },
        tagline: { label: 'Main button text', type: 'text' },
        body3: { label: 'Main button link (e.g. #contact)', type: 'text' },
        headingLine2: { label: 'Second button text (opens the Products page, leave empty to hide)', type: 'text' }
    }
};

export const SITE_CONTENT_DEFAULTS = {
    hero: {
        eyebrow: 'Marine & Industrial Filtration Solutions',
        heading: 'High-Performance Filtration Solutions',
        headingLine2: 'for Every Need',
        body1: 'We supply premium quality filters and filtration solutions for marine, industrial and automotive applications, from trusted global manufacturers.',
        tagline: 'Quality Products, Trusted Brands, Industrial Expertise, UAE',
        image: '/images/bg-hero.jpg',
        imageAlt: 'Marine and industrial filtration products'
    },
    about: {
        eyebrow: 'About Zeemac Filters',
        heading: 'Your Trusted Partner for Filtration & Marine Solutions',
        body1: 'Zeemac Filters is a leading supplier of high-quality filtration products for marine, industrial and automotive applications. We work with globally recognized manufacturers to deliver genuine products, reliable supply and expert support.',
        body2: '',
        body3: '',
        image: '/images/about.jpeg',
        imageAlt: 'Zeemac filtration products and marine equipment',
        tagline: 'ISO Certified Filtration Standards',
        headingLine2: 'Trusted by engineers and industrial clients worldwide.'
    },
    cta: {
        heading: 'Need the Right Filtration Solution?',
        body1: 'Whether you need a single replacement filter or filtration products for ongoing industrial requirements, our team is ready to assist. Tell us what you need — we\u2019ll help you find the right solution.',
        image: '/images/about.jpeg',
        imageAlt: 'Zeemac filtration solutions'
    },
    categories: {
        eyebrow: 'Shop by Filter Category',
        heading: 'Find the Right Filtration Solution for **Your Industry**',
        body1: 'We offer a complete range of high-quality filtration products for marine, industrial and automotive applications.'
    },
    oilbattery: {
        eyebrow: 'Oil & Battery Solutions',
        heading: 'Reliable Power. Superior Protection. **Consistent Performance.**',
        body1: 'We provide quality oil and battery solutions designed to support the performance, efficiency and reliability of vehicles, industrial machinery, generators and commercial equipment. From engine lubrication to dependable power storage, we help businesses find the right products for their operational requirements.',
        image: '',
        imageAlt: 'Engine oils and batteries',
        image2: '',
        image3: '',
        body2: '',
        body3: '',
        headingLine2: ''
    },
    reviews: {
        eyebrow: 'Customer Reviews',
        heading: 'What Our **Customers** Say',
        body1: 'See what our customers say about Zeemac Filters on Google.',
        tagline: '',
        headingLine2: '',
        body2: '',
        body3: ''
    },
    featured: {
        eyebrow: 'Popular Products',
        heading: 'Featured Filtration Products',
        body1: 'Discover our best-selling and most trusted filtration products from leading manufacturers.'
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
        eyebrow: 'Our Strength',
        heading: 'Why Choose **Zeemac**?',
        body1: 'We are committed to providing the best filtration solutions with quality products, expert support and on-time delivery.'
    },
    popup: {
        eyebrow: 'Special Offer:',
        heading: 'Enhance Your Equipment\u2019s Life!',
        body1: 'For a limited time, get **15% OFF** your first order of filters for any marine or industrial application. Discover the difference with Zeemac\u2019s genuine quality and reliable supply.',
        body2: '',
        image: '',
        imageAlt: 'Zeemac filters',
        tagline: 'Claim Your Discount',
        body3: '#contact',
        headingLine2: 'Browse New Products'
    },
    productfinder: {
        eyebrow: 'Looking for a Specific Filter?',
        heading: 'Can\u2019t find the product you\u2019re looking for?',
        body1: 'Send us the part number, brand, equipment model or filter details, and our team will help you identify the right product.'
    }
};