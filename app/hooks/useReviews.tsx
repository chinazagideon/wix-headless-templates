import { getBrowserWixClient } from '@app/model/auth/wix-client.browser';

export async function queryReviewsFunction() {
  try {
    const wixClient = getBrowserWixClient();
    if (!wixClient) return [];
    const { items } = await wixClient.reviews.queryReviews().find();
    // console.log('reviews items', items);
    return items;
  } catch (error) {
    console.error(error);
    return [];
  }
}
