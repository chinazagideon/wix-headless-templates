// import { getAutocompleteSuggestions } from "@app/api/google-place-autocomplete/route";
import { useQuery } from '@tanstack/react-query';

const fetchGoogleAutocomplete = async (query: string) => {
  const url = new URL('api/google-autocomplete', window.location.origin);
  url.searchParams.set('q', query ?? '');
  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) {
    const text = await res.text();
    return {
      error: `Failed to fetch Google autocomplete: HTTP ${res.status}`,
      details: text,
    } as any;
  }
  return (await res.json()) as any;
};

export function useGoogleAutocomplete(params?: any) {
  const textQuery = typeof params === 'string' ? params ?? '' : params?.q ?? '';
  const enabled = (textQuery?.length ?? 0) >= 3;

  return useQuery(
    ['googleAutocomplete', textQuery],
    () => fetchGoogleAutocomplete(textQuery),
    {
      enabled,
      staleTime: 5 * 60 * 1000,
      cacheTime: 15 * 60 * 1000,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
}
