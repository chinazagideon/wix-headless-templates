import { FormData } from '../../hooks/booking/useBookingForm';
import InlineDateTimePicker from '../DateTimePicker/InlineDateTimePicker';
import { useBookingAvailability } from '../../hooks/useAvailability';
import { Clock, Loader } from 'lucide-react';
import { useAvailabilityTimeSlot } from '@app/hooks/booking/useAvailabilityTimeSlot';
import { useEffect } from 'react';

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

  const appointmentDate = getDateFromDateTime(
    formData.moving_address_date_and_time
  );

  // Use availability hook
  const {
    slots,
    loading: availabilityLoading,
    error: availabilityError,
    isDateAvailable,
  } = useBookingAvailability(serviceId, appointmentDate);

  // Validate exact time slot using getAvailabilityTimeSlot for the selected time
  const localStartForSlot = formData.moving_address_date_and_time || undefined;
  const {
    ok: slotOk,
    loading: slotLoading,
    error: slotError,
    details: slotDetails,
  } = useAvailabilityTimeSlot(
    serviceId,
    localStartForSlot as any,
    formData.selected_hours || 2,
    'CUSTOM'
  );

  // Persist the validated slot details for later booking/checkout
  useEffect(() => {
    if (slotDetails) {
      updateFormData('selected_time_slot', slotDetails);
    }
  }, [slotDetails, updateFormData]);

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

      {/* Availability Check Section - Simplified with exact-slot validation */}
      {formData.service_type &&
        appointmentDate &&
        appointmentDate.trim() !== '' && (
          <div className="space-y-4 mt-6">
            {availabilityLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader className="w-5 h-5 animate-spin text-theme-orange mr-2" />
                <span className="text-gray-600">Checking availability...</span>
              </div>
            ) : (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-800 font-medium">
                    ✓ Request submitted for review
                  </span>
                </div>
                <p className="text-blue-700 text-sm mt-2">
                  Your booking request will be reviewed and confirmed by our
                  team within 24 hours.
                  {slots &&
                    slots.length > 0 &&
                    ` (${slots.length} potential slot${
                      slots.length > 1 ? 's' : ''
                    } found)`}
                </p>
                {isDateAvailable === false && (
                  <p className="text-blue-600 text-sm mt-1">
                    ⚠️ Limited availability on this date. We&apos;ll contact you
                    to confirm or suggest alternatives.
                  </p>
                )}
                {/* Exact slot check indicator */}
                <div className="mt-2 text-xs">
                  {slotLoading && (
                    <span className="text-gray-600">
                      Validating your selected time…
                    </span>
                  )}
                  {!slotLoading && slotOk === true && (
                    <span className="text-green-700">
                      Selected time looks available.
                    </span>
                  )}
                  {!slotLoading && slotOk === false && (
                    <span className="text-orange-700">
                      Selected time may be unavailable. You can submit and
                      we&apos;ll confirm or offer alternatives.
                    </span>
                  )}
                  {!slotLoading && slotError && (
                    <span className="text-yellow-700">
                      Unable to validate time: {slotError}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
    </div>
  );
};

export default BookingStep1;
