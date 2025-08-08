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
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Hide preloader after animation completes
    const timer = setTimeout(() => {
      setIsLoading(false);

      // Add a small delay before showing content with scroll animation
      setTimeout(() => {
        setShowContent(true);

        // Smooth scroll to top after content appears
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }, 500);
    }, 4000); // Total animation duration

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && <Preloader />}
      {!isLoading && <Header />}
      <main
        className={`bg-transparent min-h-[1000px] transition-all duration-1000 ease-out ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {children}
      </main>
      {!isLoading && <Footer />}
    </>
  );
};

export default PreloaderWrapper;
