/**
 * Dispatched on the window when the quote form submits successfully (Wix form API OK).
 * Listen with: window.addEventListener('quote-lead-complete', handler)
 */
export const QUOTE_LEAD_COMPLETE_EVENT = 'quote-lead-complete';

type QuoteLeadDetail = {
  source: 'quote-form';
  path: string;
};

function ensureGtagStub(): void {
  window.dataLayer = window.dataLayer ?? [];
  if (typeof window.gtag === 'function') return;
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
}

/**
 * Fires a custom window event (for GTM / other listeners) and the Google Ads
 * conversion event when `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_SEND_TO` is set
 * (format: AW-XXXXXXXXX/yyyyyyyy from Google Ads → Conversions → Tag setup).
 */
export function fireQuoteLeadConversion(): void {
  if (typeof window === 'undefined') return;

  const detail: QuoteLeadDetail = {
    source: 'quote-form',
    path: window.location.pathname,
  };

  window.dispatchEvent(new CustomEvent(QUOTE_LEAD_COMPLETE_EVENT, { detail }));

  const sendTo = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_SEND_TO?.trim();
  if (!sendTo) return;

  ensureGtagStub();
  window.gtag!('event', 'conversion', { send_to: sendTo });
}
