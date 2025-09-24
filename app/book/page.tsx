'use client';

import {
  ChevronRightIcon,
  ChevronLeftIcon,
  HomeIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import {
  BoxIcon,
  CheckCircleIcon,
  HandHelping,
  Loader,
  SofaIcon,
} from 'lucide-react';
import PageHeader from '@app/components/Layout/PageHeader';
import { useQuotationForm } from '@app/hooks/useQuotationForm';
import { useBookingCollection } from '@app/hooks/booking/useBookingCollection';
import { useBookingForm } from '@app/hooks/booking/useBookingForm';
import BookingStep2 from '@app/components/Booking/BookingStep2';
import BookingStep3 from '@app/components/Booking/BookingStep3';
import BookingStep1 from '@app/components/Booking/BookingStep1';
import BookingStep5 from '@app/components/Booking/BookingStep5';
import BookingProgress from '@app/components/Booking/BookingProgress';
import BookingStep4 from '@app/components/Booking/BookingStep4';
import { addons, special_items, items } from '@app/book/BookingProps';
import { getIconFromKey, getIconForService } from '@app/book/IconProps';

export type IconType = typeof HomeIcon; // compatible with your current usage

/**
 * Page
 * @returns {JSX.Element} - The page
 */
export default function Page() {
  const {
    currentStep,
    formData,
    isCompleted,
    errors,
    // isSubmitting,
    // isFetching,
    // visibleServices,
    updateFormData,
    nextStep,
    prevStep,
    // handleSubmit,
    // handleStepValidation,
    isStepValid,
    onClickHasElevator,
    handleStepValidation,
  } = useBookingForm();

  const { visibleServices, isFetching, isSubmitting } = useQuotationForm();

  type IconType = typeof HomeIcon;

  /**
   * iconByKeyword
   */
  const iconByKeyword: Record<string, IconType> = {
    residential: HomeIcon,
    commercial: BuildingOfficeIcon,
    moving: HandHelping,
    furniture: SofaIcon,
    warehousing: HomeIcon,
    packing: BoxIcon,
    unpacking: BoxIcon,
  };

  /**
   * building_type
   */
  const building_type = useBookingCollection({
    collectionName: 'BuildingTypes',
    queryKey: 'building-types-items',
  });

  /**
   * service_rates
   */
  const service_rates = useBookingCollection({
    collectionName: 'ServiceRates',
    queryKey: 'service-rates-items',
    include: 'parentService',
  });

  /**
   * fees
   */
  const fees = useBookingCollection({
    collectionName: 'Fees',
    queryKey: 'fees-items-100',
    include: 'buildingType',
  });

  console.log(service_rates.data, fees.data);

  /**
   * Page
   * @returns {JSX.Element} - The page
   */
  return (
    <>
      <PageHeader
        title={`Book a Move`}
        description={`Schedule your move `}
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

            {/* Progress Bar */}
            <BookingProgress currentStep={currentStep} />

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
                <BookingStep1
                  formData={formData}
                  errors={errors}
                  updateFormData={updateFormData as any}
                  visibleServices={visibleServices}
                  getIconForService={getIconForService}
                />
              )}

              {/* Step 2: Move Size */}
              {currentStep === 2 && (
                <BookingStep2
                  formData={formData}
                  errors={errors}
                  updateFormData={updateFormData as any}
                  building_type={building_type}
                  getIconFromKey={getIconFromKey}
                  onClickHasElevator={onClickHasElevator}
                />
              )}
              {/* Step 3: Location & Details */}
              {currentStep === 3 && (
                <BookingStep3
                  formData={formData}
                  errors={errors}
                  updateFormData={updateFormData as any}
                  building_type={building_type}
                  getIconFromKey={getIconFromKey}
                  onClickHasElevator={onClickHasElevator}
                />
              )}
              {currentStep === 4 && (
                <BookingStep4
                  items={special_items as any}
                  formData={formData}
                  errors={errors}
                  updateFormData={updateFormData as any}
                  addons={addons as any}
                />
              )}
              {/* Step 5: Location & Details */}
              {currentStep === 5 && (
                <BookingStep5
                  formData={formData}
                  errors={errors}
                  updateFormData={updateFormData as any}
                />
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

              {currentStep < 5 ? (
                <button
                  onClick={() => {
                    nextStep();
                  }}
                  // onClick={() => handleStepValidation(currentStep)}
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
                  // onClick={() => { }}
                  onClick={() => {
                    handleStepValidation(currentStep);
                  }}
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
                    'Checkout'
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
