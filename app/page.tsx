import Nav from './components/components.v2/Nav';
import Hero from './components/components.v2/Hero';
import Stats from './components/components.v2/Stats';
import QuoteForm from './components/components.v2/QuoteForm';
import About from './components/components.v2/About';
import Services from './components/components.v2/Services';
import Gallery from './components/components.v2/Gallery';
import Pricing from './components/components.v2/Pricing';
import Included from './components/components.v2/Included';
import Testimonials from './components/components.v2/Testimonials';
import FAQ from './components/components.v2/FAQ';
import DarkCTA from './components/components.v2/DarkCTA';
import HeroWidget from './components/Widget/HeroWdget';

/**
 * ICANDO Movers — Homepage
 *
 * Stack: Next.js 14+ (App Router) + Tailwind CSS
 *
 * Assets expected in /public/assets/:
 *   logo-full.png, favicon.png, icando-move-truck.jpg,
 *   moving-elevator.jpg, moving-bed-mirror.jpg, moving-package-icando.jpg,
 *   truck-move.jpg, truck-move-2.jpg, winnipeg.webp
 *
 * External dependencies:
 *   - next/image (built-in)
 *   - next/link  (built-in)
 *   - Google Fonts: Playfair Display + DM Sans
 *     → add to app/layout.tsx or globals.css
 *
 * GitHub source:
 *   https://github.com/chinazagideon/wix-headless-templates
 */

export const metadata = {
  title: "ICANDO Movers — Winnipeg's Trusted Moving Company",
  description:
    'Flat hourly rates. Real crew. No hidden fees. ICANDO Movers has been serving Winnipeg since 2016.',
  openGraph: {
    title: "ICANDO Movers — Winnipeg's Trusted Moving Company",
    description:
      "Flat hourly rates, no hidden fees. Winnipeg's most trusted moving crew since 2016.",
    url: 'https://icandomovers.ca',
    siteName: 'ICANDO Movers',
  },
};

export default function HomePage() {
  return (
    <>
      <main>
        <Hero />
        <Stats />
        <QuoteForm />
        <About />
        <Services />
        <Gallery />
        <Pricing />
        <Included />
        <Testimonials />
        <FAQ />
        {/* <DarkCTA /> */}
        <HeroWidget />
      </main>
    </>
  );
}
