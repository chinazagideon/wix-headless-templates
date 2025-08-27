import { createClient, ApiKeyStrategy } from '@wix/sdk';
import { posts } from '@wix/blog';

export const getWixAdminClient = () => {
  if (!process.env.WIX_API_KEY || !process.env.WIX_ACCOUNT_ID) {
    throw new Error('Missing WIX_API_KEY or WIX_ACCOUNT_ID');
  }
  return createClient({
    modules: { posts },
    auth: ApiKeyStrategy({
      apiKey: process.env.WIX_API_KEY!,
      accountId: process.env.WIX_ACCOUNT_ID!,
      siteId: process.env.WIX_SITE_ID,
    }),
  });
};


