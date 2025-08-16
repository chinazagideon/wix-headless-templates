import '@app/globals.css';
// import Footer from '@app/components/Layout/NavBarV2/Footer';
import { useServerAuthSession } from '@app/hooks/useServerAuthSession';
import PreloaderWrapper from '@app/components/Loader/PreloaderWrapper';
import React from 'react';

/**
 * Using force dynamic so changes in business assets (e.g. services) are immediately reflected.
 * If you prefer having it reflected only after redeploy (not recommended) please remove it
 * **/

export const revalidate = 0;

export default function RootLayout(layoutProps: any) {
  const { children } = layoutProps;
  const wixSession = useServerAuthSession();

  return (
    <html lang="en">
      <head>
        <title>IcanMovers | Winnipeg most trusted Movers</title>
        <meta
          name="description"
          content="IcanDo Movers  Winnipeg trusted Movers"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <link rel="icon" href="/custom/favicon.png" />
      </head>
      {wixSession.wixClient ? (
        <body
          className="parallax-background overflow-x-hidden w-full min-h-screen mobile-no-scroll"
          style={{ backgroundColor: '#F5F5F5' }}
        >
          <PreloaderWrapper>{children}</PreloaderWrapper>
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
