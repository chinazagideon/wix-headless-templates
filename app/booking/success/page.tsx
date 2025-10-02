'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  CheckCircle,
  Calendar,
  MapPin,
  Clock,
  User,
  Phone,
  Mail,
} from 'lucide-react';
import { formatDateForDisplay } from '@app/utils/wix-date-converter';

/**
 * Payment Success Page
 * Handles successful payment completion and shows booking confirmation
 */
export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bookingId = searchParams.get('bookingId');
  const checkoutId = searchParams.get('checkoutId');

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        setError('No booking ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/bookings/${bookingId}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch booking details');
        }

        const data = await response.json();

        if (data.success && data.booking) {
          // Parse additional fields to extract custom data
          const customFields: any = {};
          data.booking.additionalFields?.forEach((field: any) => {
            try {
              customFields[field.fieldName] = JSON.parse(field.value);
            } catch {
              customFields[field.fieldName] = field.value;
            }
          });

          setBookingDetails({
            id: data.booking.id,
            status: data.booking.status,
            paymentStatus: data.booking.paymentStatus,
            serviceType: data.booking.serviceName || 'Moving Service',
            startDate: data.booking.startDate,
            endDate: data.booking.endDate,
            participantDetails: {
              firstName: data.booking.contactDetails?.firstName || '',
              lastName: data.booking.contactDetails?.lastName || '',
              email: data.booking.contactDetails?.email || '',
              phone: data.booking.contactDetails?.phone || '',
            },
            customFields: {
              pickupAddress: customFields.pickupAddress || '',
              destinationAddress: customFields.destinationAddress || '',
              moverCount: customFields.moverCount || 2,
              selectedHours: customFields.selectedHours || 2,
            },
          });
        } else {
          throw new Error('Invalid booking data received');
        }
      } catch (err: any) {
        console.error('Error fetching booking details:', err);
        setError(err.message || 'Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handleNewBooking = () => {
    router.push('/book');
  };

  const handleViewBookings = () => {
    router.push('/account/my-bookings');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-orange mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking confirmation...</p>
        </div>
      </div>
    );
  }

  if (error || !bookingDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Booking Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            {error ||
              'We could not find your booking details. Please contact support if you need assistance.'}
          </p>
          <button
            onClick={handleNewBooking}
            className="bg-theme-orange hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Create New Booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-lg text-gray-600">
            Your moving service has been successfully booked and payment
            processed.
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Booking Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Service Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-theme-orange" />
                <div>
                  <p className="text-sm text-gray-500">Service Date & Time</p>
                  <p className="font-semibold text-gray-900">
                    {formatDateForDisplay(new Date(bookingDetails.startDate))}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-theme-orange" />
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-semibold text-gray-900">
                    {bookingDetails.customFields.selectedHours} hours
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-theme-orange" />
                <div>
                  <p className="text-sm text-gray-500">Service Type</p>
                  <p className="font-semibold text-gray-900">
                    {bookingDetails.serviceType}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-theme-orange" />
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-semibold text-gray-900">
                    {bookingDetails.participantDetails.firstName}{' '}
                    {bookingDetails.participantDetails.lastName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-theme-orange" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold text-gray-900">
                    {bookingDetails.participantDetails.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-theme-orange" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-semibold text-gray-900">
                    {bookingDetails.participantDetails.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Address Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Pickup Address</p>
                <p className="font-medium text-gray-900">
                  {bookingDetails.customFields.pickupAddress}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Destination Address
                </p>
                <p className="font-medium text-gray-900">
                  {bookingDetails.customFields.destinationAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Booking Status */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Booking Status</p>
                <p className="font-semibold text-green-600 capitalize">
                  {bookingDetails.status.toLowerCase()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Status</p>
                <p className="font-semibold text-green-600 capitalize">
                  {bookingDetails.paymentStatus.toLowerCase()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Booking ID</p>
                <p className="font-mono text-sm text-gray-900">
                  {bookingDetails.id}
                </p>
              </div>
              {checkoutId && (
                <div>
                  <p className="text-sm text-gray-500">Checkout ID</p>
                  <p className="font-mono text-sm text-gray-900">
                    {checkoutId}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            What happens next?
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>
                You will receive a confirmation email with all booking details
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>
                Our team will contact you 24 hours before your scheduled move
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>
                Our professional movers will arrive at the scheduled time
              </span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleViewBookings}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            View My Bookings
          </button>
          <button
            onClick={handleNewBooking}
            className="bg-theme-orange hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Book Another Service
          </button>
        </div>
      </div>
    </div>
  );
}
