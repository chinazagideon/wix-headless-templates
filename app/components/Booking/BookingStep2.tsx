import AddressAutocomplete from '@app/components/AddressAutocomplete';
import { FormData } from '../../hooks/booking/useBookingForm';
import CounterComponent from '@app/components/Booking/CounterComponent';

export interface BookingStep2Props {
  formData: FormData;
  errors: any;
  updateFormData: (field: string, value: any) => void;
  building_type: any;
  getIconFromKey: (key: string) => any;
  onClickHasElevator: (field: any, value: string) => void;
  isRelocationService: () => boolean;
}

const BookingStep2 = ({
  formData,
  errors,
  updateFormData,
  building_type,
  getIconFromKey,
  onClickHasElevator,
  isRelocationService,
}: BookingStep2Props) => {
  return (
    <>
      <div className="space-y-4 animate-fade-in">
        <div className="text-center">
          <h2 className="text-lg font-outfit font-semibold text-gray-900">
            {!isRelocationService()
              ? 'Pickup Location'
              : ' Address Information'}
          </h2>
          {!isRelocationService() ? (
            <p className="text-gray-600 text-sm ">
              Please enter your address information
            </p>
          ) : (
            <p className="text-gray-600 text-sm ">
              Please enter the pickup address
            </p>
          )}
        </div>
        <div className="flex flex-col">
          <AddressAutocomplete
            value={formData.pickup_address}
            onChange={(address) => updateFormData('pickup_address', address)}
            placeholder={
              !isRelocationService()
                ? 'please enter your pickup address'
                : 'please enter your address information'
            }
            label={
              !isRelocationService() ? 'Pickup address' : 'Address Information'
            }
            fieldClassName="rounded-lg  border border-gray-300 text-gray-700 dark:text-white focus:border-theme-orange active:border-theme-orange"
            className="block w-full  rounded-lg focus:ring-2 focus:ring-theme-orange focus:border-transparent transition-all duration-200"
            labelClassName="text-gray-700 font-medium"
            showLabel={false}
          />
          {errors.pickup_address && (
            <p className="text-red-500 text-xs mt-1">{errors.pickup_address}</p>
          )}
        </div>
        <div className="flex flex-col w-full items-center justify-center mt-2">
          <div className="text-center">
            <h2 className="text-lg font-outfit font-semibold text-gray-900">
              {!isRelocationService()
                ? 'Pickup Building Type'
                : 'Building Type'}
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
                    updateFormData('pickup_building_type', service?.title);
                    updateFormData('has_elevator', '');
                    updateFormData('stairs_count', '');
                  }}
                  className={`w-full border border-gray-200 p-2 lg:px-1 rounded-xl border-1 cursor-pointer transition-all duration-300 hover:shadow-lg 
                                                            ${
                                                              formData.pickup_building_type ===
                                                              service?.title
                                                                ? 'border-theme-orange bg-orange-50'
                                                                : 'border-gray-200 hover:border-gray-300'
                                                            }`}
                >
                  <div className="text-center">
                    <Icon
                      className={`w-8 h-8 mx-auto mb-4 
                                                                        text-theme-orange`}
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
          {formData.pickup_building_type === 'Apartment' && (
            <div className="flex lg:flex-row flex-col w-full items-center justify-center px-4 mt-2">
              <p className="text-gray-700 sm:text-base text-sm font-medium text-center lg:mb-0 mb-2">
                Do you have access to an elevator?&nbsp;&nbsp;
              </p>

              <div className="flex flex-row items-center justify-center gap-3">
                <div
                  className={`px-4 border border-gray-200 p-2 hover:bg-orange-50 hover:border-theme-orange rounded-xl border-1 cursor-pointer transition-all duration-300 hover:shadow-lg 
                                                    ${
                                                      formData.has_elevator ===
                                                      'yes'
                                                        ? 'border-theme-orange bg-orange-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                  onClick={() => onClickHasElevator('has_elevator', 'yes')}
                >
                  <p className="text-gray-700 font-medium">Yes</p>
                </div>
                <div
                  className={`px-4 border border-gray-200 p-2 hover:bg-orange-50 hover:border-theme-orange rounded-xl border-1 cursor-pointer transition-all duration-300 hover:shadow-lg 
                                                    ${
                                                      formData.has_elevator ===
                                                      'no'
                                                        ? 'border-theme-orange bg-orange-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                  onClick={() => onClickHasElevator('has_elevator', 'no')}
                >
                  <p className="text-gray-700 font-medium">No</p>
                </div>
              </div>
            </div>
          )}
          {formData.has_elevator === 'no' &&
            formData.pickup_building_type === 'Apartment' && (
              <div className="flex lg:flex-row flex-col gap-2 w-full items-center justify-center px-4 mt-2">
                <div className="flex items-center justify-center mb-2 ">
                  <p className="text-gray-700 font-medium w-full text-center">
                    how many flight of stairs&nbsp;&nbsp;
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <CounterComponent
                    count={formData.stairs_count}
                    updateFormData={(count) =>
                      updateFormData('stairs_count', count)
                    }
                  />
                </div>
              </div>
            )}
          <div className="flex lg:flex-row flex-col gap-2 w-full items-center justify-center px-4 mt-2">
            <div className="flex items-center justify-center mb-2 ">
              <p className="text-gray-700 font-medium w-full text-center lg:pt-2 pt-0">
                Select the number of rooms&nbsp;&nbsp;
              </p>
            </div>
            <div className="flex flex-row items-center justify-center gap-3">
              <div
                className={`px-4 border border-gray-200 p-2 hover:bg-orange-50 hover:border-theme-orange rounded-xl border-1 cursor-pointer transition-all duration-300 hover:shadow-lg 
                                                    ${
                                                      formData.pickup_room_size ===
                                                      'studio/1 bedroom'
                                                        ? 'border-theme-orange bg-orange-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                onClick={() => updateFormData('pickup_room_size', 'studio/1 bedroom')}
              >
                <p className="text-gray-700 font-medium">Studio/1 bedroom</p>
              </div>
              <div
                className={`px-4 border border-gray-200 p-2 hover:bg-orange-50 hover:border-theme-orange rounded-xl border-1 cursor-pointer transition-all duration-300 hover:shadow-lg 
                                                    ${
                                                      formData.pickup_room_size ===
                                                      '2 bedrooms'
                                                        ? 'border-theme-orange bg-orange-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                onClick={() => updateFormData('pickup_room_size', '2 bedrooms')}
              >
                <p className="text-gray-700 font-medium">2 bedrooms</p>
              </div>
              <div
                className={`px-4 border border-gray-200 p-2 hover:bg-orange-50 hover:border-theme-orange rounded-xl border-1 cursor-pointer transition-all duration-300 hover:shadow-lg 
                                                    ${
                                                      formData.pickup_room_size ===
                                                      '3 bedrooms+'
                                                        ? 'border-theme-orange bg-orange-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                onClick={() => updateFormData('pickup_room_size', '3 bedrooms+')}
              >
                <p className="text-gray-700 font-xs"> 3 bedrooms+</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingStep2;
