// Builds a WhatsApp chat link. The number comes from Admin > Site Settings (digits only, with country code).
export function whatsappUrl(number, text) {
  const digits = String(number || '').replace(/\D/g, '');
  const base = `https://wa.me/${digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function telHref(phone) {
  return `tel:${String(phone || '').replace(/[^\d+]/g, '')}`;
}

export const ENQUIRY_TOPICS = [
  { value: 'filters', label: 'Filters' },
  { value: 'oil-battery', label: 'Oil & Battery' },
  { value: 'marine', label: 'Marine Supplies' },
  { value: 'quote', label: 'Request a Quote' },
  { value: 'other', label: 'Something Else' }
];
