import { useEffect, useState } from 'react';
import { FormData } from './useBookingForm';
import { useBookingCollection } from './useBookingCollection';

const useCheckout = (formData: FormData) => {
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [checkoutError, setCheckoutError] = useState<any>(null);
  const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false);

  /**
   * service_rates
   */
  const service_rates = useBookingCollection({
    collectionName: 'ServiceRates',
    queryKey: 'service-rates-items',
    include: 'parentService',
  });

  /**
   * fees
   */
  const fees = useBookingCollection({
    collectionName: 'Fees',
    queryKey: 'fees-items-100',
    include: 'buildingType',
  });

  useEffect(() => {
    if (service_rates.data && fees.data) {
      const selectedServices = formData.service_type;
      const selectedServiceRates = service_rates.data?.filter(
        (service: any) => service.name === selectedServices
      );
      const selectedFees = fees.data?.filter(
        (fee: any) => fee.buildingType === formData.destination_building_type
      );
      setCheckoutData({
        selectedServices,
        selectedServiceRates,
        selectedFees,
      });
    }
  }, [formData, service_rates, fees]);

  return { checkoutData, checkoutError, checkoutLoading };
};
