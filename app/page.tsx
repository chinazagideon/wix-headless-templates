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
import HeroWidget from './components/Widget/HeroWdget';

/**
 * ICANDO Movers — Homepage
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
        <HeroWidget />
      </main>
    </>
  );
}
