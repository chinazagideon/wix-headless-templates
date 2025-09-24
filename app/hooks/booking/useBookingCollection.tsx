'use client';
import { useQuery } from '@tanstack/react-query';
import { useClientAuthSession } from '@app/hooks/useClientAuthSession';

/**
 * useBookingCollection hook
 * @param {Object} params - The parameters for the hook
 * @param {string} params.collectionName - The name of the collection
 * @param {string | unknown[]} params.queryKey - The key for the query
 * @param {string} params.include - The include for the query
 * @param {number} params.limit - The limit for the query
 */
export function useBookingCollection<T = unknown>({
  collectionName,
  queryKey,
  include,
  limit = 1000,
}: {
  collectionName: string;
  queryKey?: string | unknown[];
  include?: string;
  limit?: number;
}) {
  const session = useClientAuthSession();
  const finalQueryKey = Array.isArray(queryKey)
    ? [...queryKey, collectionName]
    : [queryKey ?? 'collection-items', collectionName];

  return useQuery({
    queryKey: finalQueryKey,
    queryFn: async () => {
      const wixClient = session?.wixClient;
      if (!wixClient) throw new Error('Wix client not ready');
      const result = await wixClient.items
        .query(collectionName)
        .include(include ?? 'parentService')
        .limit(limit)
        .find();
      return (result.items as T[]) ?? [];
    },
    staleTime: 60_000,
    enabled: Boolean(session?.wixClient && collectionName),
  });
}
