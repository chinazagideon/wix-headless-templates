'use client';

import { useState, useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Preloader from './Preloader';
import Nav from '../components.v2/Nav';
import Footer from '../components.v2/Footer';

interface PreloaderWrapperProps {
  children: React.ReactNode;
}

function PreloaderWrapperInner({ children }: PreloaderWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAdMode =
    pathname.startsWith('/quote') && Boolean(searchParams.get('utm_source'));

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        setShowContent(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 500);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* {isLoading && <Preloader />} */}
      {!isLoading && !isAdMode && <Nav />}
      <main
        className={`bg-transparent min-h-screen transition-all duration-1000 ease-out ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {children}
      </main>
      {!isLoading && !isAdMode && <Footer />}
    </>
  );
}

const PreloaderWrapper = ({ children }: PreloaderWrapperProps) => (
  <Suspense fallback={<>{children}</>}>
    <PreloaderWrapperInner>
      {children}
      </PreloaderWrapperInner>
  </Suspense>
);

export default PreloaderWrapper;
