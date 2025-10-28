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
    images: [
      {
        url: '/custom/icando-move-truck.jpg',
        width: 1200,
        height: 630,
        alt: 'ICANDO Movers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact ICANDO Movers',
    description:
      'Contact ICANDO Movers — Send us a message or call us for a free quote.',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
