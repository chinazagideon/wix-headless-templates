import React from 'react';
import { CalculatedPricing } from '@app/services/PricingCalculator';
import { FormData } from '@app/hooks/booking/useBookingForm';
import {
  Clock,
  Users,
  Truck,
  TrendingUp,
  Package,
  Plus,
  Minus,
} from 'lucide-react';

interface PricingBreakdownProps {
  pricing: CalculatedPricing;
  formData: FormData;
  onHoursChange: (hours: number) => void;
  onMoverCountChange: (count: number) => void;
  availableMoverCounts: number[];
  minimumHours: number;
  maximumHours: number;
}

const PricingBreakdown: React.FC<PricingBreakdownProps> = ({
  pricing,
  formData,
  onHoursChange,
  onMoverCountChange,
  availableMoverCounts,
  minimumHours,
  maximumHours,
}) => {
  if (!pricing) return null;

  const { breakdown } = pricing;

  return (
    <div className="bg-white rounded-lg p-1 space-y-6">
      {/* Service Configuration */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex text-center gap-2">
          <Users className="w-5 h-5 text-theme-orange" />
          Service Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:justify-start justify-center gap-4 w-full">
          {/* Mover Count Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center lg:text-left">
              Number of Movers
            </label>
            <div className="flex gap-2 lg:justify-start justify-center">
              {availableMoverCounts.map((count) => (
                <button
                  key={count}
                  onClick={() => onMoverCountChange(count)}
                  className={`px-3 text-xs py-2 rounded-lg border transition-all ${
                    formData.mover_count === count
                      ? 'border-theme-orange bg-theme-orange text-white'
                      : 'border-gray-300 hover:border-theme-orange text-gray-900'
                  }`}
                >
                  {count} Movers
                </button>
              ))}
            </div>
          </div>
          {/* Hours Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
              <Clock className="w-4 h-4 inline mr-1" />
              Duration (Hours)
            </label>
            <div className="flex items-center gap-3 lg:justify-middle justify-center">
              <button
                onClick={() =>
                  onHoursChange(
                    Math.max(minimumHours, formData.selected_hours - 1)
                  )
                }
                disabled={formData.selected_hours <= minimumHours}
                className="text-theme-orange p-2 rounded-lg border border-gray-300 hover:border-theme-orange disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="w-4 h-4" />
              </button>

              <span className="text-lg font-semibold min-w-[3rem] text-center text-gray-900">
                {formData.selected_hours}
              </span>

              <button
                onClick={() =>
                  onHoursChange(
                    Math.min(maximumHours, formData.selected_hours + 1)
                  )
                }
                disabled={formData.selected_hours >= maximumHours}
                className="text-theme-orange p-2 rounded-lg border border-gray-300 hover:border-theme-orange disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <span className="block text-xs text-gray-500 text-center">
              (Min: {minimumHours}h, Max: {maximumHours}h)
            </span>
          </div>

          {/* Service Type Display */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Type
            </label>
            <div className="px-4 py-2 bg-gray-100 rounded-lg border border-gray-200">
              <span className="text-sm text-gray-700 capitalize">
                {formData.service_type || 'Residential Move'}
              </span>
            </div>
          </div> */}
        </div>
      </div>

      {/* Pricing Breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Pricing Breakdown
        </h3>

        <div className="space-y-3">
          {/* Base Service Price */}
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                {breakdown.moverCount} Movers - {breakdown.moveType} (
                {breakdown.selectedHours}h)
              </span>
            </div>
            <span className="font-medium text-gray-900">
              ${breakdown.totalBasePrice.toFixed(2)}
            </span>
          </div>

          {/* Travel Fee */}
          {pricing.travelFee > 0 && (
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">Travel Fee</span>
              </div>
              <span className="font-medium text-gray-900">
                ${pricing.travelFee.toFixed(2)}
              </span>
            </div>
          )}

          {/* Truck Fee */}
          {pricing.truckFee > 0 && pricing.isTruckService && (
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">Truck Fee</span>
              </div>
              <span className="font-medium text-gray-900">
                ${pricing?.truckFee}
              </span>
            </div>
          )}

          {/* Stairs Fee */}
          {pricing.stairsFee > 0 && (
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">Stairs Fee</span>
              </div>
              <span className="font-medium text-gray-900">
                ${pricing.stairsFee.toFixed(2)}
              </span>
            </div>
          )}

          {/* Special Items Fee */}
          {pricing.specialItemsFee > 0 && (
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">Special Items</span>
              </div>
              <span className="font-medium text-gray-900">
                ${pricing.specialItemsFee.toFixed(2)}
              </span>
            </div>
          )}

          {/* Addons Fee */}
          {pricing.addonsFee > 0 && (
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">Add-ons</span>
              </div>
              <span className="font-medium text-gray-900">
                ${pricing.addonsFee.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="flex justify-between items-center py-4 border-t-2 border-theme-orange bg-orange-50 rounded-lg px-4">
          <span className="text-lg font-bold text-gray-900">
            Total{' '}
            <span className="text-xs font-bold text-gray-500">(+5% Tax)</span>
          </span>
          <span className="text-2xl font-bold text-theme-orange">
            ${pricing.finalTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Additional Info */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Pricing is calculated based on your selections and may vary</p>
        <p>• All prices are in CAD and include base service fees</p>
        <p>• Additional charges may apply for complex moves</p>
      </div>
    </div>
  );
};

export default PricingBreakdown;
