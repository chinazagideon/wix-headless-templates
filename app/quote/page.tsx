'use client';

import { useEffect } from 'react';
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  TruckIcon,
  HomeIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import {
  BoxIcon,
  HandHelping,
  Loader,
  SofaIcon,
} from 'lucide-react';
import PageHeader from '@app/components/Layout/PageHeader';
import DateTimePicker from '@app/components/DateTimePicker/DateTimePicker';
import { useQuotationForm } from '@app/hooks/useQuotationForm';
import TrustBar from '@app/components/ui/TrustBar';
import PlaceAutocompleteInput from '@app/components/ui/PlaceAutocompleteInput';
import ConsentText from './_components/ConsentText';
import QuotePageShell from './_components/QuotePageShell';
import { trackPixelEvent } from '@app/lib/meta-pixel';

const move_sizes = [
  {
    id: 'small',
    label: 'Small move',
    description: '(studio/bedroom)',
    items: 'Up to 10 items',
  },
  {
    id: 'medium',
    label: 'Medium move',
    description: '(2 - 3 bedrooms)',
    items: '10-25 items',
  },
  {
    id: 'large',
    label: 'Large move',
    description: '(4+ bedrooms)',
    items: '25+ items',
  },
];

const items = [
  'Piano',
  'Pool Table',
  'Large Appliances',
  'Artwork',
  'Antiques',
  // 'Exercise Equipment',
  // 'Floor runners',
  // 'Tall Furniture',
  // 'Heavy Items',
  // 'Fragile Items',
  // 'Electronics',
  'Other',
];

