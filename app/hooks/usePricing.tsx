'use client';
import { useQuery } from '@tanstack/react-query';
import { useClientAuthSession } from '@app/hooks/useClientAuthSession';

export function usePriceListItems() {
  const session = useClientAuthSession();
  return useQuery(
    ['price-list-items'],
    async () => {
      if (!session?.wixClient) throw new Error('Wix client not ready');
      const result = await session.wixClient.items
        .query('PriceList')
        .limit(1000)
        .find();
      return result.items; // [{ _id, location, distanceKm, truckFee, priceListImage, effectiveDate, ... }]
    },
    { staleTime: 60_000, refetchOnWindowFocus: false }
  );
}
