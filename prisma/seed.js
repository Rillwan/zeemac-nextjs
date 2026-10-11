const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function slugify(text) {
  return text.toString().trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const CATEGORIES = [
  { name: 'Marine Engine Filters', description: 'Filters designed to support the reliable operation of marine engines and equipment.' },
  { name: 'Oil Filters', description: 'Efficient filtration solutions for maintaining clean oil circulation and protecting engine components.' },
  { name: 'Fuel Filters', description: 'Solutions designed to remove contaminants and help maintain clean fuel delivery.' },
  { name: 'Air Filters', description: 'High-quality filtration for engines, machinery and air intake systems.' },
  { name: 'Hydraulic Filters', description: 'Filtration solutions for hydraulic systems and fluid-powered equipment.' },
  { name: 'Water & RO Filters', description: 'Filtration and membrane solutions for water treatment and reverse osmosis applications.' },
  { name: 'Compressor Filters', description: 'Filtration solutions for compressed-air systems and industrial compressors.' },
  { name: 'Industrial Filters', description: 'A broad range of filtration products for industrial and process applications.' }
];

const BRANDS = [
  'Volvo Penta', 'Framo', 'UFI/Sofima', 'Sullair', 'Fildac', 'Fleetguard',
  'Caterpillar', 'Donaldson', 'Mann', 'Parker', 'HYDAC', 'Racor',
  'Atlas Copco', 'Baldwin', 'Pall', 'Wartsila', 'Perkins', 'MP Filtri', 'STAUFF'
];

const HOMEPAGE_ITEMS = {
  categories: [
    { icon: 'Ship', title: 'Marine Engine Filters', description: 'Filters designed to support the reliable operation of marine engines and equipment.' },
    { icon: 'Droplet', title: 'Oil Filters', description: 'Efficient filtration solutions for maintaining clean oil circulation and protecting engine components.' },
    { icon: 'Fuel', title: 'Fuel Filters', description: 'Solutions designed to remove contaminants and help maintain clean fuel delivery.' },
    { icon: 'Wind', title: 'Air Filters', description: 'High-quality filtration for engines, machinery and air intake systems.' },
    { icon: 'Gauge', title: 'Hydraulic Filters', description: 'Filtration solutions for hydraulic systems and fluid-powered equipment.' },
    { icon: 'Waves', title: 'Water & RO Filters', description: 'Filtration and membrane solutions for water treatment and reverse osmosis applications.' },
    { icon: 'Fan', title: 'Compressor Filters', description: 'Filtration solutions for compressed-air systems and industrial compressors.' },
    { icon: 'Factory', title: 'Industrial Filters', description: 'A broad range of filtration products for industrial and process applications.' }
  ],
  industries: [
    { icon: 'Anchor', title: 'Marine & Offshore', description: 'Filtration solutions for marine engines, vessels and offshore equipment.' },
    { icon: 'HardHat', title: 'Construction & Heavy Equipment', description: 'Filters for construction machinery and heavy-duty equipment.' },
    { icon: 'Factory', title: 'Industrial Plants', description: 'Filtration solutions for industrial machinery and process systems.' },
    { icon: 'Zap', title: 'Power Generation', description: 'Products for power plants and power-generation equipment.' },
    { icon: 'Cog', title: 'Manufacturing', description: 'Filtration solutions supporting manufacturing and production equipment.' },
    { icon: 'Truck', title: 'Rental Equipment', description: 'Reliable replacement filters for rental and heavy equipment fleets.' }
  ],
  whychoose: [
    { icon: 'Layers', title: 'Wide Product Range', description: 'Access a comprehensive range of marine and industrial filtration products.' },
    { icon: 'Award', title: 'Multiple Brands', description: 'Products available from a broad selection of established filtration brands.' },
    { icon: 'Target', title: 'Application-Focused Solutions', description: 'We help customers identify products suited to their equipment and application.' },
    { icon: 'ShieldCheck', title: 'Quality & Reliability', description: 'Products selected to support demanding marine and industrial environments.' },
    { icon: 'MapPin', title: 'UAE-Based Support', description: 'Convenient access to filtration and marine industrial products in the UAE.' },
    { icon: 'MessageSquare', title: 'Request-Based Supply', description: 'Tell us your equipment, brand or filter requirement and our team can assist you.' }
  ]
};

async function main() {
  for (let i = 0; i < CATEGORIES.length; i++) {
    const c = CATEGORIES[i];
    const slug = slugify(c.name);
    await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name: c.name, slug, description: c.description, order: i }
    });
  }

  for (let i = 0; i < BRANDS.length; i++) {
    const name = BRANDS[i];
    const slug = slugify(name);
    await prisma.brand.upsert({
      where: { slug },
      update: {},
      create: { name, slug, order: i }
    });
  }

  for (const [section, items] of Object.entries(HOMEPAGE_ITEMS)) {
    const existingCount = await prisma.homepageItem.count({ where: { section } });
    if (existingCount === 0) {
      for (let i = 0; i < items.length; i++) {
        await prisma.homepageItem.create({ data: { section, order: i, ...items[i] } });
      }
    }
  }

  console.log(`Seeded ${CATEGORIES.length} categories, ${BRANDS.length} brands and homepage items.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });