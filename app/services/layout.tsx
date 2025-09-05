import type { Metadata } from 'next';
import { constants } from '@app/components/constants';

export const metadata: Metadata = {
  title: 'Moving Services in Winnipeg',
  description:
    'Explore ICANDO Movers services: residential, commercial, packing, storage, and long-distance moving in Winnipeg & Manitoba.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Moving Services in Winnipeg',
    description:
      'Residential and commercial moving, packing, storage, and long-distance services by ICANDO Movers.',
    url: '/services',
    siteName: constants.companyName,
    type: 'website',
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
