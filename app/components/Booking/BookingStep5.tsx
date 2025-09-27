'use client';

import { FormData } from '../../hooks/booking/useBookingForm';
import { useEnhancedPricing } from '../../hooks/booking/useEnhancedPricing';
import PricingBreakdown from './PricingBreakdown';
import BillingAddress from './BillingAddress';
import { useSearchParams } from 'next/navigation';
import {
  MapPin,
  Building2,
  ArrowUpDown,
  MoveVertical,
  Calendar,
  Phone,
  Mail,
  User,
  MessageSquare,
  ArrowLeft,
} from 'lucide-react';
import { formatDateForDisplay } from '@app/utils/wix-date-converter';

/**
 * BookingStep5Props interface
 * @param formData - The form data
 * @param errors - The errors
 * @param updateFormData - The function to update the form data
 */
export interface BookingStep5Props {
  formData: FormData;
  errors: any;
  updateFormData: (field: string, value: any) => void;
  gotoStep: (step: number) => void;
  isRelocationService: () => boolean;
}

/**
 * SummaryCardProps interface
 * @param icon - The icon
 * @param label - The label
 * @param value - The value
 * @param className - The class name
 */
interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  className?: string;
}

/**
 * SummaryCard component
 * @param icon - The icon
 * @param label - The label
 * @param value - The value
 * @param className - The class name
 */
const SummaryCard = ({
  icon,
  label,
  value,
  className = '',
}: SummaryCardProps) => (
  <div
    className={`flex items-center space-x-1 p-2 bg-white rounded-lg border border-gray-200 ${className}`}
  >
    <div className="text-theme-orange">{icon}</div>
    <div className="flex-1 min-w-0">
      <small className="text-xs text-gray-500">{label}</small>
      <p className="text-xs font-outfit font-semibold text-gray-900 truncate">
        {value}
      </p>
    </div>
  </div>
);

/**
 * LocationSummaryProps interface
 * @param title - The title
 * @param address - The address
 * @param buildingType - The building type
 * @param hasElevator - The has elevator
 * @param stairsCount - The stairs count
 */
interface LocationSummaryProps {
  title: string;
  address: string;
  buildingType: string;
  hasElevator?: string;
  stairsCount?: number | string;
}

/**
 * LocationSummary component
 * @param title - The title
 * @param address - The address
 * @param buildingType - The building type
 * @param hasElevator - The has elevator
 * @param stairsCount - The stairs count
 */
const LocationSummary = ({
  title,
  address,
  buildingType,
  hasElevator,
  stairsCount,
}: LocationSummaryProps) => (
  <div className="bg-white space-y-1 p-1">
    <small className="text-xs font-outfit font-semibold text-gray-900 my-4">
      {title}
    </small>
    <div className="space-y-2">
      <SummaryCard
        icon={<MapPin className="w-5 h-5" />}
        label="Address"
        value={address}
      />
      <SummaryCard
        icon={<Building2 className="w-5 h-5" />}
        label="Building Type"
        value={buildingType}
      />
      {buildingType === 'Apartment' && (
        <>
          <div className="flex flex-row gap-2 w-full">
            <SummaryCard
              icon={<ArrowUpDown className="w-5 h-5" />}
              label="Elevator Available"
              value={hasElevator?.toUpperCase() || 'N/A'}
              className="w-1/2"
            />
            <SummaryCard
              icon={<MoveVertical className="w-5 h-5" />}
              label="Flight of Stairs"
              value={stairsCount || 'N/A'}
              className="w-1/2"
            />
          </div>
        </>
      )}
    </div>
  </div>
);

/**
 * BookingStep5 component
 * @param formData - The form data
 * @param errors - The errors
 * @param updateFormData - The function to update the form data
 */
