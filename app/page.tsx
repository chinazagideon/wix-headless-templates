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
import { useServerAuthSession } from '@app/hooks/useServerAuthSession';
import { getServices } from '@app/model/service/service-api';
import { constants } from './components/constants';

export const revalidate = 300;

export const metadata = {
  title: `${constants.companyName} — Winnipeg's Trusted Moving Company`,
  description: `Flat hourly rates. Real crew. No hidden fees. ${constants.companyName} has been serving Winnipeg since ${constants.statYear}.`,
  openGraph: {
    title: `${constants.companyName} — Winnipeg's Trusted Moving Company`,
    description: `Flat hourly rates, no hidden fees. Winnipeg's most trusted moving crew since ${constants.statYear}.`,
    url: constants.companyWebsite,
    siteName: constants.companyName,
  },
};

export default async function HomePage() {
  const wixSession = useServerAuthSession();
  let services: Awaited<ReturnType<typeof getServices>>['services'] = [];
  try {
    const result = await getServices(wixSession);
    services = result.services;
  } catch {
    // Fall back to client-side fetch via the hook if server-side fails
  }

  return (
    <>
      <main>
        <Hero />
        <Stats />
        <QuoteForm />
        <About />
        <Services initialServices={services.length ? services : undefined} />
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
