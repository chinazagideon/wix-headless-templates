import { NextResponse } from 'next/server';

type GooglePlaceReview = {
  author_name?: string;
  profile_photo_url?: string;
  rating?: number;
  relative_time_description?: string;
  text?: string;
};

type GooglePlaceDetailsResponse = {
  result?: {
    name?: string;
    rating?: number;
    user_ratings_total?: number;
    reviews?: GooglePlaceReview[];
  };
  status?: string;
  error_message?: string;
};

function buildPlaceDetailsUrl(placeId: string, apiKey: string) {
  const fields = ['name', 'rating', 'user_ratings_total', 'reviews'].join(',');
  const url = new URL(
    'https://maps.googleapis.com/maps/api/place/details/json'
  );
  url.searchParams.set('place_id', placeId);
  url.searchParams.set('fields', fields);
  url.searchParams.set('key', apiKey);
  return url.toString();
}

function buildFindPlaceUrlByPhone(phone: string, apiKey: string) {
  const url = new URL(
    'https://maps.googleapis.com/maps/api/place/findplacefromtext/json'
  );
  url.searchParams.set('input', phone);
  url.searchParams.set('inputtype', 'phonenumber');
  url.searchParams.set('fields', 'place_id');
  url.searchParams.set('key', apiKey);
  return url.toString();
}

function buildFindPlaceUrlByText(
  input: string,
  apiKey: string,
  params?: { language?: string; region?: string }
) {
  const url = new URL(
    'https://maps.googleapis.com/maps/api/place/findplacefromtext/json'
  );
  url.searchParams.set('input', input);
  url.searchParams.set('inputtype', 'textquery');
  url.searchParams.set('fields', 'place_id');
  if (params?.language) url.searchParams.set('language', params.language);
  if (params?.region) url.searchParams.set('region', params.region);
  url.searchParams.set('key', apiKey);
  return url.toString();
}

function buildTextSearchUrl(
  query: string,
  apiKey: string,
  params?: {
    lat?: number;
    lng?: number;
    radius?: number;
    language?: string;
    region?: string;
  }
) {
  const url = new URL(
    'https://maps.googleapis.com/maps/api/place/textsearch/json'
  );
  url.searchParams.set('query', query);
  if (params?.lat !== undefined && params?.lng !== undefined) {
    url.searchParams.set('location', `${params.lat},${params.lng}`);
  }
  if (params?.radius !== undefined)
    url.searchParams.set('radius', String(params.radius));
  if (params?.language) url.searchParams.set('language', params.language);
  if (params?.region) url.searchParams.set('region', params.region);
  url.searchParams.set('key', apiKey);
  return url.toString();
}

function buildNearbySearchUrl(params: {
  lat: number;
  lng: number;
  radius?: number;
  keyword?: string;
  name?: string;
  language?: string;
}) {
  const url = new URL(
    'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
  );
  url.searchParams.set('location', `${params.lat},${params.lng}`);
  url.searchParams.set('radius', String(params.radius ?? 1500));
  if (params.keyword) url.searchParams.set('keyword', params.keyword);
  if (params.name) url.searchParams.set('name', params.name);
  if (params.language) url.searchParams.set('language', params.language);
  return url;
}

