// Picks the first lines of a product's free-text "specifications" that look like "Label: value",
// so cards can show two quick facts such as "Filtration: 10-25 micron".
export function getSpecHighlights(text, max = 2) {
  if (!text || typeof text !== 'string') return [];

  const result = [];
  const lines = text.split(/\r?\n/);

  for (const raw of lines) {
    if (result.length >= max) break;
    const line = raw.replace(/^[\s>*•\-–]+/, '').replace(/\*\*/g, '').trim();
    if (!line || line.startsWith('|') || line.startsWith('#')) continue;

    const colon = line.indexOf(':');
    if (colon <= 0) continue;

    const label = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim();
    if (!label || !value || label.length > 30) continue;

    result.push({ label, value });
  }

  return result;
}

// Splits the full specifications text into table rows ("Label: value") and loose notes (any other line)
export function getAllSpecs(text) {
  const rows = [];
  const notes = [];
  if (!text || typeof text !== 'string') return { rows, notes };

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/^[\s>*•\-–]+/, '').replace(/\*\*/g, '').trim();
    if (!line) continue;

    const colon = line.indexOf(':');
    const label = colon > 0 ? line.slice(0, colon).trim() : '';
    const value = colon > 0 ? line.slice(colon + 1).trim() : '';

    if (label && value && label.length <= 40) {
      rows.push({ label, value });
    } else {
      notes.push(line);
    }
  }

  return { rows, notes };
}
