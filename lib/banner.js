function text(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

// A banner link is either a path on this site ("/brands/lefong-filter") or a full https/http address
function bannerLink(value) {
  const v = text(value);
  if (!v) return null;
  if (v.startsWith('/') && !v.startsWith('//')) return v;
  return /^https?:\/\//i.test(v) ? v : null;
}

export function buildBannerData(body) {
  return {
    title: typeof body.title === 'string' ? body.title.trim() : '',
    image: text(body.image) || '',
    mobileImage: text(body.mobileImage),
    alt: typeof body.alt === 'string' ? body.alt.trim() : '',
    link: bannerLink(body.link),
    isActive: body.isActive !== false
  };
}

export function validateBanner(data) {
  if (!data.title) return 'Give the banner a name (only you see it).';
  if (!data.image) return 'Upload the desktop banner picture.';
  if (!data.alt) return 'Write the alt text: describe what the banner says, for search engines and screen readers.';
  return null;
}
