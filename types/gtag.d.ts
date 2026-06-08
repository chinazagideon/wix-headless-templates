/** Google tag (gtag.js) — initialized in root layout. */
interface Window {
  dataLayer: unknown[];
  gtag?: (...args: unknown[]) => void;
  fbq?: (method: string, event: string, params?: Record<string, unknown>) => void;
}
