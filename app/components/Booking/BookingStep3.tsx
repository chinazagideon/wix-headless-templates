import AddressAutocomplete from '@app/components/AddressAutocomplete';
import { FormData } from '../../hooks/booking/useBookingForm';
import CounterComponent from '@app/components/Booking/CounterComponent';

export interface BookingStep3Props {
  formData: FormData;
  errors: any;
  updateFormData: (field: string, value: any) => void;
  building_type: any;
  getIconFromKey: (key: string) => any;
  onClickHasElevator: (field: any, value: string) => void;
}
const BookingStep3 = ({
  formData,
  errors,
  updateFormData,
  building_type,
  getIconFromKey,
  onClickHasElevator,
}: BookingStep3Props) => {
  return (
    <>
      <div className="space-y-4 animate-fade-in">
        <div className="text-center">
          <h2 className="text-lg font-outfit font-semibold text-gray-900">
            Destination Address
          </h2>
          <p className="text-gray-600 text-sm ">
            Please enter the destination address
          </p>
        </div>
        <div className="flex flex-col">
          <AddressAutocomplete
            value={formData.destination_address}
            onChange={(address) =>
              updateFormData('destination_address', address)
            }
            placeholder="please enter your destination address"
            label="Destination address"
            fieldClassName="rounded-lg  border border-gray-300 text-gray-700 dark:text-white focus:border-theme-orange active:border-theme-orange"
            className="block w-full  rounded-lg focus:ring-2 focus:ring-theme-orange focus:border-transparent transition-all duration-200"
            labelClassName="text-gray-700 font-medium"
            showLabel={false}
          />
          {errors.destination_address && (
            <p className="text-red-500 text-xs mt-1">
              {errors.destination_address}
            </p>
          )}
        </div>
        <div className="flex flex-col w-full items-center justify-center mt-2">
          <div className="text-center">
            <h2 className="text-lg font-outfit font-semibold text-gray-900">
              Building Type
            </h2>
            <p className="text-gray-600 text-sm">Select the building type</p>
          </div>
          <div className="flex flex-row gap-3 w-full items-center justify-center px-4 mt-2">
            {building_type?.data?.map((service: any) => {
              const Icon = getIconFromKey(service?.icon);
              return (
                <div
                  key={service._id}
                  onClick={() => {
                    updateFormData('destination_building_type', service?.title);
                    updateFormData('destination_has_elevator', '');
                    // updateFormData('destination_stairs_count', '')
                  }}
                  className={`w-full border border-gray-200 p-2 lg:px-1 rounded-xl border-1 cursor-pointer transition-all duration-300 hover:shadow-lg 
                                                            ${
                                                              formData.destination_building_type ===
                                                              service?.title
                                                                ? 'border-theme-orange bg-orange-50'
                                                                : 'border-gray-200 hover:border-gray-300'
                                                            }`}
                >
                  <div className="text-center">
                    <Icon
                      className={`w-8 h-8 mx-auto mb-4 text-theme-orange`}
                    />
                    <h3 className="font-outfit font-semibold text-sm text-gray-900 mb-2">
                      {service?.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="space-y-4">
          {formData.destination_building_type === 'Apartment' && (
            <div className="flex lg:flex-row flex-col w-full items-center justify-center px-4 mt-2">
              <p className="text-gray-700 sm:text-base text-sm font-medium text-center lg:mb-0 mb-2">
                Do you have access to an elevator?&nbsp;&nbsp;
              </p>

              <div className="flex flex-row items-center justify-center gap-3">
                <div
                  className={`px-4 border border-gray-200 p-2 hover:bg-orange-50 hover:border-theme-orange rounded-xl border-1 cursor-pointer transition-all duration-300 hover:shadow-lg 
                 ${
                   formData.destination_has_elevator === 'yes'
                     ? 'border-theme-orange bg-orange-50'
                     : 'border-gray-200 hover:border-gray-300'
                 }`}
                  onClick={() =>
                    onClickHasElevator('destination_has_elevator', 'yes')
                  }
                >
                  <p className="text-gray-700 font-medium">Yes</p>
                </div>
                <div
                  className={`px-4 border border-gray-200 p-2 hover:bg-orange-50 hover:border-theme-orange rounded-xl border-1 cursor-pointer transition-all duration-300 hover:shadow-lg 
                 ${
                   formData.destination_has_elevator === 'no'
                     ? 'border-theme-orange bg-orange-50'
                     : 'border-gray-200 hover:border-gray-300'
                 }`}
                  onClick={() =>
                    onClickHasElevator('destination_has_elevator', 'no')
                  }
                >
                  <p className="text-gray-700 font-medium">No</p>
                </div>
              </div>
            </div>
          )}
          {formData.destination_has_elevator === 'no' &&
            formData.destination_building_type === 'Apartment' && (
              <div className="flex lg:flex-row flex-col gap-2 w-full items-center justify-center px-4 mt-2">
                <div className="flex items-center justify-center mb-2 ">
                  <p className="text-gray-700 font-medium w-full text-center">
                    how many flight of stairs&nbsp;&nbsp;
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <CounterComponent
                    count={formData.destination_stairs_count}
                    updateFormData={(count) =>
                      updateFormData('destination_stairs_count', count)
                    }
                  />
                </div>
              </div>
            )}
        </div>
      </div>
    </>
  );
};

export default BookingStep3;
