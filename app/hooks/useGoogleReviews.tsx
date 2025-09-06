import { useQuery } from '@tanstack/react-query';

export type GoogleReview = {
  authorAttribution: {
    displayName: string;
    photoUri: string;
    uri: string;
  };
  name?: string;
  profile_photo_url?: string;
  rating?: number;
  relativePublishTimeDescription?: string;
  text?: {
    text?: string;
    languageCode?: string;
  };
  publishTime?: string;
};

export type GoogleReviewsPayload = {
  rating?: number;
  userRatingCount?: number;
  reviews?: GoogleReview[];
  result?: {
    name?: string;
    rating?: number;
    user_ratings_total?: number;
    reviews?: GoogleReview[];
  };
  status?: string;
  error?: string;
  details?: string;
};

export type GoogleReviewsQuery =
  | string
  | {
      placeId?: string;
      phone?: string;
      q?: string;
      name?: string;
      address?: string;
      website?: string;
      lat?: number;
      lng?: number;
      radius?: number;
      keyword?: string;
      language?: string;
      region?: string;
    };

export async function fetchGoogleReviews(
  params?: GoogleReviewsQuery
): Promise<GoogleReviewsPayload> {
  const url = new URL('/api/google-reviews', window.location.origin);
  if (typeof params === 'string') {
    if (params) url.searchParams.set('placeId', params);
  } else if (params && typeof params === 'object') {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }
  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) {
    const text = await res.text();
    return {
      error: `Failed to fetch Google reviews: HTTP ${res.status}`,
      details: text,
    } as GoogleReviewsPayload;
  }
  return (await res.json()) as GoogleReviewsPayload;
}

export function useGoogleReviews(params?: GoogleReviewsQuery) {
  const queryResponse = useQuery(
    ['googleReviews', params],
    () => fetchGoogleReviews(params),
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 15 * 60 * 1000,
      refetchOnWindowFocus: false,

      // refetchOnMount: 'always',
      // keepPreviousData: true,
    }
  );

  return queryResponse;
}
