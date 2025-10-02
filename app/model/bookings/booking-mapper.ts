import { FormData } from '@app/hooks/booking/useBookingForm';

/**
 * Wix Booking Data Interface
 * Maps our form data to Wix booking creation format
 */
export interface WixBookingData {
  serviceId: string;
  slot: {
    startDate: string;
    endDate: string;
    resourceId?: string;
    timezone?: string;
    locationType?: 'CUSTOM' | 'OWNER_CUSTOM' | 'OWNER_BUSINESS' | 'UNDEFINED';
  };
  participantDetails: {
    contactDetails: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    };
  };
  customFields: {
    pickupAddress: string;
    destinationAddress: string;
    pickupBuildingType: string;
    destinationBuildingType: string;
    pickupHasElevator: string;
    destinationHasElevator: string;
    pickupStairsCount: number;
    destinationStairsCount: number;
    moverCount: number;
    selectedHours: number;
    serviceType: string;
    roomSize: string;
    specialItems: string;
    addons: string;
    additionalInfo?: string;
    billingAddress: string;
    billingCity: string;
    billingZip: string;
    billingCountry: string;
    distanceMiles?: number;
  };
}

/**
 * Business timezone - MUST match Wix Dashboard configuration
 * Canada has multiple timezones:
 * - America/Toronto (Eastern - EST/EDT)
 * - America/Vancouver (Pacific - PST/PDT)
 * - America/Edmonton (Mountain - MST/MDT)
 * - America/Halifax (Atlantic - AST/ADT)
 *
 * Set this to match your Wix Dashboard timezone setting!
 */
const BUSINESS_TIMEZONE =
  process.env.NEXT_PUBLIC_BUSINESS_TIMEZONE || 'America/Toronto';

/**
 * Maps form data to Wix booking format
 * @param formData - The booking form data
 * @returns Wix booking data format
 */
export function mapFormDataToWixBooking(formData: FormData): WixBookingData {
  // Parse the datetime string to get start and end times
  // IMPORTANT: Dates should already be in the correct timezone from the date picker
  const appointmentDateTime = new Date(formData.moving_address_date_and_time);
  const endDateTime = new Date(appointmentDateTime);
  endDateTime.setHours(
    endDateTime.getHours() + Math.max(2, formData.selected_hours)
  );

  console.log('🕐 Booking Time Mapping:', {
    inputDateTime: formData.moving_address_date_and_time,
    parsedStart: appointmentDateTime.toISOString(),
    parsedEnd: endDateTime.toISOString(),
    businessTimezone: BUSINESS_TIMEZONE,
    userTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  return {
    serviceId: formData.service_id,
    slot: {
      startDate: appointmentDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
      // Prefer resource from validated slot if present
      resourceId: (formData.selected_time_slot as any)?.slot?.resource?.id,
      timezone: (formData.selected_time_slot as any)?.slot?.timezone,
      locationType: 'CUSTOM',
    },
    participantDetails: {
      contactDetails: {
        firstName: formData.first_name,
        lastName: formData.last_name,
        email: formData.email_e1ca,
        phone: formData.phone_9f17,
      },
    },
    customFields: {
      pickupAddress: formData.pickup_address,
      destinationAddress: formData.destination_address,
      pickupBuildingType: formData.pickup_building_type,
      destinationBuildingType: formData.destination_building_type,
      pickupHasElevator: formData.has_elevator || 'No',
      destinationHasElevator: formData.destination_has_elevator || 'No',
      pickupStairsCount: formData.stairs_count || 0,
      destinationStairsCount: formData.destination_stairs_count || 0,
      moverCount: formData.mover_count,
      selectedHours: formData.selected_hours,
      serviceType: formData.service_type,
      roomSize: formData.pickup_room_size,
      specialItems: JSON.stringify(formData.special_items || {}),
      addons: JSON.stringify(formData.addons || []),
      additionalInfo: formData.additional_info,
      billingAddress: formData.billing_address,
      billingCity: formData.billing_city,
      billingZip: formData.billing_zip,
      billingCountry: formData.billing_country,
      distanceMiles: formData.distance_miles,
    },
  };
}

/**
 * Validates that all required fields are present for booking creation
 * @param formData - The booking form data
 * @returns Validation result with errors if any
 */
export function validateBookingData(formData: FormData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Required fields validation
  if (!formData.service_id) errors.push('Service ID is required');
  if (!formData.moving_address_date_and_time)
    errors.push('Appointment date and time is required');
  if (!formData.first_name) errors.push('First name is required');
  if (!formData.last_name) errors.push('Last name is required');
  if (!formData.email_e1ca) errors.push('Email is required');
  if (!formData.phone_9f17) errors.push('Phone number is required');
  if (!formData.pickup_address) errors.push('Pickup address is required');
  if (!formData.destination_address)
    errors.push('Destination address is required');
  if (!formData.billing_address) errors.push('Billing address is required');
  if (!formData.billing_city) errors.push('Billing city is required');
  if (!formData.billing_zip) errors.push('Billing ZIP is required');
  if (!formData.billing_country) errors.push('Billing country is required');

  // Validate appointment date is in the future
  if (formData.moving_address_date_and_time) {
    const appointmentDate = new Date(formData.moving_address_date_and_time);
    const now = new Date();
    console.log('Date validation:', {
      appointmentDate: appointmentDate.toISOString(),
      now: now.toISOString(),
      isFuture: appointmentDate > now,
      timeDiff: appointmentDate.getTime() - now.getTime(),
    });

    if (appointmentDate <= now) {
      errors.push('Appointment date must be in the future');
    }
  }

  // Validate mover count
  if (formData.mover_count < 1 || formData.mover_count > 10) {
    errors.push('Mover count must be between 1 and 10');
  }

  // Validate selected hours
  if (formData.selected_hours < 1 || formData.selected_hours > 24) {
    errors.push('Selected hours must be between 1 and 24');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
