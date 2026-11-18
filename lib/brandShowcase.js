// Shared helpers for the "Brands We Distribute" homepage section.
// Used by the admin API routes (validation) and the homepage (turning a database row into a slide).
// No database access here, so the client component can import it too.

export const SHOWCASE_AUTOPLAY_MS = 5000;

const HEX_COLOUR = /^#[0-9a-fA-F]{6}$/;
const MAX_HIGHLIGHTS = 3;

function text(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

// A link is either a path on this site ("/products?brand=lefong-filter") or a full http(s) address
function link(value) {
  const v = text(value);
  if (!v) return null;
  if (v.startsWith('/') && !v.startsWith('//')) return v;
  return /^https?:\/\//i.test(v) ? v : null;
}

function colour(value, fallback) {
  return typeof value === 'string' && HEX_COLOUR.test(value.trim()) ? value.trim() : fallback;
}

function cleanHighlights(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => ({
      value: typeof item?.value === 'string' ? item.value.trim() : '',
      label: typeof item?.label === 'string' ? item.label.trim() : ''
    }))
    .filter((item) => item.value && item.label)
    .slice(0, MAX_HIGHLIGHTS);
}

export function buildShowcaseData(body) {
  return {
    name: typeof body.name === 'string' ? body.name.trim() : '',
    logo: text(body.logo),
    image: text(body.image) || '',
    imageAlt: text(body.imageAlt),
    badge: text(body.badge),
    tagline: text(body.tagline),
    title: typeof body.title === 'string' ? body.title.trim() : '',
    paragraphs: text(body.paragraphs),
    highlights: JSON.stringify(cleanHighlights(body.highlights)),
    accent: colour(body.accent, '#1E63D6'),
    tint: colour(body.tint, '#EAF3FE'),
    productsLink: link(body.productsLink),
    quoteLink: link(body.quoteLink),
    isActive: body.isActive !== false
  };
}

export function validateShowcase(data) {
  if (!data.name) return 'Brand name is required (it is the tab label).';
  if (!data.title) return 'Title is required (the large heading of the slide).';
  if (!data.image) return 'Upload the product picture shown on the right of the slide.';
  return null;
}

// "500+" -> counts up to 500 and keeps the "+"; "OEM Grade" or "17-130 sec" -> shown as plain text
function parseHighlight(item) {
  const raw = String(item.value).trim();
  const match = /^([^\d]*)(\d[\d,]*)([^\d]*)$/.exec(raw);
  if (match) {
    const n = Number(match[2].replace(/,/g, ''));
    if (Number.isFinite(n)) {
      return { value: n, prefix: match[1], suffix: match[3], label: item.label };
    }
  }
  return { text: raw, label: item.label };
}

export function parseHighlights(raw) {
  let list;
  try {
    list = JSON.parse(raw || '[]');
  } catch {
    return [];
  }
  return cleanHighlights(list).map(parseHighlight);
}

export function parseParagraphs(raw) {
  if (!raw) return [];
  return raw
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

// Database row -> the shape BrandShowcase.jsx renders
export function toSlide(row) {
  return {
    id: String(row.id),
    name: row.name,
    logo: row.logo || '',
    image: row.image,
    imageAlt: row.imageAlt || `${row.name} products`,
    badge: row.badge || '',
    tagline: row.tagline || '',
    title: row.title,
    paragraphs: parseParagraphs(row.paragraphs),
    highlights: parseHighlights(row.highlights),
    accent: row.accent || '#1E63D6',
    tint: row.tint || '#EAF3FE',
    productsLink: row.productsLink || '/products',
    quoteLink: row.quoteLink || '/contact'
  };
}
