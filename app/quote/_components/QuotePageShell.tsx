'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { constants } from '@app/components/constants';

function ShellInner({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const isAdMode = Boolean(searchParams.get('utm_source'));

  if (!isAdMode) return <>{children}</>;

  return (
    <>
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" aria-label="ICANDO Movers home">
            <Image
              src="/custom/logo.svg"
              alt="ICANDO Movers"
              width={120}
              height={40}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>
          <a
            href={`tel:${constants.companyPhone}`}
            className="flex items-center gap-2 bg-[#FD6232] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-[#C44B1A] transition-colors"
          >
            <span className="hidden sm:inline">Call us: </span>
            {constants.companyPhone}
          </a>
        </div>
      </div>
      {children}
    </>
  );
}

export default function QuotePageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<>{children}</>}>
      <ShellInner>{children}</ShellInner>
    </Suspense>
  );
}
