import { NextRequest, NextResponse } from 'next/server';
import {
  AUTH_LOGIN_CALLBACK_PARAM,
  AUTH_LOGIN_PATHNAME,
  PROMPT_QUERY_PARAM,
  REDIRECT_FROM_WIX_LOGIN_STATUS,
  WIX_REFRESH_TOKEN,
} from '@app/model/auth/auth.const';
import { getServerWixClient } from '@app/model/auth/wix-client.server';
import type { WixClientType } from '@app/model/auth/wix-client.base';

const setVisitorTokens = async ({
  wixClient,
  response,
}: {
  wixClient: WixClientType;
  request: NextRequest;
  response: NextResponse;
}) => {
  if (!wixClient) return;
  try {
    const tokens = await wixClient!.auth.generateVisitorTokens();
    const tokenValue = tokens.refreshToken?.value || '';
    response.cookies.set(WIX_REFRESH_TOKEN, tokenValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day to reduce stale risk
    });
  } catch (error) {
    // Fail open in middleware to avoid breaking local dev if network fails
    console.error('Failed to generate visitor tokens', error);
  }
};

export async function middleware(request: NextRequest) {
  const cookies = request.cookies;
  const requestHeaders = new Headers(request.headers);
  const requestUrl = request.url;
  requestHeaders.set('x-middleware-request-url', requestUrl);
  const res = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  const wixClient = getServerWixClient({
    cookieStore: request.cookies,
  });
  const isLoggedIn = wixClient?.auth.loggedIn();
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    // In production, refresh tokens when not logged in to avoid stale cookies.
    if (!isLoggedIn) {
      res.cookies.delete(WIX_REFRESH_TOKEN);
      await setVisitorTokens({ response: res, wixClient, request });
    }
  } else {
    // In development, avoid generating tokens on every request to prevent spam/fetch failures.
    if (!cookies.get(WIX_REFRESH_TOKEN) && !isLoggedIn) {
      await setVisitorTokens({ response: res, wixClient, request });
    }
  }
  const wixMemberLoggedIn = request.nextUrl.searchParams.get(
    REDIRECT_FROM_WIX_LOGIN_STATUS
  );
  if (wixMemberLoggedIn === 'false' && isLoggedIn) {
    cookies.delete(WIX_REFRESH_TOKEN);
    await setVisitorTokens({ response: res, wixClient, request });
  }
  if (
    wixMemberLoggedIn === 'true' ||
    (!isLoggedIn && request.nextUrl.pathname.startsWith('/account'))
  ) {
    const redirectUrl = new URL(AUTH_LOGIN_PATHNAME, requestUrl);
    const loginCallbackUrl = new URL(requestUrl);
    redirectUrl.searchParams.delete(REDIRECT_FROM_WIX_LOGIN_STATUS);
    loginCallbackUrl.searchParams.delete(REDIRECT_FROM_WIX_LOGIN_STATUS);
    redirectUrl.searchParams.set(
      AUTH_LOGIN_CALLBACK_PARAM,
      loginCallbackUrl.toString()
    );
    redirectUrl.searchParams.set(PROMPT_QUERY_PARAM, 'none');
    return NextResponse.redirect(redirectUrl);
  }
  return res;
}

export const config = {
  unstable_allowDynamic: [
    '**/node_modules/lodash/**',
    '**/node_modules/@wix/**',
  ],
};
