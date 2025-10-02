import { useMutation } from '@tanstack/react-query';

/**
 * Response interface for booking checkout
 */
export interface BookingCheckoutResponse {
  success: boolean;
  checkoutUrl?: string;
  checkoutId?: string;
  bookingId?: string;
  error?: string;
  message?: string;
}

/**
 * Request interface for booking checkout
 */
export interface BookingCheckoutRequest {
  bookingId: string;
  serviceId?: string;
  startDate?: string; // ISO string
  endDate?: string; // ISO string
  totalAmount?: number;
}

/**
 * Hook for booking checkout redirect
 * Handles the API call to create a checkout session for a booking
 */
export const useBookingCheckout = () => {
  return useMutation<BookingCheckoutResponse, Error, BookingCheckoutRequest>({
    mutationFn: async ({
      bookingId,
      serviceId,
      startDate,
      endDate,
      totalAmount,
    }: BookingCheckoutRequest) => {
      const response = await fetch('/api/bookings/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          serviceId,
          startDate,
          endDate,
          totalAmount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      return response.json();
    },
    onError: (error) => {
      console.error('Booking checkout failed:', error);
    },
  });
};
