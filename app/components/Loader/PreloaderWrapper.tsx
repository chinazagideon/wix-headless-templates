'use client';

import { useState, useEffect } from 'react';
import Preloader from './Preloader';
import Header from '../Layout/NavBarV2/Header';
import Footer from '../Layout/NavBarV2/Footer';

interface PreloaderWrapperProps {
  children: React.ReactNode;
}

const PreloaderWrapper = ({ children }: PreloaderWrapperProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hide preloader after animation completes
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000); // Total animation duration

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && <Preloader />}
      {!isLoading && <Header />}
      <main className="bg-transparent min-h-[600px]">{children}</main>
      {!isLoading && <Footer />}
    </>
  );
};

export default PreloaderWrapper;
