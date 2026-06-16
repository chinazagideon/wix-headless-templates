'use client';

import { Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Nav from '../components.v2/Nav';
import Footer from '../components.v2/Footer';

interface PreloaderWrapperProps {
  children: React.ReactNode;
}

function PreloaderWrapperInner({ children }: PreloaderWrapperProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAdMode =
    pathname.startsWith('/quote') && Boolean(searchParams.get('utm_source'));

  return (
    <>
      {!isAdMode && <Nav />}
      <main className="bg-transparent min-h-screen">{children}</main>
      {!isAdMode && <Footer />}
    </>
  );
}

const PreloaderWrapper = ({ children }: PreloaderWrapperProps) => (
  <Suspense fallback={<>{children}</>}>
    <PreloaderWrapperInner>{children}</PreloaderWrapperInner>
  </Suspense>
);

export default PreloaderWrapper;
