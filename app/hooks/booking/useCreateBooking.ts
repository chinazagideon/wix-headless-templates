import { useMutation } from '@tanstack/react-query';
import { FormData } from './useBookingForm';

/**
 * Response interface for booking creation
 */
export interface CreateBookingResponse {
  success: boolean;
  booking?: {
    id: string;
    serviceId: string;
    startDate: string;
    endDate: string;
    participantDetails: any;
    customFields: any;
    status: string;
  };
  error?: string;
  details?: any;
  message?: string;
}

/**
 * Hook for creating bookings
 * Handles the API call to create a booking using Wix SDK
 */
export const useCreateBooking = () => {
  return useMutation<CreateBookingResponse, Error, FormData>({
    mutationFn: async (formData: FormData) => {
      console.log('🚀 Sending booking request with data:', {
        service_id: formData.service_id,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email_e1ca,
        phone: formData.phone_9f17,
        moving_date: formData.moving_address_date_and_time,
        mover_count: formData.mover_count,
        selected_hours: formData.selected_hours,
      });

      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
          console.error('API Error Response:', errorData);

          // Log detailed validation errors if available
          if (errorData.details?.validationError?.fieldViolations) {
            console.error(
              'Validation Errors:',
              errorData.details.validationError.fieldViolations
            );
          }
        } catch (parseError) {
          console.error('❌ Failed to parse error response:', parseError);
          errorData = {
            error: `HTTP ${response.status}: ${response.statusText}`,
          };
        }
        const errorMessage =
          typeof errorData.error === 'string'
            ? errorData.error
            : errorData.message || 'Failed to create booking';
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('✅ Booking created successfully:', result);
      return result;
    },
    onError: (error) => {
      console.error('❌ Booking creation mutation failed:', error);
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    },
  });
};
