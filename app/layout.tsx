import '@app/globals.css';
// import Footer from '@app/components/Layout/NavBarV2/Footer';
import { useServerAuthSession } from '@app/hooks/useServerAuthSession';
import PreloaderWrapper from '@app/components/Loader/PreloaderWrapper';
import { WixBookingsClientProvider } from '@app/components/Provider/WixBookingsClientProvider';
import React from 'react';
import type { Metadata } from 'next';

/**
 * Using force dynamic so changes in business assets (e.g. services) are immediately reflected.
 * If you prefer having it reflected only after redeploy (not recommended) please remove it
 * **/

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'IcanMovers | Winnipeg most trusted Movers',
  description: 'IcanDo Movers  Winnipeg trusted Movers',
  icons: {
    icon: '/custom/favicon.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout(layoutProps: any) {
  const { children } = layoutProps;
  const wixSession = useServerAuthSession();

  return (
    <html lang="en">
      <head>
        {/* Preload hero background video and poster for faster start */}
        <link rel="preload" as="image" href="/custom/truck-move-2.jpg" />
        <link
          rel="preload"
          as="video"
          href="/custom/moving-video.mp4"
          type="video/mp4"
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
