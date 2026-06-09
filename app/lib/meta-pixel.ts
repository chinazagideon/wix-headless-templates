export const trackPixelEvent = (
  event: 'ViewContent' | 'Lead' | 'Contact',
  params?: Record<string, unknown>
): void => {
  if (typeof window === 'undefined') return;
  if (typeof window.fbq !== 'function') return;
  window.fbq('track', event, params);
};
