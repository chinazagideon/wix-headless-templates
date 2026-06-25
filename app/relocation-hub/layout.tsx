import type { Metadata } from 'next';
import { constants } from '@app/components/constants';

export const metadata: Metadata = {
  title: 'Relocation Hub | Moving Tips & Guides | ICANDO Movers Winnipeg',
  description:
    "Moving tips, packing guides, and relocation stories from Winnipeg's trusted movers. Expert advice from ICANDO Movers & Transportation.",
  keywords: [
    'moving tips Winnipeg',
    'relocation guide Manitoba',
    'packing tips movers',
    'local moving advice Winnipeg',
    'ICANDO Movers blog',
  ],
  alternates: { canonical: '/relocation-hub' },
  openGraph: {
    title: 'Relocation Hub | Moving Tips & Guides | ICANDO Movers Winnipeg',
    description:
      "Expert moving tips, packing guides, and relocation stories from Winnipeg's most trusted moving crew.",
    url: '/relocation-hub',
    siteName: constants.companyName,
    type: 'website',
    images: [
      {
        url: '/custom/icando-move-truck.jpg',
        width: 1200,
        height: 630,
        alt: 'ICANDO Movers Relocation Hub',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Relocation Hub | Moving Tips & Guides | ICANDO Movers Winnipeg',
    description:
      "Expert moving tips, packing guides, and relocation stories from Winnipeg's most trusted moving crew.",
  },
};

export default function RelocationHubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
