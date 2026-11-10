function text(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

// Only ordinary web links are kept, so a pasted "javascript:" link can never reach the website
function webUrl(value) {
  const v = text(value);
  return v && /^https?:\/\//i.test(v) ? v : null;
}

export function buildReviewData(body) {
  const ratingNumber = Math.trunc(Number(body.rating));
  const rating = Number.isFinite(ratingNumber) && ratingNumber >= 1 ? Math.min(5, ratingNumber) : 5;

  let reviewDate = null;
  if (typeof body.reviewDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.reviewDate)) {
    const parsed = new Date(`${body.reviewDate}T00:00:00.000Z`);
    if (!Number.isNaN(parsed.getTime())) reviewDate = parsed;
  }

  return {
    authorName: typeof body.authorName === 'string' ? body.authorName.trim() : '',
    authorPhoto: text(body.authorPhoto),
    rating,
    text: text(body.text),
    reviewDate,
    reviewUrl: webUrl(body.reviewUrl),
    isActive: body.isActive !== false
  };
}
