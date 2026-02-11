'use client';

import {
  ChevronRightIcon,
  ChevronLeftIcon,
  TruckIcon,
  HomeIcon,
  MapPinIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import AddressAutocomplete from '@app/components/AddressAutocomplete';
import {
  BoxIcon,
  CheckCircleIcon,
  HandHelping,
  Loader,
  SofaIcon,
} from 'lucide-react';
import PageHeader from '@app/components/Layout/PageHeader';
import DateTimePicker from '@app/components/DateTimePicker/DateTimePicker';
import { useQuotationForm } from '@app/hooks/useQuotationForm';

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
  'Exercise Equipment',
  'Floor runners',
  'Tall Furniture',
  'Heavy Items',
  'Fragile Items',
  'Electronics',
  'Other',
];

export default function QuotationPage() {
  const {
    currentStep,
    formData,
    isCompleted,
    errors,
    isSubmitting,
    isFetching,
    visibleServices,
    updateFormData,
    updateMoveDateTime,
    nextStep,
    prevStep,
    handleSubmit,
    handleStepValidation,
    isStepValid,
  } = useQuotationForm();

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

  return (
    <>
      <PageHeader
        title={`Get a Free Moving Quote`}
        description={`Tell us about your move and get a personalized quote in minutes`}
        className="items-center justify-center"
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        {isCompleted && (
          <>
            <div className="max-w-4xl mx-auto flex flex-col items-center justify-center">
              <div className="flex flex-col items-center justify-center">
                <CheckCircleIcon className="w-12 h-12 text-theme-orange mb-4" />
                <h1 className="font-outfit font-thin lg:text-6xl text-4xl text-black normal-case mb-4 text-center">
                  Thank you for your interest in our services!
                </h1>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto text-center">
                  We will get back to you shortly.
                </p>
              </div>
            </div>
          </>
        )}
        {!isCompleted && (
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            {/* <div className="text-center mb-12"> */}
            {/* <h1 className="font-outfit font-thin lg:text-6xl text-4xl text-black normal-case mb-4">
                Get Your{' '}
                <span className="font-outfit font-bold">Moving Quote</span>
              </h1> */}
            {/* <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Tell us about your move and get a personalized quote in minutes
              </p> */}
            {/* </div> */}

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
              {/* Step 1: Move Type */}
              {currentStep === 1 && !isFetching && (
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
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {move_sizes.map((size) => (
                      <div
                        key={size.id}
                        onClick={() => updateFormData('move_size_str', size.id)}
                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                          formData.move_size_str === size.id
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
                    <p className="text-red-500 text-xs">{errors.move_size_str}</p>
                  )}

                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-gray-700 font-medium">
                        Building type{' '}
                      </span>
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
                        <option value="other">Other</option>
                      </select>
                    </label>
                    {errors.building_type_str && (
                      <p className="text-red-500 text-xs">
                        {errors.building_type_str}
                      </p>
                    )}

                    <div>
                      <span className="text-gray-700 font-medium block mb-3">
                        Special items{' '}
                        <span className="text-gray-500 text-sm">
                          (Optional)
                        </span>
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
                            <span className="text-sm text-gray-700">
                              {item}
                            </span>
                          </label>
                        ))}
                      </div>
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
                      <span className="text-gray-700 font-medium">
                        First name{' '}
                      </span>
                      <input
                        type="text"
                        value={formData.first_name}
                        placeholder="please enter your first name"
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
                      <span className="text-gray-700 font-medium">
                        Last name{' '}
                      </span>
                      <input
                        type="text"
                        placeholder="please enter your last name"
                        value={formData.last_name}
                        onChange={(e) =>
                          updateFormData('last_name', e.target.value)
                        }
                        className="text-gray-700 mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-orange focus:border-transparent transition-all duration-200"
                      />
                      {errors.last_name && (
                        <p className="text-red-500 text-xs">
                          {errors.last_name}
                        </p>
                      )}
                    </label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="block">
                      <span className="text-gray-700 font-medium">
                        Phone number{' '}
                      </span>
                      <input
                        type="text"
                        placeholder="please enter your phone number"
                        value={formData.phone_9f17}
                        onChange={(e) =>
                          updateFormData('phone_9f17', e.target.value)
                        }
                        className="text-gray-700 mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-orange focus:border-transparent transition-all duration-200"
                      />
                      {errors.phone_9f17 && (
                        <p className="text-red-500 text-xs">
                          {errors.phone_9f17}
                        </p>
                      )}
                    </label>
                    <label className="block">
                      <span className="text-gray-700 font-medium">
                        Email address
                      </span>
                      <input
                        type="text"
                        placeholder="please enter your email address"
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
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <AddressAutocomplete
                        value={formData.moving_address}
                        onChange={(address) =>
                          updateFormData('moving_address', address)
                        }
                        placeholder="please enter your loading address"
                        label="Loading address"
                        fieldClassName="rounded-lg  border border-gray-300 text-gray-700 dark:text-white focus:border-theme-orange active:border-theme-orange"
                        className="mt-2 block w-full  rounded-lg focus:ring-2 focus:ring-theme-orange focus:border-transparent transition-all duration-200"
                        labelClassName="text-gray-700 font-medium"
                      />
                      {errors.moving_address && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.moving_address}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <AddressAutocomplete
                        value={formData.unloading_address}
                        onChange={(address) =>
                          updateFormData('unloading_address', address)
                        }
                        placeholder="please enter your unloading address"
                        label="Unloading address"
                        fieldClassName="rounded-lg  border border-gray-300 text-gray-700 dark:text-white focus:border-theme-orange active:border-theme-orange"
                        className="mt-2 block w-full rounded-lg focus:ring-2 focus:ring-theme-orange focus:border-transparent transition-all duration-200"
                        labelClassName="text-gray-700 font-medium"
                      />
                      {errors.unloading_address && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.unloading_address}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 w-full mt-4">
                    <label
                      htmlFor="moving_datetime"
                      className="text-gray-700 font-medium"
                    >
                      Moving Date & Time<span className=""></span>
                    </label>
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
                <button
                  onClick={() => handleStepValidation(currentStep)}
                  disabled={!isStepValid(currentStep)}
                  className={`flex items-center px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isStepValid(currentStep)
                      ? 'bg-theme-orange text-white hover:bg-orange-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Next
                  <ChevronRightIcon className="w-5 h-5 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!isStepValid(currentStep) || isSubmitting}
                  className={`flex items-center px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
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
          </div>
        )}
      </div>
    </>
  );
}
