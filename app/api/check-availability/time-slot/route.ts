import { NextRequest, NextResponse } from 'next/server';
import { getServerWixClient } from '@app/model/auth/wix-client.server';

export const fetchCache = 'force-no-store';
export const revalidate = 0;

/**
 * POST /api/check-availability/time-slot
 * Body: { serviceId, startLocal, endLocal, timeZone, locationType }
 * startLocal/endLocal: 'YYYY-MM-DDThh:mm:ss' in business timezone (no offset)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serviceId, startLocal, endLocal, timeZone, locationType } =
      body || {};

    if (!serviceId || !startLocal || !endLocal || !timeZone) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          details: { serviceId, startLocal, endLocal, timeZone },
        },
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

    const resp = await wix.availabilityTimeSlots.getAvailabilityTimeSlot(
      serviceId,
      startLocal,
      endLocal,
      timeZone,
      location,
      { numberOfParticipants: 1 } as any
    );

    // Log on server for debugging
    console.log('API time-slot response', JSON.stringify(resp));

    return NextResponse.json({ success: true, data: resp });
  } catch (err: any) {
    console.error('API time-slot error', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
