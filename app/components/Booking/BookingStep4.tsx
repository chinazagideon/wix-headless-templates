// import { Icon } from "lucide-react";
import { FormData } from '../../hooks/booking/useBookingForm';
import CounterComponent from '@app/components/Booking/CounterComponent';
import { getIconFromKey } from '@app/book/IconProps';

/**
 * BookingStep4Props interface
 * @param formData - The form data
 * @param errors - The errors
 * @param updateFormData - The function to update the form data
 * @param items - The items
 * @param addons - The addons
 */
export interface BookingStep4Props {
  formData: FormData;
  errors: any;
  updateFormData: (field: string, value: any) => void;
  items: any[];
  addons?: any[];
}

/**
 * BookingStep4 component
 * @param items - The items
 * @param formData - The form data
 * @param errors - The errors
 * @param updateFormData - The function to update the form data
 * @param addons - The addons
 */
const BookingStep4 = ({
  items,
  formData,
  errors,
  updateFormData,
  addons,
}: BookingStep4Props) => {
  return (
    <>
      <div className="space-y-4 animate-fade-in">
        <div className="text-center">
          <h2 className="text-lg font-outfit font-semibold text-gray-900">
            Special Items{' '}
            <span className="text-gray-500 text-sm">(Optional)</span>
          </h2>
          <p className="text-gray-600 text-sm ">
            Items above 200lbs weight are considered as special items, charges
            will be applied.
          </p>
        </div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => {
              const Icon = getIconFromKey(item.icon);
              return (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-theme-orange transition-colors duration-200"
                >
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Icon className="w-4 h-4 text-gray-700 mr-2" />
                    {item.name}
                  </span>
                  <CounterComponent
                    count={formData.special_items[item.name] || 0}
                    updateFormData={(count) => {
                      const updatedItems = { ...formData.special_items };
                      if (count === 0) {
                        delete updatedItems[item.name];
                      } else {
                        updatedItems[item.name] = count;
                      }
                      updateFormData('special_items', updatedItems);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-4 pt-2">
          <h2 className="text-lg font-outfit font-semibold text-gray-900">
            Add-Ons Services
            <span className="text-gray-500 text-sm">(Optional)</span>
          </h2>
          <p className="text-gray-600 text-sm ">
            What addon services would you like to add to include during your
            move?
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {addons?.map((service: any) => {
            const Icon = getIconFromKey(service?.icon);
            const isSelected =
              formData.addons?.includes(service?.name) || false;
            return (
              <div
                key={service?.name}
                onClick={() => {
                  const currentAddons = formData.addons || [];
                  if (isSelected) {
                    // Remove from selection
                    updateFormData(
                      'addons',
                      currentAddons.filter((addon) => addon !== service?.name)
                    );
                  } else {
                    // Add to selection
                    updateFormData('addons', [...currentAddons, service?.name]);
                  }
                }}
                className={`w-full flex flex-row items-center justify-between border border-gray-200 p-4 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-lg 
                                                            ${
                                                              isSelected
                                                                ? 'border-theme-orange bg-orange-50'
                                                                : 'border-gray-200 hover:border-gray-300'
                                                            }`}
              >
                <div className="flex flex-row items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Icon
                      className={`w-4 h-4 ${
                        isSelected ? 'text-theme-orange' : 'text-gray-500'
                      }`}
                    />
                    <h3
                      className={`font-outfit font-semibold text-sm ${
                        isSelected ? 'text-gray-900' : 'text-gray-700'
                      }`}
                    >
                      {service?.name}
                    </h3>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
                    isSelected
                      ? 'bg-theme-orange border-theme-orange'
                      : 'border-gray-300'
                  }`}
                >
                  {isSelected && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default BookingStep4;
