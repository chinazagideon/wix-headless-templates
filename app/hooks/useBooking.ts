import { getBrowserWixClient } from '@app/model/auth/wix-client.browser';

export async function queryBookingFunction() {
  try {
    const wixClient = getBrowserWixClient();
    if (!wixClient) return [];
    const { extendedBookings } = await wixClient.bookings.queryExtendedBookings(
      {
        paging: { limit: 50 },
      }
    );
    // console.log('bookings items', extendedBookings);
    return extendedBookings ?? [];
  } catch (error) {
    console.error(error);
    return [];
  }
}