export default function QuotationPage() {
  const {
    currentStep,
    formData,
    errors,
    isSubmitting,
    isFetching,
    visibleServices,
    updateFormData,
    prevStep,
    handleSubmit,
    handleStepValidation,
    isStepValid,
    compareValue,
    formError,
    validatePhoneField,
  } = useQuotationForm();

  useEffect(() => {
    trackPixelEvent('ViewContent');
  }, []);

  type IconType = typeof HomeIcon;
  const iconByKeyword: Record<string, IconType> = {
    residential: HomeIcon,
    commercial: BuildingOfficeIcon,
    moving: HandHelping,
    furniture: SofaIcon,
    warehousing: HomeIcon,
    packing: BoxIcon,
    unpacking: BoxIcon,
  };

  const getIconForService = (serviceName?: string): IconType => {
    if (!serviceName) return TruckIcon;
    const firstWord = serviceName.trim().split(/\s+/)[0].toLowerCase();
    return iconByKeyword[firstWord] ?? TruckIcon;
  };

  const isMovingHelp = compareValue(formData.service_type, 'Moving Help');

  return (
    <QuotePageShell>
      <PageHeader
        title={`Get a Free Moving Quote`}
        description={`Tell us about your move and get a personalized quote in minutes`}
        className="items-center justify-center"
      />
      <TrustBar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-4 lg:mb-12 w-full relative z-1000 ">
              <div className="flex items-center justify-between mb-4  w-full z-1000">
                <div
                  className={`absolute top-5 left-0 w-full h-0.5 bg-gray-200 z-1000  border-b border-gray-200 ${
                    currentStep === 3 ? 'bg-theme-orange' : 'bg-gray-200'
                  }`}
                ></div>
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`z-20 w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                        step <= currentStep
                          ? 'bg-theme-orange text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {step}
                    </div>
                    {step < 3 && (
                      <div
                        className={`w-[calc(100%-100px)] z-30 h-0.5 mx-4 transition-all duration-300 ${
                          step < currentStep ? 'bg-theme-orange' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span
                  className={
                    currentStep >= 1 ? 'text-theme-orange font-medium' : ''
                  }
                >
                  Service Type
                </span>
                <span
                  className={
                    currentStep >= 2 ? 'text-theme-orange font-medium' : ''
                  }
                >
                  Move Size
                </span>
                <span
                  className={
                    currentStep >= 3 ? 'text-theme-orange font-medium' : ''
                  }
                >
                  Moving Details
                </span>
              </div>
            </div>

            {/* Form Container */}
            <div className="bg-white rounded-2xl shadow-xl p-4 lg:p-8 mb-8">
              {isFetching && (
                <div className="flex flex-col items-center justify-center">
                  <Loader className="w-5 h-5 mr-2 animate-spin text-theme-orange" />
                  <span className="text-gray-600">Loading...</span>
                </div>
              )}
              {Boolean(formError) && (
                <p className="text-red-500 text-xs text-center mb-4">
                  {(formError as any)?.message ||
                    'An error occurred. Please try again.'}
                </p>
              )}
              {!isFetching && (
                <p className="text-red-500 text-xs text-center mb-4">
                  {' '}
                  required fields are marked with an asterisk (*)
                </p>
              )}
              {/* Step 1: Move Type */}
              {currentStep === 1 && !isFetching && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center">
                    <h2 className="text-2xl font-outfit font-semibold text-gray-900 mb-2">
                      How would you like to move?
                    </h2>
                    <p className="text-gray-600">
                      Select the service type that best describes your move
                      <span className="text-red-500 text-xs ml-1">*</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {visibleServices?.map((service) => {
                      const Icon = getIconForService(service.info?.name);
                      return (
                        <div
                          key={service.id}
                          onClick={() =>
                            updateFormData('service_type', service.info?.name)
                          }
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
                    <p className="text-red-500 text-xs">
                      {errors.service_type}
                    </p>
                  )}
                </div>
              )}

              {/* Step 2: Move Size */}
              {currentStep === 2 && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center">
                    <h2 className="text-2xl font-outfit font-semibold text-gray-900 mb-2">
                      How big is your move?
                    </h2>
                    <p className="text-gray-600">
                      Help us understand the scope of your move
                      <span className="text-red-500 text-xs ml-1">*</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {move_sizes.map((size) => (
                      <div
                        key={size.id}
                        onClick={() =>
                          updateFormData(
                            'move_size_str',
                            size.label + ' ' + size.description
                          )
                        }
                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                          formData.move_size_str ===
                          size.label + ' ' + size.description
                            ? 'border-theme-orange bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-center">
                          <h3 className="font-outfit font-semibold text-lg text-gray-900 mb-2">
                            {size.label}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {size.description}
                          </p>
                          <p className="text-theme-orange text-xs font-medium">
                            {size.items}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.move_size_str && (
                    <p className="text-red-500 text-xs">
                      {errors.move_size_str}
                    </p>
                  )}

                  {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <div className="space-y-4">
                      <label className="block">
                        <span className="text-gray-700 font-medium">
                          Current Building
                          <span className="text-red-500 text-xs ml-1">
                            *
                          </span>{' '}
                        </span>
                      </label>

                      <select
                        value={formData.building_type_str}
                        onChange={(e) =>
                          updateFormData('building_type_str', e.target.value)
                        }
                        className="text-gray-700 mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-orange focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Select building type</option>
                        <option value="Apartment">Apartment</option>
                        <option value="House">House</option>
                        <option value="Office">Office</option>
                        <option value="Condo">Condo</option>
                      </select>
                      {errors.building_type_str && (
                        <p className="text-red-500 text-xs">
                          {errors.building_type_str}
                        </p>
                      )}
                    </div>
                    <div className="space-y-4">
                      <label className="block">
                        <span className="text-gray-700 font-medium">
                          New Building
                          <span className="text-red-500 text-xs ml-1">
                            *
                          </span>{' '}
                        </span>
                      </label>

                      <select
                        value={formData.destination_building_type}
                        onChange={(e) =>
                          updateFormData(
                            'destination_building_type',
                            e.target.value
                          )
                        }
                        className="text-gray-700 mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-orange focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Select building type</option>
                        <option value="Apartment">Apartment</option>
                        <option value="House">House</option>
                        <option value="Office">Office</option>
                        <option value="Condo">Condo</option>
                      </select>
                      {errors.destination_building_type && (
                        <p className="text-red-500 text-xs">
                          {errors.destination_building_type}
                        </p>
                      )}
                    </div>
                  </div> */}
                  <div className="flex flex-col space-y-4 w-full hidden">
                    <span className="text-gray-700 font-medium block mb-3">
                      Special items{' '}
                      <span className="text-gray-500 text-sm">(Optional)</span>
                    </span>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {items.map((item) => (
                        <label
                          key={item}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.special_items_str.includes(item)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                updateFormData('special_items_str', [
                                  ...formData.special_items_str,
                                  item,
                                ]);
                              } else {
                                updateFormData(
                                  'special_items_str',
                                  formData.special_items_str.filter(
                                    (i: any) => i !== item
                                  )
                                );
                              }
                            }}
                            className="w-4 h-4 text-theme-orange border-gray-300 rounded focus:ring-theme-orange"
                          />
                          <span className="text-sm text-gray-700">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Location & Details */}
              {currentStep === 3 && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center">
                    <h2 className="text-2xl font-outfit font-semibold text-gray-900 mb-2">
                      Moving Details
                    </h2>
                    <p className="text-gray-600">
                      Tell us about your contact and moving details
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="block">
                      <span className="text-gray-700 font-medium text-sm">
                        Name
                        <span className="text-red-500 text-xs ml-1">
                          *
                        </span>{' '}
                      </span>
                      <input
                        type="text"
                        value={formData.first_name}
                        placeholder="Please enter your name"
                        onChange={(e) =>
                          updateFormData('first_name', e.target.value)
                        }
                        className="text-gray-700 mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-orange focus:border-transparent transition-all duration-200"
                      />
                      {errors.first_name && (
                        <p className="text-red-500 text-xs">
                          {errors.first_name}
                        </p>
                      )}
                    </label>
                    <label className="block">
                      <span className="text-gray-700 font-medium text-sm">
                        Phone number
                        <span className="text-red-500 text-xs ml-1">*</span>
                      </span>
                      <input
                        type="tel"
                        maxLength={15}
                        placeholder="+1 (XXX) XXX-XXXX"
                        value={formData.phone_9f17}
                        onChange={(e) =>
                          updateFormData('phone_9f17', e.target.value)
                        }
                        onBlur={(e) => validatePhoneField(e.target.value)}
                        className="text-gray-700 mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-orange focus:border-transparent transition-all duration-200"
                      />
                      <p className="text-[11px] text-gray-400 mt-1">
                        We&apos;ll call to confirm your quote — usually within 2 hours
                      </p>
                      {errors.phone_9f17 && (
                        <p className="text-red-500 text-xs">
                          {errors.phone_9f17}
                        </p>
                      )}
                    </label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="block">
                      <span className="text-gray-700 font-medium text-sm">
                        Email address
                        <span className="text-red-500 text-xs ml-1">
                          *
                        </span>{' '}
                      </span>
                      <input
                        type="text"
                        placeholder="yourname@example.com"
                        value={formData.email_e1ca}
                        onChange={(e) =>
                          updateFormData('email_e1ca', e.target.value)
                        }
                        className="text-gray-700 mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-orange focus:border-transparent transition-all duration-200"
                      />
                      {errors.email_e1ca && (
                        <p className="text-red-500 text-xs">
                          {errors.email_e1ca}
                        </p>
                      )}
                    </label>
                    <div className="flex flex-col gap-2 w-full">
                      <label
                        htmlFor="moving_datetime"
                        className="text-gray-700 font-medium text-sm"
                      >
                        Moving Date & Time
                        <span className="text-red-500 text-xs ml-1">
                          *
                        </span>{' '}
                      </label>
                      {/* <InlineDateTimePicker 
                      value={formData.moving_address_date_and_time}
                      onChange={(val) =>
                        updateFormData('moving_address_date_and_time', val)
                      }
                    /> */}
                      <DateTimePicker
                        value={formData.moving_address_date_and_time}
                        onChange={(val) =>
                          updateFormData('moving_address_date_and_time', val)
                        }
                        placeholder="select moving date and time"
                        inputClassName="w-full pr-10 py-3 rounded-lg border border-gray-300 text-gray-700 dark:text-white focus:border-theme-orange active:border-theme-orange cursor-pointer"
                      />
                      {errors.moving_address_date_and_time && (
                        <p className="text-red-500 text-xs">
                          {errors.moving_address_date_and_time}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex md:flex-row flex-col w-full gap-6">
                    <div className="flex flex-col w-full">
                      <PlaceAutocompleteInput
                        value={formData.moving_address}
                        onPlaceResolved={({ formatted_address }) =>
                          updateFormData('moving_address', formatted_address)
                        }
                        onClear={() => updateFormData('moving_address', '')}
                        placeholder="City / Province"
                        label={
                          !isMovingHelp
                            ? 'Where is the pickup or loading?'
                            : 'Where are you located?'
                        }
                        fieldClassName="rounded-lg border border-gray-300 text-gray-700 dark:text-white focus:border-theme-orange active:border-theme-orange"
                        className="mt-2 block w-full rounded-lg focus:ring-2 focus:ring-theme-orange focus:border-transparent transition-all duration-200"
                        labelClassName="text-gray-700 font-medium text-sm"
                        required={true}
                      />
                      {errors.moving_address && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.moving_address}
                        </p>
                      )}
                    </div>
                    {!isMovingHelp && (
                      <div className="flex flex-col w-full">
                        <PlaceAutocompleteInput
                          value={formData.unloading_address}
                          onPlaceResolved={({ formatted_address }) =>
                            updateFormData('unloading_address', formatted_address)
                          }
                          onClear={() => updateFormData('unloading_address', '')}
                          required={true}
                          placeholder="City / Province"
                          label="Where are you moving to?"
                          fieldClassName="rounded-lg border border-gray-300 text-gray-700 dark:text-white focus:border-theme-orange active:border-theme-orange"
                          className="mt-2 block w-full rounded-lg focus:ring-2 focus:ring-theme-orange focus:border-transparent transition-all duration-200"
                          labelClassName="text-gray-700 font-medium text-sm"
                        />
                        {errors.unloading_address && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.unloading_address}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-4 hidden">
                    <label className="block">
                      <span className="text-gray-700 font-medium">
                        Additional information{' '}
                        <span className="text-gray-500 text-sm">
                          (Optional)
                        </span>
                      </span>
                      <textarea
                        value={formData.additional_info}
                        onChange={(e) =>
                          updateFormData('additional_info', e.target.value)
                        }
                        placeholder="Any special requirements or notes?"
                        rows={3}
                        className="text-gray-700 mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-orange focus:border-transparent transition-all duration-200 resize-none"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col gap-2 items-center justify-center w-full mb-4">
              <p className="text-red-500 text-xs">
                {!isStepValid(currentStep) || !isFetching
                  ? 'please fill all required fields (* marked) to get a quote'
                  : ''}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  currentStep === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <ChevronLeftIcon className="w-5 h-5 mr-2" />
                Previous
              </button>

              {currentStep < 3 ? (
                <>
                  <button
                    onClick={() => handleStepValidation(currentStep)}
                    disabled={!isStepValid(currentStep)}
                    className={`flex items-center px-8 py-3 rounded-lg text-sm md:text-md transition-all duration-200 ${
                      isStepValid(currentStep)
                        ? 'bg-theme-orange text-white hover:bg-orange-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Next
                    <ChevronRightIcon className="w-5 h-5 ml-2" />
                  </button>
                </>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!isStepValid(currentStep) || isSubmitting}
                  className={`flex items-center px-8 py-3 rounded-lg text-sm md:text-md transition-all duration-200 ${
                    isStepValid(currentStep)
                      ? 'bg-theme-orange text-white hover:bg-orange-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <Loader className="w-5 h-5 mr-2" />
                  ) : (
                    'Get Quote'
                  )}
                  <ChevronRightIcon className="w-5 h-5 ml-2" />
                </button>
              )}
            </div>
            {currentStep === 3 && <ConsentText />}
          </div>
        </div>
    </QuotePageShell>
  );
}
