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

  console.log(`Seeded ${CATEGORIES.length} categories and ${BRANDS.length} brands.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
