import { createClient, OAuthStrategy } from '@wix/sdk';
import {
  availabilityCalendar,
  availabilityTimeSlots,
  services,
  extendedBookings,
  bookings,
} from '@wix/bookings';
import { posts } from '@wix/blog';
import { members } from '@wix/members';
import { plans, orders } from '@wix/pricing-plans';
import { reviews } from '@wix/reviews';
import { redirects } from '@wix/redirects';
import { checkout } from '@wix/ecom';
import { WIX_REFRESH_TOKEN } from '@app/model/auth/auth.const';
import { PHASE_PRODUCTION_BUILD } from 'next/constants';
import { submissions } from '@wix/forms';
import { collections as dataCollections, items as dataItems } from '@wix/data';

export type CookieStore = {
  get(name: string): string | undefined;
};
const getRefreshToken = (cookieStore: CookieStore) => {
  if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) return {};
  const raw = cookieStore.get(WIX_REFRESH_TOKEN);
  if (!raw) return {};
  // Prefer JSON format { value, expiresAt }. If raw string, wrap into expected shape.
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && 'value' in parsed)
      return parsed;
  } catch {}
  return { value: raw, expiresAt: 0 } as any;
};

/**
 * This might not be 100% efficient in the client (in case some of the Wix business modules are only used in the server),
 * For simplicity creating one implementation
 **/
export const getWixClient = ({ cookieStore }: { cookieStore: CookieStore }) =>
  process.env.NEXT_PUBLIC_WIX_CLIENT_ID
    ? createClient({
        modules: {
          availabilityCalendar,
          availabilityTimeSlots,
          redirects,
          services,
          posts,
          plans,
          orders,
          bookings: extendedBookings,
          bookingsActions: bookings,
          members,
          reviews,
          submissions,
          collections: dataCollections,
          items: dataItems,
          checkout,
        },
        auth: OAuthStrategy({
          clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
          tokens: {
            refreshToken: getRefreshToken(cookieStore),
            accessToken: { value: '', expiresAt: 0 },
          },
        }),
      })
    : null;

export type WixClientType = ReturnType<typeof getWixClient>;
