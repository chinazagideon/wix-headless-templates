import { wixClient } from '@app/server/wix';
import { WixBookingData } from './booking-mapper';
import {
  WixErrorHandler,
  WIX_ERROR_CODES,
} from '@app/model/errors/wix-error-handler';

/**
 * Booking Service
 * Handles all booking-related operations with Wix SDK
 */
export class BookingService {
  /**
   * Creates a booking using Wix SDK
   * @param bookingData - The booking data in Wix format
   * @returns Created booking information
   */
  static async createBooking(bookingData: WixBookingData) {
    try {
      // Get the service details to extract real schedule and resource IDs
      const service = await wixClient.services.getService(
        bookingData.serviceId
      );

      // Extract real IDs from the service
      const scheduleId = service.schedule?._id;
      const staffMemberId = service.staffMemberIds?.[0]; // Use first staff member as resource

      console.log('Using real Wix IDs:', {
        serviceId: bookingData.serviceId,
        scheduleId,
        staffMemberId,
        hasSchedule: !!scheduleId,
        hasStaffMember: !!staffMemberId,
      });

      // Check if the requested time slot is within the schedule constraints
      const requestedStart = new Date(bookingData.slot.startDate);
      const requestedEnd = new Date(bookingData.slot.endDate);

      console.log('Schedule constraints:', {
        firstSessionStart: service.schedule?.firstSessionStart,
        lastSessionEnd: service.schedule?.lastSessionEnd,
        sessionDurations:
          service.schedule?.availabilityConstraints?.sessionDurations,
        requestedStart: requestedStart.toISOString(),
        requestedEnd: requestedEnd.toISOString(),
        isWithinSchedule:
          requestedStart >=
            new Date(service.schedule?.firstSessionStart || 0) &&
          requestedEnd <= new Date(service.schedule?.lastSessionEnd || 0),
      });

      // Validate required IDs exist
      if (!scheduleId) {
        throw new Error(
          'Service schedule not configured. Please contact support.'
        );
      }

      if (!staffMemberId) {
        throw new Error('Service staff not assigned. Please contact support.');
      }

      // Get business timezone from environment or default to Toronto
      // Note: Schedule doesn't expose timezone in type, but it exists in Wix
      const businessTimezone =
        process.env.NEXT_PUBLIC_BUSINESS_TIMEZONE || 'America/Winnipeg';

      console.log('Creating booking with timezone:', {
        businessTimezone,
        requestedStart: bookingData.slot.startDate,
        requestedEnd: bookingData.slot.endDate,
      });

      // Ensure endDate matches service session duration when provided
      let startIso = bookingData.slot.startDate;
      let endIso = bookingData.slot.endDate;
      const sessionDurations =
        (service.schedule?.availabilityConstraints?.sessionDurations as
          | number[]
          | undefined) || [];
      if (sessionDurations.length > 0 && startIso) {
        const startMs = new Date(startIso).getTime();
        const endMs = endIso ? new Date(endIso).getTime() : NaN;
        const currentDurationMins = isNaN(endMs)
          ? NaN
          : Math.round((endMs - startMs) / 60000);
        const allowed = new Set(sessionDurations);
        const preferred = sessionDurations[0];
        if (
          !isNaN(startMs) &&
          (!allowed.has(currentDurationMins) || isNaN(currentDurationMins))
        ) {
          const adjusted = new Date(startMs + preferred * 60000);
          endIso = adjusted.toISOString();
          console.log('Adjusted endDate to match session duration:', {
            preferredMinutes: preferred,
            endIso,
          });
        }
      }

      // Create booking using the correct Wix SDK structure with real IDs
      const bookingPayload = {
        contactDetails: bookingData.participantDetails.contactDetails,
        bookedEntity: {
          slot: {
            serviceId: bookingData.serviceId,
            startDate: startIso,
            endDate: endIso,
            timezone: bookingData.slot.timezone || businessTimezone,
            location: {
              // Wix enum: UNDEFINED | OWNER_BUSINESS | OWNER_CUSTOM | CUSTOM
              locationType: 'CUSTOM' as any,
            },
            resource: {
              id: bookingData.slot.resourceId || staffMemberId,
              scheduleId: scheduleId,
            },
            scheduleId: scheduleId,
          },
          title: bookingData.customFields.serviceType,
          tags: ['INDIVIDUAL'],
        },
        additionalFields: this.mapCustomFieldsToAdditionalFields(
          bookingData.customFields
        ),
        numberOfParticipants: 1,
        // Note: Status will be set by Wix based on flowControlSettings
        // Since business manually approves all bookings, we can be more lenient with validation
        // paymentStatus: 'NOT_PAID' as any,
        selectedPaymentOption: 'ONLINE' as const,
        flowControlSettings: {
          ignoreBookingWindow: true, // Allow bookings outside normal windows (manual approval handles this)
          skipAvailabilityValidation: true, // Skip strict availability check (manual approval handles conflicts)
          skipBusinessConfirmation: false, // KEEP: Require business approval - this is your main control!
          skipSelectedPaymentOptionValidation: true, // Validate payment option
          withRefund: false,
        },
      };

      console.log('Creating booking with payload:', bookingPayload);

      const newSessionBooking = await wixClient.bookingsActions.createBooking(
        bookingPayload
      );

      console.log('Success! Created a new booking:', newSessionBooking.booking);

      if (!newSessionBooking.booking) {
        throw new Error('Booking creation failed - no booking returned');
      }

      return {
        success: true,
        booking: {
          id: newSessionBooking.booking._id,
          serviceId: newSessionBooking.booking.bookedEntity?.slot?.serviceId,
          startDate: newSessionBooking.booking.startDate,
          endDate: newSessionBooking.booking.endDate,
          participantDetails: newSessionBooking.booking.contactDetails,
          customFields: this.mapAdditionalFieldsToCustomFields(
            newSessionBooking.booking.additionalFields || ([] as any)
          ),
          status: newSessionBooking.booking.status,
          paymentStatus: newSessionBooking.booking.paymentStatus,
          createdAt: newSessionBooking.booking._createdDate,
        },
      };
    } catch (error: any) {
      console.error('Booking creation failed:', error);

      // Handle Wix SDK errors according to standard format
      const wixError = WixErrorHandler.handleWixError(error);

      // Check for specific booking-related errors
      if (error.code === 'BOOKING_NOT_AVAILABLE') {
        return {
          success: false,
          error: WixErrorHandler.createBookingError(
            WIX_ERROR_CODES.BOOKING_NOT_AVAILABLE,
            'The selected time slot is no longer available',
            { requestedSlot: bookingData.slot }
          ),
        };
      }

      if (error.code === 'BOOKING_CONFLICT') {
        return {
          success: false,
          error: WixErrorHandler.createBookingError(
            WIX_ERROR_CODES.BOOKING_CONFLICT,
            'A booking already exists for this time slot',
            { requestedSlot: bookingData.slot }
          ),
        };
      }

      if (error.code === 'SERVICE_UNAVAILABLE') {
        return {
          success: false,
          error: WixErrorHandler.createBookingError(
            WIX_ERROR_CODES.SERVICE_UNAVAILABLE,
            'The selected service is currently unavailable',
            { serviceId: bookingData.serviceId }
          ),
        };
      }

      // Return standardized error
      return {
        success: false,
        error: wixError,
      };
    }
  }

