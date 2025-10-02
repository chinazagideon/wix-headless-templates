// app/hooks/useBusinessDefaults.ts
import { useEffect, useState } from 'react';

export interface BusinessDefaults {
  timeZone: string | null;
  currency: string | null;
  country: string | null;
  locale: string | null;
  raw?: any;
}

export const useBusinessDefaults = () => {
  const [data, setData] = useState<BusinessDefaults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/business/defaults', {
          cache: 'no-store',
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || 'Failed');
        setData(json.business);
      } catch (e: any) {
        setError(e?.message || 'Failed to load business defaults');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return { data, loading, error };
};