const BookingStep5 = ({
  formData,
  errors,
  updateFormData,
  gotoStep,
  isRelocationService,
}: BookingStep5Props) => {
  // Get search params to check for 'all' parameter
  const searchParams = useSearchParams();
  // const allSuggestions = searchParams.get('all') === 'true';
  const allSuggestions = true;

  // Use enhanced pricing system
  const {
    calculatedPricing,
    isLoading: pricingLoading,
    error: pricingError,
    availableMoverCounts,
    minimumHours,
    maximumHours,
  } = useEnhancedPricing(formData);

  // Handle mover count change
  const handleMoverCountChange = (count: number) => {
    updateFormData('mover_count', count);
  };

  // Handle hours change
  const handleHoursChange = (hours: number) => {
    updateFormData('selected_hours', hours);
  };

  // Show loading state
  if (pricingLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-orange"></div>
        <p className="mt-4 text-gray-600">Loading pricing information...</p>
      </div>
    );
  }

  // Show error state
  if (pricingError) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-red-600 mb-4">
          Error loading pricing: {pricingError as string}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-theme-orange text-white rounded-lg hover:bg-orange-600"
        >
          Retry
        </button>
      </div>
    );
  }
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Booking Summary Section */}
      <div className="flex lg:flex-row flex-col gap-6">
        <div className="flex flex-col gap-1 lg:w-[40%] w-full">
          <div className="flex flex-row gap-2 justify-between">
            <div className="text-left mb-0">
              <h2 className="text-xs font-outfit font-semibold text-gray-900 mb-2">
                Booking Summary
              </h2>
              <p className="text-gray-600 text-xs">
                Review your booking details below
              </p>
            </div>
          </div>
          {/* Service Details */}
          <div className="space-y-1">
            {/* <div className="bg-white rounded-xl border border-gray-200 p-4"> */}
            {/* <small className="text-xs font-outfit font-light  text-gray-400">Selected Service & Moving Date & Time</small> */}
            <div className="space-y-2">
              <SummaryCard
                icon={<Calendar className="w-5 h-5" />}
                label="Moving Date & Time"
                value={
                  formData.moving_address_date_and_time
                    ? formatDateForDisplay(
                        new Date(formData.moving_address_date_and_time)
                      )
                    : 'Not set'
                }
              />
              <SummaryCard
                icon={<MapPin className="w-5 h-5" />}
                label="Service Type"
                value={formData.service_type}
              />
            </div>
            {/* </div> */}

            {/* Pickup Location */}
            <LocationSummary
              title={
                !isRelocationService()
                  ? 'Pickup Location'
                  : 'Address Information'
              }
              address={formData.pickup_address}
              buildingType={formData.pickup_building_type}
              hasElevator={formData.has_elevator}
              stairsCount={formData.stairs_count || 0}
            />
          </div>

          {/* Destination & Contact */}
          {!isRelocationService() && (
            <div className="space-y-4">
              {/* Destination Location */}
              <LocationSummary
                title="Destination Location"
                address={formData.destination_address}
                buildingType={formData.destination_building_type}
                hasElevator={formData.destination_has_elevator}
                stairsCount={formData.destination_stairs_count || 0}
              />
            </div>
          )}
          <div className="mt-4"></div>
          <button
            onClick={() => gotoStep(2)}
            className="flex flex-row gap-2 border border-theme-orange bg-theme-orange hover:bg-orange-600 hover:text-white rounded-lg p-2 text-xs font-outfit font-semibold text-white mb-2"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
            Edit Booking
          </button>
        </div>

        <div className="w-full border border-gray-200 rounded-lg p-4">
          <div className="text-center mb-6 mt-4">
            <h2 className="text-2xl font-outfit font-semibold text-gray-900 mb-2">
              Proceed to Checkout
            </h2>

            <p className="text-gray-600">
              Please provide your contact information
            </p>
          </div>

          {/* Enhanced Pricing Breakdown */}
          {calculatedPricing && (
            <PricingBreakdown
              pricing={calculatedPricing}
              formData={formData}
              onHoursChange={handleHoursChange}
              onMoverCountChange={handleMoverCountChange}
              availableMoverCounts={availableMoverCounts}
              minimumHours={minimumHours}
              maximumHours={maximumHours}
            />
          )}

          <div className="text-center mb-6 mt-4">
            <h4 className="text-xs font-outfit font-semibold text-gray-900 mb-2 text-left">
              Billing Information
            </h4>
            <p className="text-gray-600 text-xs"></p>
          </div>
          <div className="flex lg:flex-row flex-col gap-2 w-full">
            <div className="flex flex-col gap-0 w-full">
              <label className="block">
                <span className="text-gray-700 text-xs flex items-center gap-2">
                  <User className="w-3 h-3" />
                  First Name
                </span>
              </label>
              <input
                type="text"
                value={formData.first_name}
                placeholder="Enter your first name"
                onChange={(e) => updateFormData('first_name', e.target.value)}
                className="mt-1.5 block w-full px-2 text-sm py-2 rounded-md border border-gray-300 text-gray-700 focus:ring-2 focus:ring-theme-orange focus:border-transparent transition-all duration-200"
              />
              {errors.first_name && (
                <p className="mt-1 text-red-500 text-xs">{errors.first_name}</p>
              )}
            </div>

            <div className="flex flex-col gap-0 w-full">
              <label className="block">
                <span className="text-gray-700 text-xs flex items-center gap-2">
                  <User className="w-3 h-3" />
                  Last Name
                </span>
              </label>
              <input
                type="text"
                value={formData.last_name}
                placeholder="Enter your last name"
                onChange={(e) => updateFormData('last_name', e.target.value)}
                className="mt-1.5 block w-full px-2 text-sm py-2 rounded-md border border-gray-300 text-gray-700 focus:ring-2 focus:ring-theme-orange focus:border-transparent transition-all duration-200"
              />
              {errors.last_name && (
                <p className="mt-1 text-red-500 text-xs">{errors.last_name}</p>
              )}
              {/* </label> */}
            </div>
          </div>
          <div className="flex lg:flex-row flex-col gap-2 w-full mt-4">
            <div className="flex flex-col gap-0 w-full">
              <label className="text-gray-700 text-xs flex items-center gap-2">
                <Phone className="w-3 h-3" />
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone_9f17}
                placeholder="Enter your phone number"
                onChange={(e) => updateFormData('phone_9f17', e.target.value)}
                className="mt-1.5 block w-full px-2 text-sm py-2 rounded-md border border-gray-300 text-gray-700 focus:ring-2 focus:ring-theme-orange focus:border-transparent transition-all duration-200"
              />
              {errors.phone_9f17 && (
                <p className="mt-1 text-red-500 text-xs">{errors.phone_9f17}</p>
              )}
            </div>

            <div className="flex flex-col gap-0 w-full">
              <label className="text-gray-700 text-xs flex items-center gap-2">
                <Mail className="w-3 h-3" />
                Email Address
              </label>
              <input
                type="email"
                value={formData.email_e1ca}
                placeholder="Enter your email address"
                onChange={(e) => updateFormData('email_e1ca', e.target.value)}
                className="mt-1.5 block w-full px-2 text-sm py-2 rounded-md border border-gray-300 text-gray-700 focus:ring-2 focus:ring-theme-orange focus:border-transparent transition-all duration-200"
              />
              {errors.email_e1ca && (
                <p className="mt-1 text-red-500 text-xs">{errors.email_e1ca}</p>
              )}
            </div>
          </div>

          {/* Billing Address Section */}
          <BillingAddress
            formData={formData}
            errors={errors}
            updateFormData={updateFormData}
            all={allSuggestions}
          />

          <div className="mt-6">
            <label className="block">
              <span className="text-gray-700 text-xs flex items-center gap-2">
                <MessageSquare className="w-3 h-3" />
                Additional Information
                <span className="text-gray-500 text-sm">(Optional)</span>
              </span>
              <textarea
                value={formData.additional_info}
                onChange={(e) =>
                  updateFormData('additional_info', e.target.value)
                }
                placeholder="Any special requirements or notes?"
                rows={3}
                className="mt-2 block w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-theme-orange focus:border-transparent transition-all duration-200 resize-none"
              />
            </label>
          </div>

          {/* Checkout Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              className="w-full bg-theme-orange hover:bg-orange-600 text-white font-outfit font-semibold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Proceed to Payment - $
              {calculatedPricing?.finalTotal.toFixed(2) || '0.00'}
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              You will be redirected to our secure payment processor
            </p>
          </div>
        </div>
      </div>

      {/* Contact Details Section */}
    </div>
  );
};

export default BookingStep5;
