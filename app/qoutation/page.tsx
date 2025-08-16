'use client';

import { useState } from 'react';
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  TruckIcon,
  HomeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { useWixServices } from '@app/hooks/useWixServices';
import AddressAutocomplete from '@app/components/AddressAutocomplete';
import { CheckCircleIcon, Loader } from 'lucide-react';

interface FormData {
  // Step 1: Move Type
  moveType: string;
  moveCategory: string;

  // Step 2: Move Size
  moveSize: string;
  rooms: string;
  specialItems: string[];

  // Step 3: Location & Details
  pickupAddress: string;
  destinationAddress: string;
  moveDate: string;
  additionalInfo: string;
  buildingType: string;
  moveTime: string;
  contactDetails: string;
}

const moveTypes = [
  {
    id: 'residential',
    label: 'Residential Move',
    icon: HomeIcon,
    description: 'Moving from one home to another',
  },
  {
    id: 'commercial',
    label: 'Commercial Move',
    icon: TruckIcon,
    description: 'Office or business relocation',
  },
  {
    id: 'storage',
    label: 'Storage Move',
    icon: MapPinIcon,
    description: 'Moving items to or from storage',
  },
];

const moveSizes = [
  {
    id: 'small',
    label: 'Small Move',
    description: 'Studio/1 bedroom',
    items: 'Up to 10 items',
  },
  {
    id: 'medium',
    label: 'Medium Move',
    description: '2-3 bedrooms',
    items: '10-25 items',
  },
  {
    id: 'large',
    label: 'Large Move',
    description: '4+ bedrooms',
    items: '25+ items',
  },
];

