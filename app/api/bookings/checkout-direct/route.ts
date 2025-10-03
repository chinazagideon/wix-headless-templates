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
 * POST /api/bookings/checkout-direct
 * Creates a direct checkout redirect following Wix tutorial pattern
 * This approach skips booking creation and goes directly to checkout
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body - expecting slotAvailability data
    const body = await request.json();
    const { slotAvailability, timezone = 'America/Winnipeg' } = body;

    if (!slotAvailability) {
      const errorResponse = ApiErrorResponse.validationError(
        'Slot availability is required',
        [
          {
            field: 'slotAvailability',
            description:
              'Slot availability data is required to create checkout redirect',
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
        { slotAvailability }
      );
      return NextResponse.json(errorResponse, { status: 500 });
    }

    console.log('🔄 Creating direct checkout redirect...', {
      serviceId: slotAvailability.slot?.serviceId,
      startDate: slotAvailability.slot?.startDate,
      endDate: slotAvailability.slot?.endDate,
      timezone,
    });

    // Get base URL for callbacks
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Create redirect session following Wix tutorial pattern exactly
    const redirectSession = await wixClient.redirects.createRedirectSession({
      bookingsCheckout: {
        slotAvailability,
        timezone,
      },
      callbacks: {
        postFlowUrl: `${baseUrl}/booking/success`,
        thankYouPageUrl: `${baseUrl}/booking/success`,
      },
    });

    if (!redirectSession?.redirectSession?.fullUrl) {
      const errorResponse = ApiErrorResponse.applicationError(
        'Failed to create redirect session',
        WIX_ERROR_CODES.INTERNAL,
        'Wix redirect session was not created successfully',
        { slotAvailability }
      );
      return NextResponse.json(errorResponse, { status: 500 });
    }

    console.log('✅ Direct checkout redirect created:', {
      redirectUrl: redirectSession.redirectSession.fullUrl,
      redirectSessionId: redirectSession.redirectSession._id,
    });

    return NextResponse.json({
      success: true,
      url: redirectSession.redirectSession.fullUrl,
      redirectSessionId: redirectSession.redirectSession._id,
    });
  } catch (error: any) {
    console.error('❌ Direct checkout redirect API error:', error);

    // Handle Wix SDK errors according to standard format
    const wixError = WixErrorHandler.handleWixError(error);

    // Return standardized error
    const errorResponse = ApiErrorResponse.systemError(
      wixError.message ||
        'An unexpected error occurred during checkout redirect creation'
    );
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
