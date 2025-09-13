import type { Metadata } from 'next';
import { constants } from '@app/components/constants';

export const metadata: Metadata = {
  title: 'Relocation Hub',
  description: 'Read blog posts about our relocation stories',
  alternates: { canonical: '/relocation-hub' },
  openGraph: {
    title: 'Relocation Hub',
    description: 'Read blog posts about our relocation stories',
    url: '/relocation-hub',
    siteName: constants.companyName,
    type: 'website',
  },
};

export default function RelocationHubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
