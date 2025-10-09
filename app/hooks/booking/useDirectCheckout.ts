import { useMutation } from '@tanstack/react-query';

/**
 * Response interface for direct checkout redirect
 */
export interface DirectCheckoutResponse {
  success: boolean;
  url?: string;
  redirectSessionId?: string;
  error?: string;
  message?: string;
}

/**
 * Request interface for direct checkout redirect
 */
export interface DirectCheckoutRequest {
  slotAvailability: {
    slot: {
      serviceId: string;
      startDate: string;
      endDate: string;
      timezone?: string;
    };
  };
  timezone?: string;
}

/**
 * Hook for direct checkout redirect following Wix tutorial pattern
 * This approach skips booking creation and goes directly to checkout
 */
export const useDirectCheckout = () => {
  return useMutation<DirectCheckoutResponse, Error, DirectCheckoutRequest>({
    mutationFn: async ({
      slotAvailability,
      timezone = 'America/Winnipeg',
    }: DirectCheckoutRequest) => {
      console.log('Creating direct checkout redirect...', {
        serviceId: slotAvailability.slot.serviceId,
        startDate: slotAvailability.slot.startDate,
        endDate: slotAvailability.slot.endDate,
        timezone,
      });

      const response = await fetch('/api/bookings/checkout-direct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slotAvailability,
          timezone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Direct checkout redirect failed:', errorData);
        throw new Error(
          errorData.error || 'Failed to create checkout redirect'
        );
      }

      const result = await response.json();
      console.log('Direct checkout redirect created successfully:', result);
      return result;
    },
    onError: (error) => {
      console.error('Direct checkout redirect error:', error);
    },
  });
};
