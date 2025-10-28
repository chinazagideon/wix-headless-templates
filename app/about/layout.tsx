import type { Metadata } from 'next';
import { constants } from '@app/components/constants';

export const metadata: Metadata = {
  title: 'About ICANDO Movers',
  description:
    'Learn about ICANDO Movers — Winnipeg movers offering reliable local and long-distance moving, packing, and storage services.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About ICANDO Movers',
    description:
      'Winnipeg movers providing trusted local and long-distance moving, packing, and storage.',
    url: '/about',
    siteName: constants.companyName,
    type: 'website',
    images: [
      {
        url: '/custom/icando-move-truck.jpg',
        width: 1200,
        height: 630,
        alt: 'About ICANDO Movers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About ICANDO Movers',
    description:
      'Winnipeg movers providing trusted local and long-distance moving, packing, and storage.',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
