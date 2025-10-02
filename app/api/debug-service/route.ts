import { NextRequest, NextResponse } from 'next/server';
import { wixClient } from '@app/server/wix';

export const fetchCache = 'force-no-store';
export const revalidate = 0;

/**
 * Debug endpoint to check service configuration
 * Usage: /api/debug-service?serviceId=YOUR_SERVICE_ID
 */
export async function GET(request: NextRequest) {
  try {
    const serviceId = request.nextUrl.searchParams.get('serviceId');

    if (!serviceId) {
      return NextResponse.json(
        { error: 'serviceId parameter required' },
        { status: 400 }
      );
    }

    // Get service details
    const service = await wixClient.services.getService(serviceId);

    // Check availability for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const endOfDay = new Date(tomorrow);
    endOfDay.setHours(23, 59, 59, 999);

    const availability = await wixClient.availabilityCalendar.queryAvailability(
      {
        filter: {
          serviceId,
          startDate: tomorrow.toISOString(),
          endDate: endOfDay.toISOString(),
          bookable: true,
        },
      }
    );

    return NextResponse.json({
      serviceId,
      serviceName: service.name,
      configuration: {
        hasSchedule: !!service.schedule?._id,
        scheduleId: service.schedule?._id,
        staffMembers: service.staffMemberIds || [],
        staffCount: service.staffMemberIds?.length || 0,
      },
      schedule: {
        firstSessionStart: service.schedule?.firstSessionStart,
        lastSessionEnd: service.schedule?.lastSessionEnd,
      },
      availabilityCheck: {
        date: tomorrow.toISOString().split('T')[0],
        totalSlots: availability.availabilityEntries?.length || 0,
        slots: availability.availabilityEntries?.slice(0, 3).map((e: any) => ({
          start: e.startDate,
          end: e.endDate,
          violations: e.bookingPolicyViolations,
        })),
      },
      diagnosis: {
        hasSchedule: !!service.schedule?._id,
        hasStaff: (service.staffMemberIds?.length || 0) > 0,
        // status not available on typed Service; omit from diagnostics
        isPublished: !!service.schedule?._id,
        slotsAvailable: (availability.availabilityEntries?.length || 0) > 0,
        issues: [
          !service.schedule?._id && 'Missing schedule configuration',
          !service.staffMemberIds?.length && 'No staff members assigned',
          // status not available on typed Service
          !availability.availabilityEntries?.length &&
            'No available time slots found',
        ].filter(Boolean),
      },
    });
  } catch (error: any) {
    console.error('Debug service error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to debug service',
        details: error.details || error,
      },
      { status: 500 }
    );
  }
}
