import type { Metadata } from 'next';
import { constants } from '@app/components/constants';

export const metadata: Metadata = {
  title: 'Book A Move — Moving experts with best rates',
  description: `Book a move with ${constants.companyName}. Get affordable rates for local and long-distance moves from ${constants.companyName}.`,
  alternates: { canonical: '/book' },
  openGraph: {
    title: 'Book A Move — Moving experts with best rates',
    description: `Affordable local and long-distance moving prices from ${constants.companyName}.`,
    url: '/book',
    siteName: constants.companyName,
    type: 'website',
  },
};

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
