'use client';

import { useMemo } from 'react';

export type UtmParams = {
  utm_source: string | null;
  campaign_id: string | null;
};

export function useUtmParams(): UtmParams {
  return useMemo(() => {
    if (typeof window === 'undefined') return { utm_source: null, campaign_id: null };
    const p = new URLSearchParams(window.location.search);
    return {
      utm_source: p.get('utm_source'),
      campaign_id: p.get('campaign_id'),
    };
  }, []);
}
