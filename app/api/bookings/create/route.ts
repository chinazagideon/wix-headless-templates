import { NextRequest, NextResponse } from 'next/server';
import { BookingService } from '@app/model/bookings/booking-service';
import {
  mapFormDataToWixBooking,
  validateBookingData,
} from '@app/model/bookings/booking-mapper';
import { FormData } from '@app/hooks/booking/useBookingForm';
import {
  WixErrorHandler,
  WIX_ERROR_CODES,
  ApiErrorResponse,
} from '@app/model/errors/wix-error-handler';

export const fetchCache = 'force-no-store';
export const revalidate = 0;

/**
 * POST /api/bookings/create
 * Creates a new booking using Wix SDK
 */
export async function POST(request: NextRequest) {
  console.log('📝 Booking creation API called');
  try {
    // Parse request body
    const formData: FormData = await request.json();
    console.log('📝 Form data received:', {
      service_id: formData.service_id,
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email_e1ca,
      phone: formData.phone_9f17,
      moving_date: formData.moving_address_date_and_time,
      mover_count: formData.mover_count,
      selected_hours: formData.selected_hours,
      pickup_address: formData.pickup_address,
      destination_address: formData.destination_address,
      billing_address: formData.billing_address,
      billing_city: formData.billing_city,
      billing_zip: formData.billing_zip,
      billing_country: formData.billing_country,
    });

    // Validate the booking data
    const validation = validateBookingData(formData);
    console.log('📝 Validation result:', validation);
    if (!validation.isValid) {
      console.log('❌ Validation failed:', validation.errors);
      const fieldViolations = validation.errors.map((error) => ({
        field: error,
        description: `Validation failed for field: ${error}`,
        violatedRule: 'VALIDATION_ERROR',
        ruleName: 'VALIDATION_ERROR',
      }));

      const errorResponse = ApiErrorResponse.validationError(
        'Booking data validation failed',
        fieldViolations
      );
      console.log('📝 Returning validation error:', errorResponse);
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Map form data to Wix booking format
    const wixBookingData = mapFormDataToWixBooking(formData);

    // Create booking using the service
    const result = await BookingService.createBooking(wixBookingData);

    if (result.success) {
      return NextResponse.json({
        success: true,
        booking: result.booking,
        message: 'Booking created successfully',
      });
    } else {
      // result.error is already in Wix standard format from BookingService
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Booking creation API error:', error);

    // Handle Wix SDK errors according to standard format
    const wixError = WixErrorHandler.handleWixError(error);

    // Return standardized error
    const errorResponse = ApiErrorResponse.systemError(
      wixError.message || 'An unexpected error occurred during booking creation'
    );
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
