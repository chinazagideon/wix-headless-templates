import { FormData } from '../../hooks/booking/useBookingForm';
import InlineDateTimePicker from '../DateTimePicker/InlineDateTimePicker';
import { useBookingAvailability } from '../../hooks/useAvailability';
import { Clock, Loader } from 'lucide-react';

/**
 * BookingStep1Props interface
 * @param formData - The form data
 * @param errors - The errors
 * @param updateFormData - The function to update the form data
 * @param visibleServices - The visible services
 * @param getIconForService - The function to get the icon for the service
 */
export interface BookingStep1Props {
  formData: FormData;
  errors: any;
  updateFormData: (field: string, value: any) => void;
  visibleServices: any;
  getIconForService: (name: string) => any;
  isRelocationService: () => boolean;
}

/**
 * BookingStep1 component
 * @param formData - The form data
 * @param errors - The errors
 * @param updateFormData - The function to update the form data
 * @param visibleServices - The visible services
 * @param getIconForService - The function to get the icon for the service
 */
const BookingStep1 = ({
  formData,
  errors,
  updateFormData,
  visibleServices,
  getIconForService,
  isRelocationService,
}: BookingStep1Props) => {
  // Get service ID from selected service
  const selectedService = visibleServices?.find(
    (service: any) => service.info?.name === formData.service_type
  );
  const serviceId = selectedService?.id || '';

  // Extract date from the datetime string for availability checking
  const getDateFromDateTime = (dateTimeString: string) => {
    if (!dateTimeString || dateTimeString.trim() === '') return '';
    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().split('T')[0]; // Get YYYY-MM-DD format
    } catch {
      return '';
    }
  };

  const appointmentDate = getDateFromDateTime(formData.moving_address_date_and_time);

  // Use availability hook
  const { slots, loading: availabilityLoading, error: availabilityError, isDateAvailable } = useBookingAvailability(
    serviceId,
    appointmentDate
  );

  // Debug logging
  if (serviceId && appointmentDate) {
    console.log('BookingStep1 Debug:', {
      serviceId,
      appointmentDate,
      serviceType: formData.service_type,
      selectedService,
      slots: slots?.length || 0,
      loading: availabilityLoading,
      error: availabilityError,
      isDateAvailable
    });
  }

  // Handle service selection
  const handleServiceChange = (service: any) => {
    updateFormData('service_type', service.info?.name);
    updateFormData('service_id', service.id);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-outfit font-semibold text-gray-900 mb-2">
          How would you like to move?
        </h2>
        <p className="text-gray-600">
          Select the service type that best describes your move
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {visibleServices?.map((service: any) => {
          const Icon = getIconForService(service.info?.name);
          return (
            <div
              key={service.id}
              onClick={() => handleServiceChange(service)}
              className={`p-3 rounded-xl border-1 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                formData.service_type === service.info?.name
                  ? 'border-theme-orange bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <Icon
                  className={`w-10 h-10 mx-auto mb-4 ${
                    formData.service_type === service.info?.name
                      ? 'text-theme-orange'
                      : 'text-gray-400'
                  }`}
                />
                <h3 className="font-outfit font-semibold text-sm text-gray-900 mb-2">
                  {service.info?.name}
                </h3>
              </div>
            </div>
          );
        })}
      </div>
      {errors.service_type && (
        <p className="text-red-500 text-xs">{errors.service_type}</p>
      )}

      <div className="text-center">
        <h2 className="text-2xl font-outfit font-semibold text-gray-900 mb-2">
          When are you moving?
        </h2>
        <p className="text-gray-600 mb-6">
          Select the date and time for your move
        </p>
      </div>

      <InlineDateTimePicker
        value={formData.moving_address_date_and_time}
        onChange={(value) =>
          updateFormData('moving_address_date_and_time', value)
        }
        error={errors.moving_address_date_and_time}
      />

      {/* Simplified Availability Check Section */}
      {formData.service_type && appointmentDate && appointmentDate.trim() !== '' && (
        <div className="space-y-4">
          {availabilityLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader className="w-5 h-5 animate-spin text-theme-orange mr-2" />
              <span className="text-gray-600">Checking availability...</span>
            </div>
          ) : isDateAvailable === true ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-medium">
                  ✓ {appointmentDate} is available for booking
                </span>
              </div>
            </div>
          ) : isDateAvailable === false ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-600" />
                <span className="text-red-800 font-medium">
                  ✗ {appointmentDate} is not available for booking
                </span>
              </div>
              <p className="text-red-600 text-sm mt-2">Please select a different date</p>
            </div>
          ) : availabilityError ? (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="text-yellow-800 font-medium">
                  Unable to check availability
                </span>
              </div>
              <p className="text-yellow-600 text-sm mt-2">Please try again or select a different date</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default BookingStep1;