import { useMutation } from '@tanstack/react-query';

/**
 * Response interface for checkout URL generation
 */
export interface CheckoutUrlResponse {
  success: boolean;
  url?: string;
  checkoutId?: string;
  bookingId?: string;
  error?: string;
  message?: string;
}

/**
 * Request interface for checkout URL generation
 */
export interface CheckoutUrlRequest {
  bookingId: string;
}

/**
 * Hook for generating checkout URL with retry logic
 * Handles the API call to create a checkout URL for a booking
 */
export const useCheckoutUrl = () => {
  return useMutation<CheckoutUrlResponse, Error, CheckoutUrlRequest>({
    mutationFn: async ({ bookingId }: CheckoutUrlRequest) => {
      console.log('🔄 Generating checkout URL for booking:', bookingId);

      const response = await fetch('/api/bookings/checkout-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Checkout URL generation failed:', errorData);
        throw new Error(errorData.error || 'Failed to generate checkout URL');
      }

      const result = await response.json();
      console.log('✅ Checkout URL generated successfully:', result);
      return result;
    },
    onError: (error) => {
      console.error('❌ Checkout URL generation error:', error);
    },
  });
};
