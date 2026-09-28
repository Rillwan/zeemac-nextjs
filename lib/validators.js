export function slugify(text) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidOtp(otp) {
  return typeof otp === 'string' && /^\d{6}$/.test(otp);
}

export function validateProductInput(data) {
  const errors = {};
  if (!data.name || !data.name.trim()) errors.name = 'Name is required';
  return { valid: Object.keys(errors).length === 0, errors };
}
