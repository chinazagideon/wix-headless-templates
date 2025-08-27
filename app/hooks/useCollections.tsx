'use client';
import { useQuery } from '@tanstack/react-query';
import { useClientAuthSession } from '@app/hooks/useClientAuthSession';

type ListCollectionsParams = {
  limit?: number;
  offset?: number;
  fields?: string[];
};

export const useListCollections = (params?: ListCollectionsParams) => {
  const session = useClientAuthSession();
  return useQuery(
    ['collections', params],
    async () => {
      // Prefer server route for elevated permissions when available
      try {
        const url = new URL('/api/collections', window.location.origin);
        if (params?.limit) url.searchParams.set('limit', String(params.limit));
        if (params?.offset)
          url.searchParams.set('offset', String(params.offset));
        params?.fields?.forEach((f) => url.searchParams.append('fields', f));
        const res = await fetch(url.toString(), { cache: 'no-store' });
        if (res.ok) return res.json();
      } catch {}

      if (!session?.wixClient) throw new Error('Wix client is not initialized');
      const result = await session.wixClient.collections.listDataCollections({
        paging:
          params?.limit || params?.offset
            ? { limit: params?.limit, offset: params?.offset }
            : undefined,
        fields: params?.fields,
      });
      return result;
    },
    { staleTime: 60_000 }
  );
};

export const useGetCollection = (id?: string, fields?: string[]) => {
  const session = useClientAuthSession();
  return useQuery(
    ['collection', id, fields],
    async () => {
      if (!id) return null;
      try {
        const url = new URL('/api/collections', window.location.origin);
        url.searchParams.set('_id', id);
        fields?.forEach((f) => url.searchParams.append('fields', f));
        const res = await fetch(url.toString(), { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          return data?.collection ?? null;
        }
      } catch {}

      if (!session?.wixClient) throw new Error('Wix client is not initialized');
      return session.wixClient.collections.getDataCollection(id, { fields });
    },
    { enabled: Boolean(id), staleTime: 60_000 }
  );
};

export const useCollections = (params?: ListCollectionsParams) =>
  useListCollections(params);

export default useListCollections;
