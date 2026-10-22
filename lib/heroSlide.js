function text(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

export function buildSlideData(body) {
  return {
    eyebrow: text(body.eyebrow),
    heading: typeof body.heading === 'string' ? body.heading.trim() : '',
    headingLine2: text(body.headingLine2),
    description: text(body.description),
    tagline: text(body.tagline),
    image: text(body.image),
    imageAlt: text(body.imageAlt),
    primaryButtonText: text(body.primaryButtonText),
    primaryButtonLink: text(body.primaryButtonLink),
    secondaryButtonText: text(body.secondaryButtonText),
    secondaryButtonLink: text(body.secondaryButtonLink),
    isActive: body.isActive !== false
  };
}

export function parseOrder(value) {
  if (value === '' || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}
