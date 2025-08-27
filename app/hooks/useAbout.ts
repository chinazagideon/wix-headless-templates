'use client';
import { useQuery } from '@tanstack/react-query';
import { useClientAuthSession } from '@app/hooks/useClientAuthSession';

export function useAboutUsItems() {
  const session = useClientAuthSession();
  return useQuery(
    ['about-us-items'],
    async () => {
      if (!session?.wixClient) throw new Error('Wix client not ready');
      const result = await session.wixClient.items
        .query('AboutUs')
        .limit(1000)
        .find();
      return result.items;
    },
    { staleTime: 60_000 }
  );
}
