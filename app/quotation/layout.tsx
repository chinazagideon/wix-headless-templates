import type { Metadata } from 'next';
import { constants } from '@app/components/constants';

export const metadata: Metadata = {
  title: 'Get a Free Quote for Moving',
  description:
    'Get a Free Quote for Moving — Send us a message or call us for a free quote.',
  alternates: { canonical: '/quotation' },
  openGraph: {
    title: 'Get a Free Quote for Moving',
    description:
      'Get a Free Quote for Moving — Send us a message or call us for a free quote.',
    url: '/quotation',
    siteName: constants.companyName,
    type: 'website',
    images: [
      {
        url: '/custom/icando-move-truck.jpg',
        width: 1200,
        height: 630,
        alt: 'Get a Free Quote from ICANDO Movers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Get a Free Quote for Moving',
    description:
      'Get a Free Quote for Moving — Send us a message or call us for a free quote.',
  },
};

export default function QuotationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
