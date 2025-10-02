import { createClient, ApiKeyStrategy } from '@wix/sdk';
import { contacts } from '@wix/crm';
import { collections as dataCollections, items as dataItems } from '@wix/data';
import {
  availabilityCalendar,
  services,
  extendedBookings,
  bookings,
  availabilityTimeSlots,
} from '@wix/bookings';
import { siteProperties } from '@wix/business-tools';
import { checkout } from '@wix/ecom';
import { redirects } from '@wix/redirects';

/**
 * Wix client for server-side operations
 */
export const wixClient = createClient({
  modules: {
    contacts,
    collections: dataCollections,
    items: dataItems,
    availabilityCalendar,
    siteProperties,
    services,
    bookings: extendedBookings,
    bookingsActions: bookings,
    availabilityTimeSlots,
    checkout,
    redirects,
  },
  auth: ApiKeyStrategy({
    apiKey: process.env.WIX_API_KEY!,
    siteId: process.env.WIX_SITE_ID!,
    accountId: process.env.WIX_ACCOUNT_ID!,
  }),
});
