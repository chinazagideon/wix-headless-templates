import { FormData } from '../../hooks/booking/useBookingForm';
import InlineDateTimePicker from '../DateTimePicker/InlineDateTimePicker';

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
              onClick={() => updateFormData('service_type', service.info?.name)}
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
    </div>
  );
};

export default BookingStep1;
