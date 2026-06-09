'use client';

import { useEffect, useState } from 'react';
import { CheckCircleIcon, PhoneIcon } from 'lucide-react';
import Link from 'next/link';
import { constants } from '@app/components/constants';
import { Stars } from '@app/components/Testimonials/(components)/utils';
import { trackPixelEvent } from '@app/lib/meta-pixel';

export default function ThankYouPage() {
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    const name = sessionStorage.getItem('quote_first_name') ?? '';
    setFirstName(name);
    sessionStorage.removeItem('quote_first_name');
    trackPixelEvent('Lead');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">
        <CheckCircleIcon className="w-14 h-14 text-theme-orange mx-auto mb-6" />

        <h1 className="font-outfit font-thin text-4xl lg:text-5xl text-black mb-4">
          You&apos;re all set{firstName ? `, ${firstName}` : ''}!
        </h1>

        <p className="text-gray-600 text-lg mb-2">
          We&apos;ll call you within 2 hours to confirm your quote.
        </p>

        <p className="text-gray-400 text-sm mb-8">
          Keep your phone nearby — our team will be in touch shortly.
        </p>

        <a
          href={`tel:${constants.companyPhone}`}
          className="inline-flex items-center gap-2 bg-theme-orange text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors mb-6"
        >
          <span className="bg-black rounded-full size-6 p-1 flex items-center justify-center">
            <PhoneIcon className="w-4 h-4 text-white" />
          </span>
          Questions? Call us now → {constants.companyPhone}
        </a>

        <div className="mt-8 flex flex-col items-center gap-1">
          <Stars rating={4.8} />
          <span className="text-sm text-gray-500">
            {constants.googleRating} Google Rating · Winnipeg owned &amp;
            operated
          </span>
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors underline"
          >
            Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
