import { NextResponse } from 'next/server';
import { Agent } from 'next/dist/compiled/undici';

const baseUrl = 'https://places.googleapis.com/v1/places:autocomplete';
const keepAliveAgent = new Agent({
  keepAliveTimeout: 10_000,
  keepAliveMaxTimeout: 15_000,
  connections: 10,
});
// Simple in-memory cache to avoid repeated Details lookups per placeId
const countryCache = new Map<string, boolean>();
type GoogleSuggestion = {
  placePrediction: {
    place: string;
    placeId: string;
    structuredFormat: {
      mainText: {
        text: string;
        matches: { endOffset: number; startOffset: number }[];
      };
      subText?: {
        text: string;
        matches: { endOffset: number; startOffset: number }[];
      };
    };
    text: {
      text: string;
      matches: { endOffset: number; startOffset: number }[];
    };
    types: string[];
  };
};

export type GoogleAutocompleteResponse = {
  suggestions: GoogleSuggestion[];
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const region = 'CA';
    const apiKey = process.env.GOOGLE_PLACES_API_KEY || '';
    const res = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        // Only fields we need from autocomplete
        'X-Goog-FieldMask':
          'suggestions.placePrediction.placeId,suggestions.placePrediction.text.text,suggestions.placePrediction.structuredFormat',
      },
      body: JSON.stringify({
        input: query,
        regionCode: region,
        languageCode: 'en',
        // Restrict strictly to Canada's bounding rectangle
        locationRestriction: {
          rectangle: {
            low: { latitude: 41.6765556, longitude: -141.0 },
            high: { latitude: 83.3362128, longitude: -52.6207616 },
          },
        },
      }),
      cache: 'no-store',
      // @ts-ignore: undici agent supported in Node 18+ runtime
      dispatcher: keepAliveAgent,
    });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        {
          error: `Google Places Text Search error: HTTP ${res.status}`,
          details: text,
        },
        { status: 502 }
      );
    }

    const data: GoogleAutocompleteResponse = await res.json();
    const rawSuggestions = Array.isArray(data?.suggestions)
      ? data.suggestions
      : [];

    // 1) Fast textual filter (keeps Canadian-looking suggestions, drops obvious US)
    const provinceTokens = [
      'canada',
      'ontario',
      'manitoba',
      'saskatchewan',
      'alberta',
      'british columbia',
      'quebec',
      'nova scotia',
      'new brunswick',
      'newfoundland',
      'prince edward island',
      'pei',
      'northwest territories',
      'nunavut',
      'yukon',
    ];
    const textualMatches = rawSuggestions.filter((s) => {
      const t = s?.placePrediction?.text?.text?.toLowerCase?.() || '';
      if (!t) return false;
      // Exclude clear US indicators
      if (t.includes('usa') || t.includes('united states')) return false;
      return (
        provinceTokens.some((p) => t.includes(p)) ||
        /\b[A-Z][0-9][A-Z]\b/.test(s?.placePrediction?.text?.text || '')
      );
    });

    // If we have textual matches, return them immediately (low latency)
    if (textualMatches.length > 0) {
      return NextResponse.json(textualMatches);
    }

    // 2) Fallback: verify a few top suggestions via Places Details with short timeouts and caching
    const toCheck = rawSuggestions.slice(0, 3);
    const verified = await Promise.all(
      toCheck.map(async (s) => {
        const placeId = s?.placePrediction?.placeId;
        if (!placeId) return null;
        if (countryCache.has(placeId)) {
          return countryCache.get(placeId) ? s : null;
        }
        const detailsUrl = `https://places.googleapis.com/v1/places/${placeId}`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 900);
        try {
          const detailsRes = await fetch(
            `${detailsUrl}?fields=addressComponents`,
            {
              headers: {
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask':
                  'addressComponents.types,addressComponents.shortText,addressComponents.longText',
              },
              cache: 'no-store',
              // @ts-ignore
              dispatcher: keepAliveAgent,
              signal: controller.signal,
            }
          );
          if (!detailsRes.ok) return null;
          const details = await detailsRes.json();
          const comps: Array<{
            types?: string[];
            shortText?: string;
            longText?: string;
          }> = details?.addressComponents || [];
          const isCanada = comps.some(
            (c) =>
              (c.types || []).includes('country') &&
              (c.shortText === 'CA' || c.longText === 'Canada')
          );
          countryCache.set(placeId, isCanada);
          return isCanada ? s : null;
        } catch (_) {
          return null;
        } finally {
          clearTimeout(timeout);
        }
      })
    );
    const canadaOnly = verified.filter(Boolean);
    return NextResponse.json(canadaOnly);
  } catch (error: any) {
    console.error('Google Autocomplete API error:', error);
    return NextResponse.json(
      { error: 'Unexpected error performing autocomplete' },
      { status: 500 }
    );
  }
}
