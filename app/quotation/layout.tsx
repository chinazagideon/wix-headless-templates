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
    siteName: constants.companyName + ' - Get a Free Quote for Moving',
    type: 'website',
  },
};

export default function QuotationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
