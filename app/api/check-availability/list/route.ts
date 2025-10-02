import { NextRequest, NextResponse } from 'next/server';
import { getServerWixClient } from '@app/model/auth/wix-client.server';

export const fetchCache = 'force-no-store';
export const revalidate = 0;

/**
 * POST /api/check-availability/list
 * Body: { serviceId, startLocal, endLocal, timeZone, locationType, resourceIds? }
 * startLocal/endLocal: 'YYYY-MM-DDThh:mm:ss' local in business timezone
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      serviceId,
      startLocal,
      endLocal,
      timeZone,
      locationType,
      resourceIds,
    } = body || {};

    if (!serviceId || !startLocal || !endLocal || !timeZone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const wix = getServerWixClient({ cookieStore: request.cookies });
    if (!wix) {
      return NextResponse.json(
        { success: false, error: 'Wix client not available' },
        { status: 500 }
      );
    }

    const location = { locationType: locationType || 'CUSTOM' } as any;

    const resp = await wix.availabilityTimeSlots.listAvailabilityTimeSlots({
      query: {
        filter: {
          serviceId,
          startDate: startLocal,
          endDate: endLocal,
          timeZone,
          location,
          resourceIds,
        } as any,
      },
    } as any);

    console.log('API list-availability response', JSON.stringify(resp));

    return NextResponse.json({ success: true, data: resp });
  } catch (err: any) {
    console.error('API list-availability error', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
