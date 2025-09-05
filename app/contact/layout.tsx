import type { Metadata } from 'next';
import { constants } from '@app/components/constants';

export const metadata: Metadata = {
  title: 'Contact ICANDO Movers',
  description:
    'Contact ICANDO Movers — Send us a message or call us for a free quote.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact ICANDO Movers',
    description:
      'Contact ICANDO Movers — Send us a message or call us for a free quote.',
    url: '/contact',
    siteName: constants.companyName,
    type: 'website',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