async function resolvePlaceId(args: {
  apiKey: string;
  placeId?: string | null;
  phone?: string | null;
  q?: string | null;
  name?: string | null;
  address?: string | null;
  website?: string | null;
  lat?: number | null;
  lng?: number | null;
  radius?: number | null;
  keyword?: string | null;
  language?: string | null;
  region?: string | null;
}): Promise<{ placeId?: string; tried: string[] }> {
  const tried: string[] = [];
  const { apiKey } = args;

  // 1) If provided directly
  if (args.placeId) {
    return { placeId: args.placeId, tried: ['provided:placeId'] };
  }

  // 2) Phone number lookup (most precise)
  if (args.phone) {
    tried.push('findplace:phonenumber');
    const url = buildFindPlaceUrlByPhone(args.phone, apiKey);
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();
    if (data?.candidates?.length)
      return { placeId: data.candidates[0].place_id, tried };
  }

  // 3) Text query: explicit q or name+address
  const textQuery =
    args.q || [args.name, args.address].filter(Boolean).join(' ');
  if (textQuery) {
    tried.push('findplace:textquery');
    const url = buildFindPlaceUrlByText(textQuery, apiKey, {
      language: args.language ?? undefined,
      region: args.region ?? undefined,
    });
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();
    if (data?.candidates?.length)
      return { placeId: data.candidates[0].place_id, tried };

    // fallback to textsearch (allows location bias)
    tried.push('textsearch');
    const url2 = buildTextSearchUrl(textQuery, apiKey, {
      lat: args.lat ?? undefined,
      lng: args.lng ?? undefined,
      radius: args.radius ?? undefined,
      language: args.language ?? undefined,
      region: args.region ?? undefined,
    });
    const res2 = await fetch(url2, { cache: 'no-store' });
    const data2 = await res2.json();
    if (data2?.results?.length)
      return { placeId: data2.results[0].place_id, tried };
  }

  // 4) Website as textquery
  if (args.website) {
    tried.push('findplace:website-textquery');
    const url = buildFindPlaceUrlByText(args.website, apiKey, {
      language: args.language ?? undefined,
      region: args.region ?? undefined,
    });
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();
    if (data?.candidates?.length)
      return { placeId: data.candidates[0].place_id, tried };
  }

  // 5) Nearby search using lat/lng and keyword/name
  if (
    args.lat !== null &&
    args.lat !== undefined &&
    args.lng !== null &&
    args.lng !== undefined &&
    (args.keyword || args.name)
  ) {
    tried.push('nearbysearch');
    const url = buildNearbySearchUrl({
      lat: args.lat,
      lng: args.lng,
      radius: args.radius ?? undefined,
      keyword: args.keyword ?? undefined,
      name: args.name ?? undefined,
      language: args.language ?? undefined,
    });
    url.searchParams.set('key', apiKey);
    const res = await fetch(url.toString(), { cache: 'no-store' });
    const data = await res.json();
    if (data?.results?.length)
      return { placeId: data.results[0].place_id, tried };
  }

  return { tried };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Missing API key. Provide GOOGLE_PLACES_API_KEY.' },
        { status: 400 }
      );
    }

    const providedPlaceId =
      searchParams.get('placeId') ||
      process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID ||
      '';
    const phone = searchParams.get('phone');
    const q = searchParams.get('q');
    const name = searchParams.get('name');
    const address = searchParams.get('address');
    const website = searchParams.get('website');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius');
    const keyword = searchParams.get('keyword');
    const language = searchParams.get('language');
    const region = searchParams.get('region');

    const resolved = await resolvePlaceId({
      apiKey,
      placeId: providedPlaceId || null,
      phone,
      q,
      name,
      address,
      website,
      lat: lat ? Number(lat) : null,
      lng: lng ? Number(lng) : null,
      radius: radius ? Number(radius) : null,
      keyword,
      language,
      region,
    });

    if (!resolved.placeId) {
      return NextResponse.json(
        {
          error: 'Unable to resolve Google Place ID from provided parameters',
          tried: resolved.tried,
        },
        { status: 400 }
      );
    }

    // Fetch details (reviews). If NOT_FOUND, attempt resolution again without relying on provided placeId
    const detailsUrl = buildPlaceDetailsUrl(resolved.placeId, apiKey);
    let res = await fetch(detailsUrl, { cache: 'no-store' });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `Google Places API error: HTTP ${res.status}`, details: text },
        { status: 502 }
      );
    }

    let data: GooglePlaceDetailsResponse = await res.json();
    if (data.status && data.status !== 'OK') {
      // If the provided placeId was stale and we had alternative params, retry resolution without placeId
      if (
        (data.status === 'NOT_FOUND' || data.status === 'INVALID_REQUEST') &&
        (phone || q || name || address || website || (lat && lng))
      ) {
        const retry = await resolvePlaceId({
          apiKey,
          placeId: null,
          phone,
          q,
          name,
          address,
          website,
          lat: lat ? Number(lat) : null,
          lng: lng ? Number(lng) : null,
          radius: radius ? Number(radius) : null,
          keyword,
          language,
          region,
        });
        if (retry.placeId && retry.placeId !== resolved.placeId) {
          const retryUrl = buildPlaceDetailsUrl(retry.placeId, apiKey);
          const res2 = await fetch(retryUrl, { cache: 'no-store' });
          if (res2.ok) {
            const data2: GooglePlaceDetailsResponse = await res2.json();
            if (!data2.status || data2.status === 'OK') {
              return NextResponse.json(data2);
            }
          }
        }
      }

      return NextResponse.json(
        {
          error: `Google Places API status: ${data.status}`,
          details: data.error_message,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Google Reviews API error:', error);
    return NextResponse.json(
      { error: 'Unexpected error fetching Google Reviews' },
      { status: 500 }
    );
  }
}
