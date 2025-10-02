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
 * POST /api/bookings/checkout
 * Creates a checkout redirect session for a booking
 */
export async function POST(request: NextRequest) {
  let bookingId: string | undefined;

  try {
    // Parse request body
    const body = await request.json();
    bookingId = body.bookingId;
    const totalAmount = body.totalAmount;
    const passedServiceId: string | undefined = body.serviceId;
    const passedStartDate: string | undefined = body.startDate; // ISO string
    const passedEndDate: string | undefined = body.endDate; // ISO string

    if (!bookingId) {
      const errorResponse = ApiErrorResponse.validationError(
        'Booking ID is required',
        [
          {
            field: 'bookingId',
            description: 'Booking ID is required to create checkout session',
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
        'Wix client could not be initialized. Please check your configuration.',
        { bookingId }
      );
      return NextResponse.json(errorResponse, { status: 500 });
    }

    // If client provided slot details alongside bookingId, use them directly to avoid
    // eventual consistency issues when querying ExtendedBookings.
    let serviceId: string | undefined = passedServiceId;
    let startDateIso: string | undefined = passedStartDate;
    let endDateIso: string | undefined = passedEndDate;

    if (!serviceId || !startDateIso || !endDateIso) {
      // Fallback: fetch booking details using queryExtendedBookings with extended backoff
      let bookingData;
      const retryDelays = [1500, 3000, 6000, 9000, 12000]; // total ~30s

      for (let i = 0; i < retryDelays.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, retryDelays[i]));

        const { extendedBookings } =
          await wixClient.bookings.queryExtendedBookings({
            filter: { _id: bookingId },
            paging: { limit: 1 },
          });

        bookingData = extendedBookings?.[0];

        if (bookingData?.booking) {
          console.log(
            `Booking found after ${retryDelays
              .slice(0, i + 1)
              .reduce((a, b) => a + b, 0)}ms`
          );
          break;
        }

        console.log(
          `Booking not found, retry ${i + 1}/${
            retryDelays.length
          } for bookingId: ${bookingId}`
        );
      }

      if (!bookingData?.booking) {
        const errorResponse = ApiErrorResponse.applicationError(
          'Booking not found',
          WIX_ERROR_CODES.NOT_FOUND,
          'The specified booking ID does not exist',
          { bookingId }
        );
        return NextResponse.json(errorResponse, { status: 404 });
      }

      const booking = bookingData.booking;
      serviceId = booking.bookedEntity?.slot?.serviceId;
      const startDate = booking.startDate as unknown as
        | Date
        | string
        | null
        | undefined;
      const endDate = booking.endDate as unknown as
        | Date
        | string
        | null
        | undefined;
      const toIso = (
        d: Date | string | null | undefined
      ): string | undefined => {
        if (!d) return undefined;
        if (typeof d === 'string') return d;
        if (d && typeof (d as any).toISOString === 'function') {
          return (d as any as Date).toISOString();
        }
        return undefined;
      };
      startDateIso = toIso(startDate);
      endDateIso = toIso(endDate);

      if (!serviceId || !startDateIso || !endDateIso) {
        const errorResponse = ApiErrorResponse.applicationError(
          'Invalid booking data',
          WIX_ERROR_CODES.INVALID_ARGUMENT,
          'Booking is missing required slot information',
          { bookingId, serviceId, startDate: startDateIso, endDate: endDateIso }
        );
        return NextResponse.json(errorResponse, { status: 400 });
      }
    }

    // Get base URL for callbacks
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    console.log('Creating checkout redirect session for booking:', {
      bookingId,
      serviceId,
      startDate: startDateIso,
      endDate: endDateIso,
      baseUrl,
    });

    // Create Wix booking redirect session for payment
    // Using the CORRECT approach per Wix documentation
    const redirectSession = await wixClient.redirects.createRedirectSession({
      bookingsCheckout: {
        slotAvailability: {
          slot: {
            serviceId: serviceId!,
            startDate: startDateIso!,
            endDate: endDateIso!,
          },
        },
      },
      callbacks: {
        postFlowUrl: `${baseUrl}/booking/success?bookingId=${bookingId}`,
        thankYouPageUrl: `${baseUrl}/booking/success?bookingId=${bookingId}`,
      },
    });

    if (!redirectSession?.redirectSession?._id) {
      const errorResponse = ApiErrorResponse.applicationError(
        'Failed to create redirect session',
        WIX_ERROR_CODES.INTERNAL,
        'Wix redirect session was not created successfully',
        { bookingId, redirectSession }
      );
      return NextResponse.json(errorResponse, { status: 500 });
    }

    // Get the redirect URL
    const checkoutUrl = redirectSession.redirectSession.fullUrl;

    if (!checkoutUrl) {
      const errorResponse = ApiErrorResponse.applicationError(
        'Failed to get checkout URL',
        WIX_ERROR_CODES.INTERNAL,
        'Checkout URL was not generated successfully',
        { bookingId, redirectSessionId: redirectSession.redirectSession._id }
      );
      return NextResponse.json(errorResponse, { status: 500 });
    }

    console.log('Checkout session created successfully:', {
      checkoutUrl,
      redirectSessionId: redirectSession.redirectSession._id,
      bookingId,
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: checkoutUrl,
      redirectSessionId: redirectSession.redirectSession._id,
      bookingId,
    });
  } catch (error: any) {
    console.error('Booking checkout API error:', error);

    // Handle Wix SDK errors according to standard format
    const wixError = WixErrorHandler.handleWixError(error);

    // Check for specific checkout-related errors
    if (error.code === 'BOOKING_NOT_FOUND') {
      const errorResponse = ApiErrorResponse.applicationError(
        'Booking not found',
        WIX_ERROR_CODES.NOT_FOUND,
        'The specified booking ID does not exist',
        { bookingId: bookingId }
      );
      return NextResponse.json(errorResponse, { status: 404 });
    }

    if (error.code === 'PAYMENT_FAILED') {
      const errorResponse = ApiErrorResponse.applicationError(
        'Payment processing failed',
        WIX_ERROR_CODES.PAYMENT_FAILED,
        'Unable to process payment for this booking',
        { bookingId: bookingId, originalError: error.message }
      );
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Return standardized error
    const errorResponse = ApiErrorResponse.systemError(
      wixError.message || 'An unexpected error occurred during checkout'
    );
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
