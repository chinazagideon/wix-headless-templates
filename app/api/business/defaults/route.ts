// app/api/business/defaults/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { wixClient } from '@app/server/wix';

export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET(_req: NextRequest) {
  try {
    const resp = await wixClient.siteProperties.getSiteProperties();
    const sp = resp?.properties as any;
    const business = {
      timeZone: sp?.business?.timeZone || sp?.timeZone || null,
      currency: sp?.regionalSettings?.currency || null,
      country: sp?.regionalSettings?.country || null,
      locale: sp?.regionalSettings?.language || null,
      raw: sp || resp,
    };
    return NextResponse.json({ success: true, business });
  } catch (e: any) {
    return NextResponse.json(
      {
        success: false,
        error: e?.message || 'Failed to fetch business defaults',
      },
      { status: 500 }
    );
  }
}
