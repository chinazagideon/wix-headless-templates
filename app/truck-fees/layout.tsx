import type { Metadata } from 'next';
import { constants } from '@app/components/constants';
import routes from '@app/components/Layout/NavBarV2/routes';

export const metadata: Metadata = {
  title: 'Truck Fees — Winnipeg Moving Rates',
  description:
    'Transparent moving prices in Winnipeg. Get affordable rates for local and long-distance moves from ICANDO Movers.',
  alternates: { canonical: routes.pricing },
  openGraph: {
    title: 'Truck Fees — Winnipeg Moving Rates',
    description:
      'Affordable local and long-distance moving prices from ICANDO Movers.',
    url: routes.pricing,
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
    title: 'Truck Fees — Winnipeg Moving Rates',
    description: `Affordable local and long-distance moving prices from ${constants.companyName}.`,
  },
};

export default function TruckFeesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
