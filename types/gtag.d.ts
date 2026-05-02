/** Google tag (gtag.js) — initialized in root layout. */
interface Window {
  dataLayer: unknown[];
  gtag?: (...args: unknown[]) => void;
}
