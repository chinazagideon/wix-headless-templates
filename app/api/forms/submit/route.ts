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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formId, submissions: submissionValues, captchaToken } = body || {};

    if (!formId || !submissionValues) {
      return NextResponse.json(
        { error: 'Missing formId or submissions in body' },
        { status: 400 }
      );
    }

    // Prefer API key (elevated) over OAuth visitor tokens for Forms
    const apiKeyClient = buildApiKeyClient();
    const oauthClient = getServerWixClient({ cookieStore: request.cookies });
    const client = apiKeyClient ?? oauthClient;
    if (!client) {
      return NextResponse.json(
        { error: 'Wix client not configured (missing OAuth tokens or API key)' },
        { status: 500 }
      );
    }

    const result = await client.submissions.createSubmission(
      { formId, submissions: submissionValues },
      captchaToken ? { captchaToken } : undefined
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Failed to submit form', error);
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 });
  }
}


