// Normalize phone to E.164. If no country code is provided and the number
// has 10 digits, default to +1 (US/Canada).
export const normalizePhoneE164 = (raw: string): string => {
  if (!raw) return raw;
  const digitsOnly = raw.replace(/\D+/g, '');
  if (raw.trim().startsWith('+')) {
    // Keep leading + and strip non-digits from the rest
    const rest = raw.trim().slice(1).replace(/\D+/g, '');
    return `+${rest}`;
  }
  if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
    return `+${digitsOnly}`;
  }
  if (digitsOnly.length === 10) {
    return `+1${digitsOnly}`;
  }
  // Fallback: if looks like an international number without +
  if (digitsOnly.length > 10) {
    return `+${digitsOnly}`;
  }
  return raw;
};
