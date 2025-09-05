import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

export async function queryPostsFunction() {
  try {
    const res = await fetch('/api/blog', { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.items ?? [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function queryPostsPaginated(page: number = 1, limit: number = 8) {
  const allItems: any[] = await queryPostsFunction();
  const safeLimit = Math.max(1, limit);
  const total = Array.isArray(allItems) ? allItems.length : 0;
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const startIndex = (currentPage - 1) * safeLimit;
  const endIndex = startIndex + safeLimit;
  const items = allItems.slice(startIndex, endIndex);

  return {
    items,
    page: currentPage,
    limit: safeLimit,
    total,
    totalPages,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
}

export function useBlogPosts() {
  return useQuery(['blogPosts'], queryPostsFunction, {
    staleTime: 5 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function usePaginatedPosts(initialPage: number = 1, limit: number = 8) {
  const [page, setPage] = useState<number>(initialPage);
  const {
    data: allItems = [],
    isLoading,
    isError,
    isFetching,
  } = useBlogPosts();

  const computed = useMemo(() => {
    const safeLimit = Math.max(1, limit);
    const total = Array.isArray(allItems) ? allItems.length : 0;
    const totalPages = Math.max(1, Math.ceil(total / safeLimit));
    const currentPage = Math.min(Math.max(page, 1), totalPages);
    const startIndex = (currentPage - 1) * safeLimit;
    const endIndex = startIndex + safeLimit;
    const items = (allItems as any[]).slice(startIndex, endIndex);
    return {
      items,
      page: currentPage,
      limit: safeLimit,
      total,
      totalPages,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1,
    };
  }, [allItems, page, limit]);

  const next = () => setPage((p) => Math.min(p + 1, computed.totalPages));
  const prev = () => setPage((p) => Math.max(p - 1, 1));

  return { ...computed, setPage, next, prev, isLoading, isError, isFetching };
}
