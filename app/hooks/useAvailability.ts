import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { wixClient } from '@app/server/wix';
// import { useGetMySitePropertiesFunction } from './useGetMySiteProperties';

export interface TimeSlot {
  startDate: string;
  endDate: string;
  serviceId: string;
  resourceId?: string;
  isAvailable: boolean;
}

export interface AvailabilityData {
  slots: TimeSlot[];
  loading: boolean;
  error: string | null;
  isDateAvailable: boolean | null;
  fetchAvailability: () => Promise<void>;
}

export interface AvailabilityQueryParams {
  serviceId: string | string[];
  from: string;
  to: string;
  slotsPerDay?: number;
  limit?: number;
}

/**
 * Hook for managing Wix availability queries
 * @param serviceId - The Wix service ID
 * @param date - The date to check availability for
 * @returns AvailabilityData object with slots, loading state, error, and fetch function
 */
export const useBookingAvailability = (
  serviceId: string,
  date: string
): AvailabilityData => {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDateAvailable, setIsDateAvailable] = useState<boolean | null>(null);

  const fetchAvailability = useCallback(async () => {
    if (!serviceId || !date || date.trim() === '') {
      setSlots([]);
      setError(null);
      setIsDateAvailable(null);
      return;
    }

    // Validate that the date is a valid date string
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      setSlots([]);
      setError(null);
      setIsDateAvailable(null);
      return;
    }

    setLoading(true);
    setError(null);
    setIsDateAvailable(null);

    try {
      // Create date range for the entire day
      // Start at 00:00:00 of the selected date
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);

      // End at 23:59:59 of the selected date
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      console.log('Checking availability:', {
        serviceId,
        selectedDate: date,
        queryStart: startDate.toISOString(),
        queryEnd: endDate.toISOString(),
        userTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      // const mySiteProperties = await useGetMySitePropertiesFunction();
      // console.log('mySiteProperties', mySiteProperties);
      // const resultTimeSlot = await wixClient.availabilityTimeSlots.getAvailabilityTimeSlot(
      //   serviceId,
      //   startDate.toISOString(),
      //   endDate.toISOString(),
      //   Intl.DateTimeFormat().resolvedOptions().timeZone,
      //   {},
      // );
      // console.log('resultTimeSlot', resultTimeSlot);
      const result = await wixClient.availabilityCalendar.queryAvailability({
        filter: {
          serviceId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          bookable: true,
        },
      });

      console.log('Availability Query Result:', {
        totalEntries: result.availabilityEntries?.length || 0,
        entries: result.availabilityEntries?.map((e: any) => ({
          start: e.startDate,
          end: e.endDate,
          bookable:
            !e.bookingPolicyViolations ||
            Object.keys(e.bookingPolicyViolations || {}).length === 0,
          violations: e.bookingPolicyViolations,
        })),
      });

      // Check if any slots are available for the date
      const hasAvailableSlots =
        result.availabilityEntries && result.availabilityEntries.length > 0;
      console.log('✅ Has available slots:', hasAvailableSlots);
      setIsDateAvailable(hasAvailableSlots || false);

      // Transform the result to our TimeSlot format (we don't need to show individual slots)
      const transformedSlots: TimeSlot[] =
        result.availabilityEntries?.map((entry: any) => ({
          startDate: entry.startDate,
          endDate: entry.endDate,
          serviceId: entry.serviceId,
          resourceId: entry.resourceId,
          isAvailable: entry.isAvailable || true,
        })) || [];
      setSlots(transformedSlots);
    } catch (err: any) {
      // console.error('Error fetching availability:', err);
      const errorMessage =
        err?.message || err?.toString() || 'Failed to fetch availability';
      setError(errorMessage);
      setSlots([]);
      setIsDateAvailable(false); // Assume not available if there's an error
    } finally {
      setLoading(false);
    }
  }, [serviceId, date]);

  // Auto-fetch when dependencies change
  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  return {
    slots,
    loading,
    error,
    isDateAvailable,
    fetchAvailability,
  };
};

/**
 * New availability hook used by Calendar components.
 * Returns React Query result with { data, isLoading } where data contains availabilityEntries.
 */
export const useAvailability = (params: AvailabilityQueryParams) => {
  return useQuery({
    queryKey: ['availability', params],
    queryFn: async () => {
      const { serviceId, from, to, slotsPerDay = 1, limit = 100 } = params;

      if (!serviceId || !from || !to) {
        return { availabilityEntries: [] } as any;
      }

      const query = {
        filter: {
          ...(serviceId
            ? { serviceId: Array.isArray(serviceId) ? serviceId : [serviceId] }
            : {}),
          startDate: from,
          endDate: to,
          bookable: true,
        },
        ...(limit ? { cursorPaging: { limit } } : {}),
      } as any;

      const result = await wixClient.availabilityCalendar.queryAvailability(
        query,
        { slotsPerDay }
      );

      return result;
    },
    enabled: !!(params.serviceId && params.from && params.to),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};
