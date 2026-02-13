import { NextRequest, NextResponse } from 'next/server';
import { getServerWixClient } from '@app/model/auth/wix-client.server';
import { createClient, ApiKeyStrategy } from '@wix/sdk';
import { submissions } from '@wix/forms';

export const fetchCache = 'force-no-store';
export const revalidate = 0;

// Simple in-memory rate limiter per IP + path
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // per window
const rateLimitStore = new Map<
  string,
  { count: number; windowStart: number }
>();

function getClientIp(req: NextRequest) {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp;
  // As a last resort, fall back to the remote address on Node, if available
  // NextRequest does not reliably expose the socket IP across runtimes
  return 'unknown';
}

function isSameOrigin(req: NextRequest) {
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  const host = req.headers.get('host');
  if (!host) return false;
  const allowedOrigin = `https://${host}`;
  // allow http during local development
  const allowedOriginHttp = `http://${host}`;
  const okOrigin =
    !origin || origin === allowedOrigin || origin === allowedOriginHttp;
  const okReferer =
    !referer ||
    referer.startsWith(allowedOrigin) ||
    referer.startsWith(allowedOriginHttp);
  return okOrigin && okReferer;
}

async function verifyRecaptcha(token?: string | null) {
  const secret = process.env.RECAPTCHA_SECRET;
  if (!secret) return { ok: true, score: 1 };
  if (!token) return { ok: false, score: 0 };
  try {
    const params = new URLSearchParams();
    params.append('secret', secret);
    params.append('response', token);
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    const data = await res.json();
    // v2 does not include score, v3 does. Treat missing score as pass if success is true
    const score =
      typeof data.score === 'number' ? data.score : data.success ? 1 : 0;
    return { ok: !!data.success, score };
  } catch (e) {
    console.error('reCAPTCHA verify failed', e);
    return { ok: false, score: 0 };
  }
}

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
    // Enforce same-origin requests (basic CSRF mitigation for public form)
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Basic rate limiting per IP and route
    const ip = getClientIp(request);
    const key = `${ip}:forms-submit`;
    const now = Date.now();
    const entry = rateLimitStore.get(key);
    if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
      rateLimitStore.set(key, { count: 1, windowStart: now });
    } else {
      if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
        return NextResponse.json(
          { error: 'Too many requests' },
          { status: 429, headers: { 'retry-after': '60' } }
        );
      }
      entry.count += 1;
      rateLimitStore.set(key, entry);
    }

    const body = await request.json();
    const {
      formId,
      submissions: submissionValuesRaw,
      captchaToken,
      hp_field,
    } = body || {};

    if (!formId || !submissionValuesRaw) {
      return NextResponse.json(
        { error: 'Missing formId or submissions in body' },
        { status: 400 }
      );
    }

    // Honeypot: if filled, treat as bot
    if (typeof hp_field === 'string' && hp_field.trim().length > 0) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Optional reCAPTCHA verification (enabled if RECAPTCHA_SECRET is set)
    const recaptcha = await verifyRecaptcha(captchaToken);
    if (process.env.RECAPTCHA_SECRET && !recaptcha.ok) {
      return NextResponse.json(
        { error: 'Captcha verification failed' },
        { status: 400 }
      );
    }

    // Strip honeypot and any unknown fields server-side before forwarding
    const allowedKeys = new Set<string>([
      'first_name',
      'last_name',
      'email_e1ca',
      'phone_9f17',
      'service_type',
      'move_size_str',
      'moving_address',
      'unloading_address',
      'building_type_str',
      'special_items_str',
      'moving_date_and_time',
    ]);
    const submissionValues = Object.fromEntries(
      Object.entries(submissionValuesRaw).filter(([k]) => allowedKeys.has(k))
    );

    // Prefer API key (elevated) over OAuth visitor tokens for Forms
    const apiKeyClient = buildApiKeyClient();
    const oauthClient = getServerWixClient({ cookieStore: request.cookies });
    const client = apiKeyClient ?? oauthClient;
    if (!client) {
      return NextResponse.json(
        {
          error: 'Wix client not configured (missing OAuth tokens or API key)',
        },
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
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    );
  }
}
