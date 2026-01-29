import '@app/globals.css';
// import Footer from '@app/components/Layout/NavBarV2/Footer';
import { useServerAuthSession } from '@app/hooks/useServerAuthSession';
import PreloaderWrapper from '@app/components/Loader/PreloaderWrapper';
import { WixBookingsClientProvider } from '@app/components/Provider/WixBookingsClientProvider';
import React from 'react';
import type { Metadata } from 'next';
import { constants } from '@app/components/constants';
import StructuredData from '@app/components/SEO/StructuredData';
import CrispChat from './components/livechat/crisp-chat';

/**
 * Using force dynamic so changes in business assets (e.g. services) are immediately reflected.
 * If you prefer having it reflected only after redeploy (not recommended) please remove it
 * **/

export const revalidate = 0;

export const metadata: Metadata = {
  metadataBase: new URL(constants.companyWebsite),
  title: {
    default: 'ICANDO Movers —  Redefining the neighborhood moving services',
    template: '%s | ICANDO Movers',
  },
  description:
    'Affordable, reliable moving services in Winnipeg and across Manitoba.',
  keywords:
    'movers, moving services, Winnipeg movers, Manitoba moving, residential moving, commercial moving, packing services, storage, local movers',
  authors: [{ name: 'ICANDO Movers' }],
  creator: 'ICANDO Movers',
  publisher: 'ICANDO Movers',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/custom/favicon.png',
  },
  openGraph: {
    title: 'ICANDO Movers — Redefining the neighborhood moving services',
    description:
      'Affordable, reliable moving services in Winnipeg and across Manitoba.',
    url: '/',
    siteName: 'ICANDO Movers — Redefining the neighborhood moving services',
    type: 'website',
    locale: 'en_CA',
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
    title: 'ICANDO Movers',
    description:
      'Affordable, reliable moving services in Winnipeg and across Manitoba.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  verification: {
    // Uncomment and add your verification codes when ready:
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout(layoutProps: any) {
  const { children } = layoutProps;
  const wixSession = useServerAuthSession();

  return (
    <html lang="en">
      <head>
        <StructuredData />
        {/* Preload hero background video and poster for faster start */}
        <link rel="preload" as="image" href="/custom/icando-move-truck.jpg" />
        <link
          rel="preload"
          as="video"
          href="/custom/videos/icandomovers.mp4"
          type="video/mp4"
        />
        {/* Warm up DNS and connections for frequently used third-parties */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        <link rel="dns-prefetch" href="//nominatim.openstreetmap.org" />
        <link rel="preconnect" href="https://nominatim.openstreetmap.org" />
        <link rel="dns-prefetch" href="//maps.googleapis.com" />
        <link
          rel="preconnect"
          href="https://maps.googleapis.com"
          crossOrigin=""
        />
      </head>
      {wixSession.wixClient ? (
        <body
          className="parallax-background overflow-x-hidden w-full min-h-screen mobile-no-scroll"
          style={{ backgroundColor: '#F5F5F5' }}
        >
          <WixBookingsClientProvider>
            <PreloaderWrapper>{children}</PreloaderWrapper>
          </WixBookingsClientProvider>
          <CrispChat />
          {/* <Footer /> */}
        </body>
      ) : (
        <body className="">
          <main className="w-full bg-gray-c2 pt-32 px-4 sm:px-6 lg:px-8">
            <h1>
              Page not available. Please add an environment variable called
              NEXT_PUBLIC_WIX_CLIENT_ID, containing the client ID, to your
              deployment provider.
            </h1>
          </main>
        </body>
      )}
    </html>
  );
}
