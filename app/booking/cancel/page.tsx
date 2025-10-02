'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

/**
 * Payment Cancel Page
 * Handles cancelled or failed payment scenarios
 */
export default function BookingCancelPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [reason, setReason] = useState<string>('Payment was cancelled');

  useEffect(() => {
    const id = searchParams.get('bookingId');
    const cancelReason = searchParams.get('reason');

    setBookingId(id);
    if (cancelReason) {
      setReason(decodeURIComponent(cancelReason));
    }
  }, [searchParams]);

  const handleRetryPayment = () => {
    if (bookingId) {
      // Redirect back to checkout with the same booking ID
      router.push(`/book?retry=${bookingId}`);
    } else {
      // If no booking ID, go back to booking form
      router.push('/book');
    }
  };

  const handleNewBooking = () => {
    router.push('/book');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cancel Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Cancelled
          </h1>
          <p className="text-lg text-gray-600">
            Your payment was not completed. No charges have been made to your
            account.
          </p>
        </div>

        {/* Reason Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            What happened?
          </h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              <strong>Reason:</strong> {reason}
            </p>
          </div>

          {bookingId && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Booking ID:</strong>{' '}
                <span className="font-mono">{bookingId}</span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Your booking details have been saved and you can retry payment.
              </p>
            </div>
          )}
        </div>

        {/* Common Reasons */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Common reasons for cancellation:
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>You cancelled the payment process</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>Payment method was declined by your bank</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>Session timed out due to inactivity</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>Technical issues with the payment processor</span>
            </li>
          </ul>
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Need help?
          </h3>
          <p className="text-blue-800 mb-4">
            If you&apos;re experiencing issues with payment or have questions
            about your booking, our support team is here to help.
          </p>
          <div className="space-y-2 text-blue-800">
            <p>
              <strong>Phone:</strong> 1-800-MOVERS-1
            </p>
            <p>
              <strong>Email:</strong> support@yourcompany.com
            </p>
            <p>
              <strong>Hours:</strong> Monday - Friday, 8 AM - 6 PM
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {bookingId && (
            <button
              onClick={handleRetryPayment}
              className="bg-theme-orange hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Retry Payment
            </button>
          )}

          <button
            onClick={handleNewBooking}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Start New Booking
          </button>

          <button
            onClick={handleGoHome}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Go Home
          </button>
        </div>

        {/* Additional Help */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            If you continue to experience issues, please contact our support
            team.
          </p>
        </div>
      </div>
    </div>
  );
}
