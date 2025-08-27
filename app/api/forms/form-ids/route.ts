import { NextRequest, NextResponse } from 'next/server';
import { getServerWixClient } from '@app/model/auth/wix-client.server';
import { createClient, ApiKeyStrategy } from '@wix/sdk';
import { submissions } from '@wix/forms';

export const fetchCache = 'force-no-store';
export const revalidate = 0;

const buildApiKeyClient = () => {
  if (!process.env.WIX_API_KEY || !process.env.WIX_ACCOUNT_ID) return null;
  return createClient({
    modules: { submissions },
    auth: ApiKeyStrategy({
      apiKey: process.env.WIX_API_KEY!,
      accountId: process.env.WIX_ACCOUNT_ID!,
      siteId: process.env.WIX_SITE_ID,
    }),
  });
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const namespace = searchParams.get('namespace') || undefined;

    if (!namespace) {
      return NextResponse.json(
        { error: 'Missing required query param: namespace' },
        { status: 400 }
      );
    }

    // Prefer API key (elevated) but fall back to OAuth client if needed
    const apiKeyClient = buildApiKeyClient();
    const oauthClient = getServerWixClient({ cookieStore: request.cookies });

    if (!apiKeyClient && !oauthClient) {
      return NextResponse.json(
        {
          error: 'Wix client not configured (missing OAuth tokens or API key)',
        },
        { status: 500 }
      );
    }

    // The API requires an explicit namespace filter on the builder
    const runQuery = async (client: any) => {
      // @ts-ignore - typings may vary between SDK versions
      return client.submissions
        .querySubmissionsByNamespace()
        .eq('namespace', namespace)
        .find();
    };

    try {
      const primary = apiKeyClient ?? oauthClient;
      const { items = [] } = await runQuery(primary);
      const uniqueFormIds = Array.from(
        new Set(items.map((s: any) => s.formId).filter(Boolean))
      );
      return NextResponse.json({
        namespace,
        formIds: uniqueFormIds,
        count: uniqueFormIds.length,
      });
    } catch (err: any) {
      const status = err?.status || err?.response?.status;
      if (apiKeyClient && oauthClient && status === 403) {
        const { items = [] } = await runQuery(oauthClient);
        const uniqueFormIds = Array.from(
          new Set(items.map((s: any) => s.formId).filter(Boolean))
        );
        return NextResponse.json({
          namespace,
          formIds: uniqueFormIds,
          count: uniqueFormIds.length,
        });
      }
      throw err;
    }
  } catch (error: any) {
    const status = error?.status || error?.response?.status || 500;
    const details = error?.details ||
      error?.response?.data || { message: error?.message };
    console.error('Failed to query forms by namespace', error);
    return NextResponse.json(
      { error: 'Failed to query forms by namespace', details },
      { status }
    );
  }
}
