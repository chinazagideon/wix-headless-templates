import type { Metadata } from 'next';
import { constants } from '@app/components/constants';

export const metadata: Metadata = {
  title: 'Pricing — Winnipeg Moving Rates',
  description:
    'Transparent moving prices in Winnipeg. Get affordable rates for local and long-distance moves from ICANDO Movers.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Pricing — Winnipeg Moving Rates',
    description:
      'Affordable local and long-distance moving prices from ICANDO Movers.',
    url: '/pricing',
    siteName: constants.companyName,
    type: 'website',
    images: [
      {
        url: '/custom/icando-move-truck.jpg',
        width: 1200,
        height: 630,
        alt: 'ICANDO Movers Pricing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing — Winnipeg Moving Rates',
    description:
      'Affordable local and long-distance moving prices from ICANDO Movers.',
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
