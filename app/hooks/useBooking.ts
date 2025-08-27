import { getBrowserWixClient } from "@app/model/auth/wix-client.browser";

export async function queryBookingFunction() {
    try {
        const wixClient = getBrowserWixClient();
        if (!wixClient) return [];
        const { items } = await wixClient.bookings.queryBookings().find();
        console.log('bookings items', items);
        return items;
    } catch (error) {
        console.error(error);
        return [];
    }
}