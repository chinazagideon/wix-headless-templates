'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface PreloaderContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  loadingProgress: number;
  setLoadingProgress: (progress: number) => void;
}

const PreloaderContext = createContext<PreloaderContextType | undefined>(
  undefined
);

export const usePreloader = () => {
  const context = useContext(PreloaderContext);
  if (!context) {
    throw new Error('usePreloader must be used within a PreloaderProvider');
  }
  return context;
};

interface PreloaderProviderProps {
  children: React.ReactNode;
}

export const PreloaderProvider: React.FC<PreloaderProviderProps> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Auto-hide after 3 seconds as fallback
    const fallbackTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(fallbackTimer);
  }, []);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const updateLoadingProgress = (progress: number) => {
    setLoadingProgress(Math.min(100, Math.max(0, progress)));
  };

  return (
    <PreloaderContext.Provider
      value={{
        isLoading,
        setLoading,
        loadingProgress,
        setLoadingProgress: updateLoadingProgress,
      }}
    >
      {children}
    </PreloaderContext.Provider>
  );
};
