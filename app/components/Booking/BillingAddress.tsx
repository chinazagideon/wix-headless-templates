'use client';

import { FormData } from '../../hooks/booking/useBookingForm';
import AddressAutocomplete from '../AddressAutocomplete';
import { MapPin } from 'lucide-react';

/**
 * BillingAddressProps interface
 * @param formData - The form data
 * @param errors - The errors
 * @param updateFormData - The function to update the form data
 * @param all - Whether to return all suggestions without filtering
 */
export interface BillingAddressProps {
  formData: FormData;
  errors: any;
  updateFormData: (field: string, value: any) => void;
  all?: boolean;
}

/**
 * BillingAddress component
 * @param formData - The form data
 * @param errors - The errors
 * @param updateFormData - The function to update the form data
 */
const BillingAddress = ({
  formData,
  errors,
  updateFormData,
  all = false,
}: BillingAddressProps) => {
  return (
    <div className="mt-6">
      <h4 className="text-xs font-outfit font-semibold text-gray-900 mb-4 text-left">
        Billing Address
      </h4>

      {/* Country/Region Dropdown */}
      <div className="mb-4">
        <label className="block">
          <span className="text-gray-700 text-xs flex items-center gap-2">
            <MapPin className="w-3 h-3" />
            Country/Region
          </span>
          <select
            value={formData.billing_country}
            onChange={(e) => updateFormData('billing_country', e.target.value)}
            className="mt-1.5 block w-full px-2 text-sm py-2 rounded-md border border-gray-300 text-gray-700 focus:ring-2 focus:ring-theme-orange focus:border-transparent transition-all duration-200"
          >
            <option value="">Select Country</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            <option value="AU">Australia</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="IT">Italy</option>
            <option value="ES">Spain</option>
            <option value="NL">Netherlands</option>
            <option value="BE">Belgium</option>
            <option value="CH">Switzerland</option>
            <option value="AT">Austria</option>
            <option value="SE">Sweden</option>
            <option value="NO">Norway</option>
            <option value="DK">Denmark</option>
            <option value="FI">Finland</option>
            <option value="IE">Ireland</option>
            <option value="PT">Portugal</option>
            <option value="LU">Luxembourg</option>
          </select>
          {errors.billing_country && (
            <p className="mt-1 text-red-500 text-xs">
              {errors.billing_country}
            </p>
          )}
        </label>
      </div>

      {/* Address with Autocomplete */}
      <div className="mb-4">
        <AddressAutocomplete
          value={formData.billing_address}
          onChange={(address) => updateFormData('billing_address', address)}
          placeholder="Enter your billing address"
          label="Address"
          fieldClassName="rounded-md border text-sm border-gray-300 text-gray-700 focus:ring-2 focus:ring-theme-orange focus:border-transparent"
          className="block w-full"
          labelClassName="text-gray-700 font-medium"
          showLabel={true}
          all={all}
        />
        {errors.billing_address && (
          <p className="mt-1 text-red-500 text-xs">{errors.billing_address}</p>
        )}
      </div>

      {/* City and ZIP Code */}
      <div className="flex lg:flex-row flex-col gap-2 w-full">
        <div className="flex flex-col gap-0 w-full">
          <label className="block">
            <span className="text-gray-700 text-xs flex items-center gap-2">
              <MapPin className="w-3 h-3" />
              City
            </span>
            <input
              type="text"
              value={formData.billing_city}
              placeholder="Enter city"
              onChange={(e) => updateFormData('billing_city', e.target.value)}
              className="mt-1.5 block w-full px-2 text-sm py-2 rounded-md border border-gray-300 text-gray-700 focus:ring-2 focus:ring-theme-orange focus:border-transparent transition-all duration-200"
            />
            {errors.billing_city && (
              <p className="mt-1 text-red-500 text-xs">{errors.billing_city}</p>
            )}
          </label>
        </div>

        <div className="flex flex-col gap-0 w-full">
          <label className="block">
            <span className="text-gray-700 text-xs flex items-center gap-2">
              <MapPin className="w-3 h-3" />
              ZIP/Postal Code
            </span>
            <input
              type="text"
              value={formData.billing_zip}
              placeholder="Enter ZIP/Postal code"
              onChange={(e) => updateFormData('billing_zip', e.target.value)}
              className="mt-1.5 block w-full px-2 text-sm py-2 rounded-md border border-gray-300 text-gray-700 focus:ring-2 focus:ring-theme-orange focus:border-transparent transition-all duration-200"
            />
            {errors.billing_zip && (
              <p className="mt-1 text-red-500 text-xs">{errors.billing_zip}</p>
            )}
          </label>
        </div>
      </div>
    </div>
  );
};

export default BillingAddress;