const specialItems = [
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
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    moveType: '',
    moveCategory: '',
    moveSize: '',
    rooms: '',
    specialItems: [],
    pickupAddress: '',
    destinationAddress: '',
    moveDate: '',
    additionalInfo: '',
    buildingType: '',
    moveTime: '',
    contactDetails: '',
  });
  const [isCompleted, setIsCompleted] = useState(false);
  const [formHasError, setFormHasError] = useState<boolean>(false);
  const { services, isLoading, error } = useWixServices();

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    setIsCompleted(true);
    // Handle form submission here
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.moveType && formData.moveCategory;
      case 2:
        return formData.moveSize;
      case 3:
        return (
          formData.pickupAddress &&
          formData.destinationAddress &&
          isEmailOrPhone(formData.contactDetails)
        );
      default:
        return false;
    }
  };

  const isEmailOrPhone = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || /^\d{10}$/.test(value);
  };

  return (
    <>
      <div className="w-full bg-[#D9D9D9] lg:h-[338px] pt-32 px-4 sm:px-6 lg:px-20 py-10 lg:py-auto"></div>
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
                  We will get back to you as soon as possible.
                </p>
              </div>
            </div>
          </>
        )}
        {!isCompleted && (
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="font-outfit font-thin lg:text-6xl text-4xl text-black normal-case mb-4">
                Get Your{' '}
                <span className="font-outfit font-bold">Moving Quote</span>
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Tell us about your move and get a personalized quote in minutes
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-12 w-full relative z-1000 ">
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
                  Location Details
                </span>
              </div>
            </div>

            {/* Form Container */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              {/* Step 1: Move Type */}
              {currentStep === 1 && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center">
                    <h2 className="text-2xl font-outfit font-semibold text-gray-900 mb-2">
                      How would you like to move?
                    </h2>
                    <p className="text-gray-600">
                      Select the service type that best describes your move
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {moveTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <div
                          key={type.id}
                          onClick={() => updateFormData('moveType', type.id)}
                          className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                            formData.moveType === type.id
                              ? 'border-theme-orange bg-orange-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-center">
                            <Icon
                              className={`w-12 h-12 mx-auto mb-4 ${
                                formData.moveType === type.id
                                  ? 'text-theme-orange'
                                  : 'text-gray-400'
                              }`}
                            />
                            <h3 className="font-outfit font-semibold text-lg text-gray-900 mb-2">
                              {type.label}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {type.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-gray-700 font-outfit font-light">
                        Service Type
                      </span>
                      {isLoading ? (
                        <Loader className="w-5 h-5 animate-spin text-theme-orange" />
                      ) : error ? (
                        <p className="text-red-500">Error loading services</p>
                      ) : (
                        <select
                          value={formData.moveCategory}
                          onChange={(e) =>
                            updateFormData('moveCategory', e.target.value)
                          }
                          className="text-gray-700 mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-orange focus:border-transparent transition-all duration-200"
                        >
                          <option value="">Select service type</option>
                          {services?.map((service) => (
                            <option key={service.id} value={service.id}>
                              {service.info?.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </label>
                  </div>
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
                    {moveSizes.map((size) => (
                      <div
                        key={size.id}
                        onClick={() => updateFormData('moveSize', size.id)}
                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                          formData.moveSize === size.id
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

                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-gray-700 font-medium">
                        Building Type{' '}
                        <span className="text-gray-500 text-sm">
                          (optional)
                        </span>
                      </span>
                      <select
                        value={formData.buildingType}
                        onChange={(e) =>
                          updateFormData('buildingType', e.target.value)
                        }
                        className="text-gray-700 mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-orange focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Select building type</option>
                        <option value="apartment">Apartment</option>
                        <option value="dormitory">Dormitory</option>
                        <option value="house">House</option>
                        <option value="office">Office</option>
                        <option value="condo">Condo</option>
                        <option value="other">Other</option>
                      </select>
                    </label>
                    {/* <label className="block">
                                            <span className="text-gray-700 font-medium">Number of Rooms</span>
                                            <select
                                                value={formData.rooms}
                                                onChange={(e) => updateFormData('rooms', e.target.value)}
                                                className="text-gray-700 mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-orange focus:border-transparent transition-all duration-200"
                                            >
                                                <option value="">Select number of rooms</option>
                                                <option value="1">1 Room</option>
                                                <option value="2">2 Rooms</option>
                                                <option value="3">3 Rooms</option>
                                                <option value="4">4 Rooms</option>
                                                <option value="5+">5+ Rooms</option>
                                            </select>
                                        </label> */}

                    <div>
                      <span className="text-gray-700 font-medium block mb-3">
                        Special Items{' '}
                        <span className="text-gray-500 text-sm">
                          (Optional)
                        </span>
                      </span>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {specialItems.map((item) => (
                          <label
                            key={item}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={formData.specialItems.includes(item)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  updateFormData('specialItems', [
                                    ...formData.specialItems,
                                    item,
                                  ]);
                                } else {
                                  updateFormData(
                                    'specialItems',
                                    formData.specialItems.filter(
                                      (i) => i !== item
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
                      Where and when?
                    </h2>
                    <p className="text-gray-600">
                      Tell us about your loading and unloading address
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AddressAutocomplete
                      value={formData.pickupAddress}
                      onChange={(address) =>
                        updateFormData('pickupAddress', address)
                      }
                      placeholder="Enter the loading address"
                      label="Loading Address"
                      className="mt-2 block w-full  rounded-lg focus:ring-2 focus:ring-theme-orange focus:border-transparent transition-all duration-200"
                    />

                    <AddressAutocomplete
                      value={formData.destinationAddress}
                      onChange={(address) =>
                        updateFormData('destinationAddress', address)
                      }
                      placeholder="Enter the unloading address"
                      label="Unloading Address"
                      className="mt-2 block w-full rounded-lg focus:ring-2 focus:ring-theme-orange focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="block">
                      <span className="text-gray-700 font-medium">
                        Estimated Move Date{' '}
                        <span className="text-gray-500 text-sm">
                          (Optional)
                        </span>
                      </span>
                      <input
                        type="date"
                        value={formData.moveDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) =>
                          updateFormData('moveDate', e.target.value)
                        }
                        className="text-gray-700 mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-orange focus:border-transparent transition-all duration-200"
                      />
                    </label>
                    <label className="block">
                      <span className="text-gray-700 font-medium">
                        Contact Information
                      </span>
                      <input
                        type="text"
                        placeholder="Enter your email or phone number"
                        value={formData.contactDetails}
                        onChange={(e) =>
                          updateFormData('contactDetails', e.target.value)
                        }
                        className="text-gray-700 mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-orange focus:border-transparent transition-all duration-200"
                      />
                    </label>
                  </div>
                  <div className="flex flex-col gap-4">
                    <label className="block">
                      <span className="text-gray-700 font-medium">
                        Additional Information{' '}
                        <span className="text-gray-500 text-sm">
                          (Optional)
                        </span>
                      </span>
                      <textarea
                        value={formData.additionalInfo}
                        onChange={(e) =>
                          updateFormData('additionalInfo', e.target.value)
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
                  onClick={nextStep}
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
                  onClick={() => {
                    handleSubmit();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={!isStepValid(currentStep)}
                  className={`flex items-center px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isStepValid(currentStep)
                      ? 'bg-theme-orange text-white hover:bg-orange-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Get Quote
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
