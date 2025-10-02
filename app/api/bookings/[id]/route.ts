import { NextRequest, NextResponse } from 'next/server';
import { getServerWixClient } from '@app/model/auth/wix-client.server';
import {
  WixErrorHandler,
  WIX_ERROR_CODES,
  ApiErrorResponse,
} from '@app/model/errors/wix-error-handler';

export const fetchCache = 'force-no-store';
export const revalidate = 0;

/**
 * GET /api/bookings/[id]
 * Fetches booking details by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;

    if (!bookingId) {
      const errorResponse = ApiErrorResponse.validationError(
        'Booking ID is required',
        [
          {
            field: 'bookingId',
            description: 'Booking ID parameter is required',
            violatedRule: 'REQUIRED_FIELD',
            ruleName: 'VALIDATION_ERROR',
          },
        ]
      );
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const wixClient = getServerWixClient({
      cookieStore: request.cookies,
    });

    if (!wixClient) {
      const errorResponse = ApiErrorResponse.applicationError(
        'Wix client not available',
        WIX_ERROR_CODES.UNAVAILABLE,
        'Wix client could not be initialized',
        { bookingId }
      );
      return NextResponse.json(errorResponse, { status: 500 });
    }

    // Fetch booking details
    const { extendedBookings } = await wixClient.bookings.queryExtendedBookings(
      {
        filter: { _id: bookingId },
        paging: { limit: 1 },
      }
    );

    const bookingData = extendedBookings?.[0];

    if (!bookingData?.booking) {
      const errorResponse = ApiErrorResponse.applicationError(
        'Booking not found',
        WIX_ERROR_CODES.NOT_FOUND,
        'The specified booking ID does not exist',
        { bookingId }
      );
      return NextResponse.json(errorResponse, { status: 404 });
    }

    // Return booking data
    return NextResponse.json({
      success: true,
      booking: {
        id: bookingData.booking._id,
        status: bookingData.booking.status,
        paymentStatus: bookingData.booking.paymentStatus,
        startDate: bookingData.booking.startDate,
        endDate: bookingData.booking.endDate,
        serviceId: bookingData.booking.bookedEntity?.slot?.serviceId,
        serviceName: bookingData.booking.bookedEntity?.title,
        contactDetails: bookingData.booking.contactDetails,
        additionalFields: bookingData.booking.additionalFields,
        createdDate: bookingData.booking._createdDate,
        updatedDate: bookingData.booking._updatedDate,
      },
    });
  } catch (error: any) {
    console.error('Fetch booking API error:', error);

    // Handle Wix SDK errors according to standard format
    const wixError = WixErrorHandler.handleWixError(error);

    // Return standardized error
    const errorResponse = ApiErrorResponse.systemError(
      wixError.message || 'An unexpected error occurred while fetching booking'
    );
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
