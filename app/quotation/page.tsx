'use client';

import { useEffect, useState } from 'react';
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  TruckIcon,
  HomeIcon,
  MapPinIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import { useWixServices } from '@app/hooks/useWixServices';
import AddressAutocomplete from '@app/components/AddressAutocomplete';
import {
  BoxIcon,
  CheckCircleIcon,
  HandHelping,
  Loader,
  SofaIcon,
} from 'lucide-react';
import { useForms } from '@app/hooks/useForms';
import { normalizePhoneE164 } from '@app/utils/format-phone';
import formId from '@app/hooks/useForms';
import PageHeader from '@app/components/Layout/PageHeader';

interface FormData {
  // Step 1: Move Type
  first_name: string;
  last_name: string;
  service_type: string;
  moveCategory: string;

  // Step 2: Move Size
  move_size: string;
  rooms: string;
  special_items: string[];

  // Step 3: Location & Details
  moving_address: string;
  unloading_address: string;
  move_date: string;
  additional_info?: string;
  building_type: string;
  move_time: string;
  email_e1ca: string;
  phone_9f17: string;
  moving_address_date_and_time: string;
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
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    service_type: '',
    moveCategory: '',
    move_size: '',
    rooms: '',
    special_items: [],
    moving_address: '',
    unloading_address: '',
    move_date: '',
    additional_info: '',
    building_type: '',
    move_time: '',
    email_e1ca: '',
    phone_9f17: '',
    moving_address_date_and_time: '',
  });
  const [isCompleted, setIsCompleted] = useState(false);
  const [formHasError, setFormHasError] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const { services, isLoading, error } = useWixServices();
  const visibleServices = (services ?? []).filter((s) => !s.hidden);
  const [formId, setFormId] = useState<string | null>(
    process.env.NEXT_PUBLIC_WIX_FORM_ID || ''
  );
  const { submit, isSubmitting, error: formError } = useForms(formId || '');
  const [serviceTypes, setServiceTypes] = useState<any[]>([]);
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

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if ((errors as any)[field]) {
      const { [field]: _removed, ...rest } = errors as Record<string, string>;
      setErrors(rest as Partial<Record<keyof FormData, string>>);
    }
  };

  const updateMoveDateTime = (
    field: 'move_date' | 'move_time',
    value: string
  ) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      const hasDate = Boolean(next.move_date);
      const hasTime = Boolean(next.move_time);
      if (hasDate && hasTime) {
        const localString = `${next.move_date}T${next.move_time}`;
        next.moving_address_date_and_time = localString;
      } else {
        next.moving_address_date_and_time = '';
      }
      return next;
    });
    if (
      errors.move_date ||
      errors.move_time ||
      errors.moving_address_date_and_time
    ) {
      const { move_date, move_time, moving_address_date_and_time, ...rest } =
        errors;
      setErrors(rest);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    try {
      await onSubmit(formData);
      setIsCompleted(true);
    } catch (e) {
      console.error(e);
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return Boolean(formData.service_type);
      case 2:
        return Boolean(formData.move_size && formData.building_type);
      case 3:
        return (
          formData.moving_address &&
          formData.unloading_address &&
          formData.first_name &&
          formData.last_name &&
          formData.email_e1ca &&
          formData.phone_9f17 &&
          formData.moving_address_date_and_time
          // isEmailOrPhone(formData.email_e1ca)
        );
      default:
        return false;
    }
  };

  const isEmailOrPhone = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || /^\d{10}$/.test(value);
  };

  // Only send known Wix field IDs to avoid "additional properties" errors
  const allowedWixFieldIds: Array<keyof FormData> = [
    'first_name',
    'last_name',
    'email_e1ca',
    'phone_9f17',
    'service_type',
    'move_size',
    'moving_address',
    'unloading_address',
    'building_type',
    'special_items',
    'moving_address_date_and_time',
  ];

  function validateForm(data: FormData) {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!data.service_type || !data.service_type.trim()) {
      newErrors.service_type = 'Please select a service';
    }
    if (!data.move_size || !data.move_size.trim()) {
      newErrors.move_size = 'Please select move size';
    }
    if (!data.building_type || !data.building_type.trim()) {
      newErrors.building_type = 'Please select building type';
    }

    if (!data.first_name || !data.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    if (!data.last_name || !data.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    if (!data.email_e1ca || !data.email_e1ca.trim()) {
      newErrors.email_e1ca = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(data.email_e1ca)) {
      newErrors.email_e1ca = 'Enter a valid email address';
    }
    const digits = (data.phone_9f17 || '').replace(/\D/g, '');
    if (!digits) {
      newErrors.phone_9f17 = 'Phone number is required';
    } else if (digits.length < 10) {
      newErrors.phone_9f17 = 'Enter a valid phone number';
    }

    if (!data.moving_address || !data.moving_address.trim()) {
      newErrors.moving_address = 'Pickup location is required';
    }
    if (!data.unloading_address || !data.unloading_address.trim()) {
      newErrors.unloading_address = 'Final destination is required';
    }

    if (
      !data.moving_address_date_and_time ||
      !data.moving_address_date_and_time.trim()
    ) {
      newErrors.moving_address_date_and_time =
        'Moving date and time is required';
    } else {
      const parsed = new Date(data.moving_address_date_and_time);
      if (isNaN(parsed.getTime())) {
        newErrors.moving_address_date_and_time = 'Enter a valid date and time';
      }
    }

    return newErrors;
  }

  async function onSubmit(data: FormData) {
    if (!formId) throw new Error('Form ID not resolved yet');
    const sanitized: Record<string, any> = {};
    for (const key of allowedWixFieldIds) {
      const value = data[key];
      if (value !== undefined && value !== null && value !== '') {
        if (key === 'phone_9f17') {
          sanitized[key] = normalizePhoneE164(String(value));
        } else if (key === 'moving_address_date_and_time') {
          sanitized[key] = new Date(String(value)).toISOString();
        } else {
          sanitized[key] = value;
        }
      }
    }
    return submit(sanitized);
  }

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

                  {/* <div className="space-y-4">
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
                          {visibleServices?.map((service) => (
                            <option key={service.id} value={service.id}>
                              {service.info?.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </label>
                  </div> */}
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
                        onClick={() => updateFormData('move_size', size.id)}
                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                          formData.move_size === size.id
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
                  {errors.move_size && (
                    <p className="text-red-500 text-xs">{errors.move_size}</p>
                  )}

                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-gray-700 font-medium">
                        Building type{' '}
                      </span>
                      <select
                        value={formData.building_type}
                        onChange={(e) =>
                          updateFormData('building_type', e.target.value)
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
                    {errors.building_type && (
                      <p className="text-red-500 text-xs">
                        {errors.building_type}
                      </p>
                    )}
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
                              checked={formData.special_items.includes(item)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  updateFormData('special_items', [
                                    ...formData.special_items,
                                    item,
                                  ]);
                                } else {
                                  updateFormData(
                                    'special_items',
                                    formData.special_items.filter(
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
                        placeholder="Enter your first name"
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
                        placeholder="Enter your last name"
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
                        placeholder="Enter your phone number"
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
                        placeholder="Enter your email address"
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
                        placeholder="Enter the loading address"
                        label="Loading address"
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
                        placeholder="Enter the unloading address"
                        label="Unloading address"
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="block">
                      <span className="text-gray-700 font-medium">
                        Moving date
                      </span>
                      <input
                        type="date"
                        value={formData.move_date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) =>
                          updateMoveDateTime('move_date', e.target.value)
                        }
                        className="text-gray-700 mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-orange focus:border-transparent transition-all duration-200"
                      />
                      {(errors.move_date ||
                        errors.moving_address_date_and_time) && (
                        <p className="text-red-500 text-xs">
                          {errors.move_date ||
                            errors.moving_address_date_and_time}
                        </p>
                      )}
                    </label>
                    <label className="block">
                      <span className="text-gray-700 font-medium">
                        Moving time
                      </span>
                      <input
                        type="time"
                        value={formData.move_time}
                        onChange={(e) =>
                          updateMoveDateTime('move_time', e.target.value)
                        }
                        className="text-gray-700 mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-orange focus:border-transparent transition-all duration-200"
                      />
                      {(errors.move_time ||
                        errors.moving_address_date_and_time) && (
                        <p className="text-red-500 text-xs">
                          {errors.move_time ||
                            errors.moving_address_date_and_time}
                        </p>
                      )}
                    </label>
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
                  onClick={() => {
                    const validationErrors = validateForm(formData);
                    if (currentStep === 1) {
                      const stepErrors: Partial<
                        Record<keyof FormData, string>
                      > = {};
                      if (validationErrors.service_type)
                        stepErrors.service_type = validationErrors.service_type;
                      setErrors(stepErrors);
                      if (!validationErrors.service_type)
                        setCurrentStep(currentStep + 1);
                      return;
                    }
                    if (currentStep === 2) {
                      const stepErrors: Partial<
                        Record<keyof FormData, string>
                      > = {};
                      if (validationErrors.move_size)
                        stepErrors.move_size = validationErrors.move_size;
                      if (validationErrors.building_type)
                        stepErrors.building_type =
                          validationErrors.building_type;
                      setErrors(stepErrors);
                      if (
                        !validationErrors.move_size &&
                        !validationErrors.building_type
                      )
                        setCurrentStep(currentStep + 1);
                      return;
                    }
                  }}
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
