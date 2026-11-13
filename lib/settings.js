import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { DEFAULT_SETTINGS } from '@/lib/settingsDefaults';

export const getSettings = cache(async () => {
  let row = null;
  try {
    row = await prisma.siteSetting.findUnique({ where: { id: 1 } });
  } catch {
    row = null;
  }

  const result = {};
  for (const key of Object.keys(DEFAULT_SETTINGS)) {
    const stored = row && typeof row[key] === 'string' ? row[key].trim() : '';
    result[key] = stored || DEFAULT_SETTINGS[key];
  }
  return result;
});