  /**
   * Maps custom fields to Wix additional fields format
   * @param customFields - The custom fields object
   * @returns Additional fields array for Wix
   */
  private static mapCustomFieldsToAdditionalFields(
    customFields: any
  ): Array<{ id: string; fieldName: string; value: string }> {
    const additionalFields: Array<{
      id: string;
      fieldName: string;
      value: string;
    }> = [];

    // Map each custom field to Wix additional field format
    Object.entries(customFields).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        additionalFields.push({
          id: this.generateGuid(), // Generate a GUID for each field
          fieldName: key,
          value:
            typeof value === 'object' ? JSON.stringify(value) : String(value),
        });
      }
    });

    return additionalFields;
  }

  /**
   * Generates a simple GUID for additional fields
   * @returns A GUID string
   */
  private static generateGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  /**
   * Maps Wix additional fields back to custom fields format
   * @param additionalFields - The additional fields array from Wix
   * @returns Custom fields object
   */
  private static mapAdditionalFieldsToCustomFields(
    additionalFields: any[]
  ): any {
    const customFields: any = {};

    additionalFields.forEach((field) => {
      if (
        field &&
        (field.fieldName || field.name) &&
        field.value !== undefined
      ) {
        const fieldName = field.fieldName || field.name;
        // Try to parse JSON values, fallback to string
        try {
          customFields[fieldName] = JSON.parse(field.value);
        } catch {
          customFields[fieldName] = field.value;
        }
      }
    });

    return customFields;
  }

  // Additional booking methods can be added here as needed
  // For now, we focus on the core createBooking functionality
}
