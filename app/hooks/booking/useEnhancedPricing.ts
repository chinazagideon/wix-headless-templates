import { useEffect, useState, useMemo } from 'react';
import { FormData } from './useBookingForm';
import { useBookingCollection } from './useBookingCollection';
import {
  PricingCalculator,
  PricingData,
  CalculatedPricing,
} from '@app/services/PricingCalculator';

/**
 * Enhanced pricing hook that fetches all pricing data from Wix collections
 * and calculates comprehensive pricing based on your requirements
 */
export const useEnhancedPricing = (formData: FormData) => {
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all pricing collections from Wix
  const serviceRates = useBookingCollection({
    collectionName: 'ServiceRates',
    queryKey: 'service-rates-pricing',
    include: 'parentService',
  });

  const travelFees = useBookingCollection({
    collectionName: 'TravelFees',
    queryKey: 'travel-fees-pricing',
  });

  const truckFees = useBookingCollection({
    collectionName: 'TruckFees',
    queryKey: 'truck-fees-pricing',
  });

  const stairFees = useBookingCollection({
    collectionName: 'Fees',
    queryKey: 'stair-fees-pricing',
  });

  const specialItems = useBookingCollection({
    collectionName: 'SpecialItems',
    queryKey: 'special-items-pricing',
  });

  const addons = useBookingCollection({
    collectionName: 'Addons',
    queryKey: 'addons-pricing',
  });

  // Combine all pricing data when collections are loaded
  useEffect(() => {
    const allLoaded = [
      serviceRates.data,
      travelFees.data,
      truckFees.data,
      stairFees.data,
      specialItems.data,
      addons.data,
    ].every((data) => data !== undefined);

    if (allLoaded) {
      setPricingData({
        serviceRates: (serviceRates.data as any[]) || [],
        travelFees: (travelFees.data as any[]) || [],
        truckFees: (truckFees.data as any[]) || [],
        stairFees: (stairFees.data as any[]) || [],
        specialItems: (specialItems.data as any[]) || [],
        addons: (addons.data as any[]) || [],
      });
      setIsLoading(false);
    }

    // Check for errors
    const hasError = [
      serviceRates.error,
      travelFees.error,
      truckFees.error,
      stairFees.error,
      specialItems.error,
      addons.error,
    ].some((err) => err !== null);

    if (hasError) {
      setError('Failed to load pricing data');
      setIsLoading(false);
    }
  }, [
    serviceRates.data,
    travelFees.data,
    truckFees.data,
    stairFees.data,
    specialItems.data,
    addons.data,
    serviceRates.error,
    travelFees.error,
    truckFees.error,
    stairFees.error,
    specialItems.error,
    addons.error,
  ]);

  // Create pricing calculator instance
  const pricingCalculator = useMemo(() => {
    if (!pricingData) return null;
    return new PricingCalculator(pricingData);
  }, [pricingData]);

  // Memoize only the pricing-relevant form data to prevent unnecessary recalculations
  const pricingRelevantData = useMemo(
    () => ({
      mover_count: formData.mover_count,
      service_type: formData.service_type,
      selected_hours: formData.selected_hours,
      special_items: formData.special_items,
      addons: formData.addons,
      rooms: formData.rooms,
      distance_miles: formData.distance_miles,
      pickup_stairs_count: formData.pickup_stairs_count,
      destination_stairs_count: formData.destination_stairs_count,
    }),
    [
      formData.mover_count,
      formData.service_type,
      formData.selected_hours,
      formData.special_items,
      formData.addons,
      formData.rooms,
      formData.distance_miles,
      formData.pickup_stairs_count,
      formData.destination_stairs_count,
    ]
  );

  // Calculate pricing based on current form data
  const calculatedPricing = useMemo((): CalculatedPricing | null => {
    if (!pricingCalculator) return null;
    return pricingCalculator.calculatePricing(pricingRelevantData as FormData);
  }, [pricingCalculator, pricingRelevantData]);

  // Get available options for UI
  const availableMoverCounts = useMemo(() => {
    return pricingCalculator?.getAvailableMoverCounts() || [2, 3];
  }, [pricingCalculator]);

  const minimumHours = useMemo(() => {
    return pricingCalculator?.getMinimumHours() || 2;
  }, [pricingCalculator]);

  const maximumHours = useMemo(() => {
    return pricingCalculator?.getMaximumHours() || 12;
  }, [pricingCalculator]);

  return {
    // Pricing calculation
    calculatedPricing,

    // Raw pricing data
    pricingData,

    // Loading states
    isLoading:
      isLoading ||
      serviceRates.isLoading ||
      travelFees.isLoading ||
      truckFees.isLoading ||
      stairFees.isLoading ||
      specialItems.isLoading ||
      addons.isLoading,

    // Error handling
    error:
      error ||
      serviceRates.error ||
      travelFees.error ||
      truckFees.error ||
      stairFees.error ||
      specialItems.error ||
      addons.error,

    // Available options for UI
    availableMoverCounts,
    minimumHours,
    maximumHours,

    // Individual collection states (for debugging)
    collections: {
      serviceRates,
      travelFees,
      truckFees,
      stairFees,
      specialItems,
      addons,
    },
  };
};
