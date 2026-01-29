'use client';

import { useEffect } from 'react';

export default function CrispChat() {
  useEffect(() => {
    // Set up Crisp
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = '51802407-ff6a-488c-8d46-e472f36f323e';

    // Load the Crisp script
    const script = document.createElement('script');
    script.src = 'https://client.crisp.chat/l.js';
    script.async = true;
    document.getElementsByTagName('head')[0].appendChild(script);

    // Cleanup function to remove script if component unmounts
    return () => {
      const existingScript = document.querySelector(
        'script[src="https://client.crisp.chat/l.js"]'
      );
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return null; // This component doesn't render anything
}

// TypeScript declaration for window.$crisp
declare global {
  interface Window {
    $crisp: any[];
    CRISP_WEBSITE_ID: string;
  }
}
