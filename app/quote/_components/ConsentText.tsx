import Link from 'next/link';

export default function ConsentText() {
  return (
    <p className="text-center text-[12px] text-gray-400 mt-3 max-w-md mx-auto">
      By submitting, you consent to being contacted about your upcoming move.{' '}
      <Link
        href="/privacy"
        className="underline hover:text-gray-600 transition-colors"
      >
        Privacy Policy
      </Link>
      .
    </p>
  );
}
