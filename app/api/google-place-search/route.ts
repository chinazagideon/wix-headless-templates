import { NextResponse } from 'next/server';
import { Agent } from 'next/dist/compiled/undici';

const keepAliveAgent = new Agent({
  keepAliveTimeout: 10_000,
  keepAliveMaxTimeout: 15_000,
  connections: 10,
});

type TextSearchCandidate = {
  name?: string;
  formatted_address?: string;
  place_id?: string;
};

type TextSearchResponse = {
  results?: TextSearchCandidate[];
  status?: string;
  error_message?: string;
};

function buildTextSearchUrl(query: string, apiKey: string) {
  const url = new URL(
    'https://maps.googleapis.com/maps/api/place/textsearch/json'
  );
  url.searchParams.set('query', query);
  url.searchParams.set('key', apiKey);
  return url.toString();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!query) {
      return NextResponse.json(
        { error: 'Missing search query ?q=' },
        { status: 400 }
      );
    }

    if (!apiKey) {
      // Minimal mock to help UX during local dev
      const mock: TextSearchResponse = {
        results: [
          {
            name: 'Sample Business',
            formatted_address: '123 Demo St, Winnipeg, MB',
            place_id: 'MOCK_PLACE_ID_123',
          },
        ],
        status: 'OK',
      };
      return NextResponse.json(mock);
    }

    const url = buildTextSearchUrl(query, apiKey);
    const res = await fetch(url, {
      cache: 'no-store',
      // @ts-ignore
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

    const data: TextSearchResponse = await res.json();
    if (data.status && data.status !== 'OK') {
      return NextResponse.json(
        {
          error: `Google Places status: ${data.status}`,
          details: data.error_message,
        },
        { status: 502 }
      );
    }
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Google Place Search API error:', error);
    return NextResponse.json(
      { error: 'Unexpected error performing place search' },
      { status: 500 }
    );
  }
}
