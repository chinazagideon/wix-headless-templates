import type { Metadata } from 'next';
import { constants } from '@app/components/constants';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How ICANDO Movers collects, uses, and protects your information.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-10">Last updated: June 2026</p>

      <section className="space-y-8 text-gray-700 leading-relaxed">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            What we collect
          </h2>
          <p>
            When you request a quote or contact us, we collect your name, email
            address, phone number, and moving details (pickup and destination
            addresses, preferred date, and move size). We also collect standard
            server log data (IP address, browser type, pages visited) through our
            hosting and analytics providers.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            How we use it
          </h2>
          <p>
            Your information is used to prepare and deliver your moving quote,
            confirm your booking, and contact you about your upcoming move. We may
            also send you occasional service updates relevant to your booking. We
            do not use your information for unrelated marketing without your
            explicit consent.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Who we share it with
          </h2>
          <p>
            We do not sell your personal information to third parties. We may share
            it with service providers (such as our CRM and scheduling platform)
            strictly for the purpose of fulfilling your move. These providers are
            bound by confidentiality obligations.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Retention
          </h2>
          <p>
            We retain your information for as long as necessary to complete your
            move and comply with applicable legal obligations, typically no longer
            than 3 years after your last interaction with us.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Your rights
          </h2>
          <p>
            You may request access to, correction of, or deletion of your personal
            information at any time by contacting us at the address below. We will
            respond within 30 days.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Cookies &amp; tracking
          </h2>
          <p>
            Our website uses cookies for analytics and advertising (Google Ads,
            Meta). You can disable cookies in your browser settings at any time.
            We do not use tracking cookies to build profiles for sale to third
            parties.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Contact</h2>
          <p>
            Questions about this policy? Reach us at{' '}
            <a
              href={`mailto:${constants.companyEmail}`}
              className="text-[#FD6232] underline hover:text-[#C44B1A] transition-colors"
            >
              {constants.companyEmail}
            </a>{' '}
            or by phone at{' '}
            <a
              href={`tel:${constants.companyPhone}`}
              className="text-[#FD6232] underline hover:text-[#C44B1A] transition-colors"
            >
              {constants.companyPhone}
            </a>
            .
          </p>
          <p className="mt-3">
            ICANDO Movers · Winnipeg, Manitoba, Canada
          </p>
        </div>
      </section>
    </main>
  );
}
