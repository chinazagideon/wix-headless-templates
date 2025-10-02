/**
 * Example: Wix Error Handling
 * Demonstrates proper handling of Wix standard error format
 * Based on: https://dev.wix.com/docs/sdk/articles/work-with-the-sdk/about-errors
 */

'use client';

import React, { useState } from 'react';
import { useCreateBooking } from '@app/hooks/booking/useCreateBooking';
import { useBookingCheckout } from '@app/hooks/booking/useBookingCheckout';
import { FormData } from '@app/hooks/booking/useBookingForm';

export const WixErrorHandlingExample: React.FC = () => {
  const [errorDetails, setErrorDetails] = useState<any>(null);
  const { mutate: createBooking, isLoading: isCreatingBooking } =
    useCreateBooking();
  const { mutate: checkout, isLoading: isCheckingOut } = useBookingCheckout();

  // Sample form data for testing
  const sampleFormData: FormData = {
    first_name: 'John',
    last_name: 'Doe',
    service_type: 'Residential Moving',
    service_id: 'test-service-123',
    moveCategory: 'residential',
    pickup_room_size: '2-bedroom',
    destination_room_size: '2-bedroom',
    rooms: '2',
    special_items: { piano: 1, safe: 1 },
    pickup_address: '123 Main St, City, State',
    destination_address: '456 Oak Ave, City, State',
    destination_building_type: 'House',
    destination_has_elevator: 'No',
    destination_stairs_count: 0,
    move_date: '2024-12-25',
    additional_info: 'Fragile items included',
    pickup_building_type: 'Apartment',
    move_time: '10:00 AM',
    email_e1ca: 'john.doe@example.com',
    phone_9f17: '+1234567890',
    moving_address_date_and_time: '2024-12-25T10:00:00.000Z',
    has_elevator: 'Yes',
    stairs_count: 2,
    addons: ['packing', 'unpacking'],
    mover_count: 3,
    selected_hours: 4,
    selected_time_slot: null,
    appointment_date: '2024-12-25',
    distance_miles: 15,
    pickup_stairs_count: 2,
    billing_country: 'US',
    billing_address: '123 Main St',
    billing_city: 'City',
    billing_zip: '12345',
  };

  const handleErrorTest = (
    errorType: 'validation' | 'booking' | 'checkout' | 'system'
  ) => {
    setErrorDetails(null);

    if (errorType === 'validation') {
      // Test validation error
      const invalidData = { ...sampleFormData, first_name: '', service_id: '' };
      createBooking(invalidData, {
        onError: (error) => {
          setErrorDetails({
            type: 'Validation Error',
            error: error,
            explanation:
              'This demonstrates Wix validation error format with field violations',
          });
        },
      });
    } else if (errorType === 'booking') {
      // Test booking error
      createBooking(sampleFormData, {
        onError: (error) => {
          setErrorDetails({
            type: 'Booking Error',
            error: error,
            explanation:
              'This demonstrates Wix application error format for booking operations',
          });
        },
      });
    } else if (errorType === 'checkout') {
      // Test checkout error
      checkout(
        { bookingId: 'invalid-booking-id' },
        {
          onError: (error) => {
            setErrorDetails({
              type: 'Checkout Error',
              error: error,
              explanation:
                'This demonstrates Wix application error format for checkout operations',
            });
          },
        }
      );
    } else if (errorType === 'system') {
      // Test system error
      createBooking(sampleFormData, {
        onError: (error) => {
          setErrorDetails({
            type: 'System Error',
            error: error,
            explanation:
              'This demonstrates Wix system error format for internal errors',
          });
        },
      });
    }
  };

  const renderErrorExample = (
    title: string,
    description: string,
    example: any
  ) => (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
      <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
      <p className="text-sm text-gray-600 mb-3">{description}</p>
      <pre className="bg-gray-800 text-green-400 text-xs p-3 rounded overflow-auto">
        {JSON.stringify(example, null, 2)}
      </pre>
    </div>
  );

  return (
    <div className="p-6 border rounded-lg bg-gray-50">
      <h2 className="text-xl font-semibold mb-6">
        Wix Error Handling Examples
      </h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">
          Wix Standard Error Format
        </h3>
        <p className="text-gray-600 mb-4">
          All errors follow the Wix standard format as documented in the
          <a
            href="https://dev.wix.com/docs/sdk/articles/work-with-the-sdk/about-errors"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline ml-1"
          >
            Wix SDK documentation
          </a>
          .
        </p>
      </div>

      {/* Error Type Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {renderErrorExample(
          'Application Error',
          'Business logic rejects the request',
          {
            message: 'Booking operation failed',
            details: {
              applicationError: {
                code: 'BOOKING_NOT_AVAILABLE',
                description: 'The selected time slot is no longer available',
                data: {
                  requestedSlot: {
                    startDate: '2024-12-25T10:00:00.000Z',
                    endDate: '2024-12-25T14:00:00.000Z',
                  },
                },
              },
            },
          }
        )}

        {renderErrorExample(
          'Validation Error',
          'Input data fails validation rules',
          {
            message: 'Booking data validation failed',
            details: {
              validationError: {
                fieldViolations: [
                  {
                    field: 'first_name',
                    description: 'First name is required',
                    violatedRule: 'REQUIRED_FIELD',
                    ruleName: 'VALIDATION_ERROR',
                  },
                  {
                    field: 'service_id',
                    description: 'Service ID is required',
                    violatedRule: 'REQUIRED_FIELD',
                    ruleName: 'VALIDATION_ERROR',
                  },
                ],
              },
            },
          }
        )}

        {renderErrorExample('Payment Error', 'Payment processing fails', {
          message: 'Payment operation failed',
          details: {
            applicationError: {
              code: 'NO_FUNDS',
              description: 'Payment declined due to insufficient funds',
              data: {
                availableFunds: 75.22,
              },
            },
          },
        })}

        {renderErrorExample('System Error', 'Internal system exception', {
          message: 'A system error occurred',
        })}
      </div>

      {/* Interactive Error Testing */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Test Error Handling</h3>
        <p className="text-gray-600 mb-4">
          Click the buttons below to test different error scenarios and see how
          they&apos;re handled.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <button
            onClick={() => handleErrorTest('validation')}
            disabled={isCreatingBooking || isCheckingOut}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
          >
            Test Validation Error
          </button>

          <button
            onClick={() => handleErrorTest('booking')}
            disabled={isCreatingBooking || isCheckingOut}
            className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
          >
            Test Booking Error
          </button>

          <button
            onClick={() => handleErrorTest('checkout')}
            disabled={isCreatingBooking || isCheckingOut}
            className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
          >
            Test Checkout Error
          </button>

          <button
            onClick={() => handleErrorTest('system')}
            disabled={isCreatingBooking || isCheckingOut}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
          >
            Test System Error
          </button>
        </div>

        {(isCreatingBooking || isCheckingOut) && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Testing error scenario...</p>
          </div>
        )}
      </div>

      {/* Error Details Display */}
      {errorDetails && (
        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Error Response</h3>
          <div className="mb-4">
            <p className="font-semibold text-gray-900">
              Type: {errorDetails.type}
            </p>
            <p className="text-sm text-gray-600">{errorDetails.explanation}</p>
          </div>

          <div className="bg-gray-800 text-green-400 text-xs p-4 rounded overflow-auto">
            <pre>{JSON.stringify(errorDetails.error, null, 2)}</pre>
          </div>

          <button
            onClick={() => setErrorDetails(null)}
            className="mt-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Clear Error Details
          </button>
        </div>
      )}

      {/* Implementation Notes */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">
          Implementation Notes
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• All errors follow the Wix standard format for consistency</li>
          <li>
            • Application errors include specific codes and contextual data
          </li>
          <li>• Validation errors provide detailed field-level information</li>
          <li>• System errors are kept minimal for security</li>
          <li>• Error handling is centralized in the WixErrorHandler class</li>
        </ul>
      </div>
    </div>
  );
};
