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
 * POST /api/bookings/checkout-url
 * Creates a checkout URL for a booking with retry logic for Wix system synchronization
 */
export async function POST(request: NextRequest) {
  let bookingId: string | undefined;

  try {
    // Parse request body
    const body = await request.json();
    bookingId = body.bookingId;

    if (!bookingId) {
      const errorResponse = ApiErrorResponse.validationError(
        'Booking ID is required',
        [
          {
            field: 'bookingId',
            description: 'Booking ID is required to create checkout URL',
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

    console.log('🔄 Starting checkout URL generation for booking:', bookingId);

    // Step 1: Wait for Wix system synchronization with retry logic
    const retryDelays = [1000, 2000, 3000, 5000]; // Total ~11s
    let bookingData: any = null;
    let checkoutId: string | null = null;
    let checkoutUrl: string | null = null;

    // Retry loop to wait for booking synchronization
    for (let i = 0; i < retryDelays.length; i++) {
      console.log(
        `⏳ Retry ${i + 1}/${retryDelays.length} - Waiting ${
          retryDelays[i]
        }ms for booking sync...`
      );

      // Wait before retry
      if (i > 0) {
        await new Promise((resolve) => setTimeout(resolve, retryDelays[i]));
      }

      try {
        // Query the booking to ensure it's synchronized
        const { extendedBookings } =
          await wixClient.bookings.queryExtendedBookings({
            filter: { _id: bookingId },
            paging: { limit: 1 },
          });

        bookingData = extendedBookings?.[0];

        if (bookingData?.booking) {
          console.log(
            `✅ Booking found after ${retryDelays
              .slice(0, i + 1)
              .reduce((a, b) => a + b, 0)}ms`
          );

          // Step 2: Create redirect session (following Wix tutorial approach)
          try {
            const booking = bookingData.booking;
            const serviceId = booking.bookedEntity?.slot?.serviceId;
            const startDate = booking.startDate;
            const endDate = booking.endDate;
            const timezone =
              booking.bookedEntity?.slot?.timezone || 'America/Winnipeg';

            if (!serviceId || !startDate || !endDate) {
              throw new Error('Booking is missing required slot information');
            }

            // Get base URL for callbacks
            const baseUrl =
              process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

            console.log('💳 Creating redirect session...', {
              bookingId,
              serviceId,
              startDate:
                startDate instanceof Date ? startDate.toISOString() : startDate,
              endDate:
                endDate instanceof Date ? endDate.toISOString() : endDate,
              timezone,
            });

            // Create Wix redirect session for bookings checkout (following Wix tutorial)
            const redirectSession =
              await wixClient.redirects.createRedirectSession({
                bookingsCheckout: {
                  slotAvailability: {
                    slot: {
                      serviceId: serviceId,
                      startDate:
                        startDate instanceof Date
                          ? startDate.toISOString()
                          : startDate,
                      endDate:
                        endDate instanceof Date
                          ? endDate.toISOString()
                          : endDate,
                      timezone: timezone,
                    },
                  },
                },
                callbacks: {
                  postFlowUrl: `${baseUrl}/booking/success?bookingId=${bookingId}`,
                  thankYouPageUrl: `${baseUrl}/booking/success?bookingId=${bookingId}`,
                },
              });

            if (redirectSession?.redirectSession?.fullUrl) {
              checkoutUrl = redirectSession.redirectSession.fullUrl;
              checkoutId = redirectSession.redirectSession._id || null;
              console.log('✅ Redirect session created:', checkoutId);
              console.log('✅ Checkout URL generated:', checkoutUrl);
              break; // Success! Exit retry loop
            } else {
              throw new Error('Redirect session was not created');
            }
          } catch (checkoutError: any) {
            console.error(
              '❌ Redirect session creation failed:',
              checkoutError
            );
            if (i === retryDelays.length - 1) {
              throw checkoutError; // Last retry, throw the error
            }
            continue; // Try again
          }
        } else {
          console.log(
            `❌ Booking not found, retry ${i + 1}/${retryDelays.length}`
          );
          if (i === retryDelays.length - 1) {
            throw new Error('Booking not found after all retries');
          }
        }
      } catch (queryError: any) {
        console.error(`❌ Query failed on retry ${i + 1}:`, queryError);
        if (i === retryDelays.length - 1) {
          throw queryError; // Last retry, throw the error
        }
        continue; // Try again
      }
    }

    if (!checkoutUrl) {
      const errorResponse = ApiErrorResponse.applicationError(
        'Failed to generate checkout URL',
        WIX_ERROR_CODES.INTERNAL,
        'Unable to create checkout URL after all retries',
        { bookingId, checkoutId }
      );
      return NextResponse.json(errorResponse, { status: 500 });
    }

    console.log('🎉 Checkout URL generation completed successfully:', {
      bookingId,
      checkoutId,
      checkoutUrl,
    });

    return NextResponse.json({
      success: true,
      url: checkoutUrl,
      checkoutId: checkoutId,
      bookingId: bookingId,
    });
  } catch (error: any) {
    console.error('❌ Checkout URL generation API error:', error);

    // Handle Wix SDK errors according to standard format
    const wixError = WixErrorHandler.handleWixError(error);

    // Check for specific checkout-related errors
    if (error.message?.includes('Booking not found')) {
      const errorResponse = ApiErrorResponse.applicationError(
        'Booking not found',
        WIX_ERROR_CODES.NOT_FOUND,
        'The specified booking ID does not exist or is not yet synchronized',
        { bookingId: bookingId }
      );
      return NextResponse.json(errorResponse, { status: 404 });
    }

    if (
      error.message?.includes('redirect') ||
      error.message?.includes('checkout')
    ) {
      const errorResponse = ApiErrorResponse.applicationError(
        'Redirect session creation failed',
        WIX_ERROR_CODES.PAYMENT_FAILED,
        'Unable to create redirect session for this booking',
        { bookingId: bookingId, originalError: error.message }
      );
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Return standardized error
    const errorResponse = ApiErrorResponse.systemError(
      wixError.message ||
        'An unexpected error occurred during checkout URL generation'
    );
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
