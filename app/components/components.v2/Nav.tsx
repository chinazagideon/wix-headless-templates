'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { constants } from '../constants';
import routes from '../Layout/NavBarV2/routes';
import { usePathname } from 'next/navigation';
import { cn } from '@app/utils';

type pageRouteType = {
  href: string;
  label: string;
  type: 'link' | 'hash';
};
const pageRoutes: pageRouteType[] = [
  { href: '/', label: 'Home', type: 'link' },
  { href: routes.about, label: 'About', type: 'link' },
  { href: routes.services, label: 'Services', type: 'link' },
  { href: routes.pricing_section, label: 'Pricing', type: 'hash' },
  { href: routes.pricing, label: 'Truck Fees', type: 'link' },
  { href: routes.reviews_section, label: 'Reviews', type: 'hash' },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname();

  const isActivePage = (path: string) => {
    if (!path) return false;
    if (path === '/') return pathname === '/';
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const stripLabel = (label: string) => {
    return `/#${label.toLowerCase().replace(/[^a-z]/g, '')}`;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FDFAF5] border-b border-[#D9D2C4] shadow-[0_1px_12px_rgba(61,26,8,0.05)]">
      <div className="max-w-[1100px] mx-auto px-12 h-[72px] flex items-center gap-6">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/custom/logo-white.jpg"
            alt="ICANDO Movers"
            width={120}
            height={48}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-1 ml-auto">
          {pageRoutes.map(({ href, label, type }) => (
            <a
              key={href}
              href={href}
              className={cn(
                `px-3 py-2 rounded-lg text-sm font-medium text-[#5C4F3D] hover:text-[#FD6232] hover:bg-[#EAE4D8] transition-colors`,
                isActivePage(href) && 'text-[#FD6232]'
              )}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3 ml-4">
          <a
            href={`tel:${constants.companyPhone}`}
            className="text-sm font-semibold text-[#5C4F3D] hover:text-[#FD6232] flex items-center gap-1 transition-colors"
          >
            <PhoneIcon />
            {constants.companyPhone}
          </a>
          <a
            href={routes.quick_quote}
            className="inline-flex items-center gap-2 bg-[#FD6232] text-white font-semibold text-sm px-5 py-2.5 rounded-full shadow-[0_4px_24px_rgba(253,98,50,0.28)] hover:bg-[#C44B1A] hover:-translate-y-px transition-all"
          >
            Get a free quote <span>→</span>
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden ml-auto flex flex-col gap-[5px] p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="block w-[22px] h-[2px] bg-[#1A1208] rounded" />
          <span className="block w-[22px] h-[2px] bg-[#1A1208] rounded" />
          <span className="block w-[22px] h-[2px] bg-[#1A1208] rounded" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden bg-[#FDFAF5] border-t border-[#D9D2C4] flex flex-col">
          {pageRoutes.map(({ href, label, type }) => (
            <Link
              prefetch
              key={label}
              href={type === 'hash' ? stripLabel(label) : href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                `px-6 py-4 text-sm font-medium text-[#5C4F3D] border-b border-[#D9D2C4] hover:text-[#FD6232]`,
                isActivePage(href) && 'text-[#FD6232]'
              )}
            >
              {label}
            </Link>
          ))}
          <div className="px-6 py-4">
            <Link
              prefetch
              href={routes.quick_quote}
              className="inline-flex items-center gap-2 bg-[#FD6232] text-white font-semibold text-sm px-5 py-2.5 rounded-full"
            >
              Get a free quote →
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 6 6l.82-.82a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
