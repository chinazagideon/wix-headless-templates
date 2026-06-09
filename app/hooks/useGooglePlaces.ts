'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface PlacePrediction {
  placeId: string;
  mainText: string;
  secondaryText: string;
  fullText: string;
}

export interface ResolvedPlace {
  formatted_address: string;
  place_id: string;
  city: string;
  province: string;
  postal_code: string | null;
}

// Module-level singleton — the SDK loads once per page lifetime
let loadPromise: Promise<void> | null = null;

async function loadPlacesSdk(): Promise<void> {
  if (loadPromise) return loadPromise;
  loadPromise = (async () => {
    const { setOptions, importLibrary } = await import(
      '@googlemaps/js-api-loader'
    );
    setOptions({
      key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
      v: 'weekly',
      language: 'en',
      region: 'CA',
    });
    await importLibrary('places');
  })();
  return loadPromise;
}

function extractComponent(
  components: google.maps.GeocoderAddressComponent[],
  type: string,
  form: 'long_name' | 'short_name' = 'long_name'
): string {
  return components.find((c) => c.types.includes(type))?.[form] ?? '';
}

export function useGooglePlaces() {
  const [isReady, setIsReady] = useState(false);
  const sessionTokenRef =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const dummyDivRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    loadPlacesSdk()
      .then(() => setIsReady(true))
      .catch((err) => console.error('[useGooglePlaces] SDK load failed', err));
  }, []);

  const ensureToken = useCallback(() => {
    if (!sessionTokenRef.current) {
      sessionTokenRef.current =
        new google.maps.places.AutocompleteSessionToken();
    }
    return sessionTokenRef.current;
  }, []);

  const getPredictions = useCallback(
    (input: string): Promise<PlacePrediction[]> => {
      if (!isReady || input.trim().length < 3) return Promise.resolve([]);
      const token = ensureToken();
      return new Promise((resolve) => {
        new google.maps.places.AutocompleteService().getPlacePredictions(
          {
            input,
            sessionToken: token,
            componentRestrictions: { country: 'ca' },
            types: ['geocode'],
          },
          (predictions, status) => {
            if (
              status !== google.maps.places.PlacesServiceStatus.OK ||
              !predictions
            ) {
              resolve([]);
              return;
            }
            resolve(
              predictions.map((p) => ({
                placeId: p.place_id,
                mainText: p.structured_formatting.main_text,
                secondaryText: p.structured_formatting.secondary_text ?? '',
                fullText: p.description,
              }))
            );
          }
        );
      });
    },
    [isReady, ensureToken]
  );

  const resolvePlace = useCallback(
    (placeId: string): Promise<ResolvedPlace> => {
      if (!isReady) return Promise.reject(new Error('SDK not ready'));
      const token = sessionTokenRef.current;
      sessionTokenRef.current = null; // reset for next session

      if (!dummyDivRef.current)
        dummyDivRef.current = document.createElement('div');

      return new Promise((resolve, reject) => {
        new google.maps.places.PlacesService(dummyDivRef.current!).getDetails(
          {
            placeId,
            sessionToken: token ?? undefined,
            fields: ['address_components', 'formatted_address', 'place_id'],
          },
          (result, status) => {
            if (
              status !== google.maps.places.PlacesServiceStatus.OK ||
              !result
            ) {
              reject(new Error(`getDetails failed: ${status}`));
              return;
            }
            const comps = result.address_components ?? [];
            resolve({
              formatted_address: result.formatted_address ?? '',
              place_id: result.place_id ?? placeId,
              city:
                extractComponent(comps, 'locality') ||
                extractComponent(comps, 'sublocality'),
              province: extractComponent(
                comps,
                'administrative_area_level_1',
                'short_name'
              ),
              postal_code: extractComponent(comps, 'postal_code') || null,
            });
          }
        );
      });
    },
    [isReady]
  );

  return { isReady, getPredictions, resolvePlace };
}
