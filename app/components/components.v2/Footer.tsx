import Link from 'next/link';
import { constants } from '../constants';
import routes from '../Layout/NavBarV2/routes';
import Image from 'next/image';

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#included', label: "What's Included" },
  { href: '#faq', label: 'FAQ' },
  { href: routes.relocation_hub, label: 'Read Blog stories' },
];

export default function Footer() {
  return (
    <footer className="bg-[#003467] pt-14 pb-8" id="footer">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="flex items-start gap-3">
            <Image
              src={'/custom/logo.svg'}
              alt="logo"
              height={100}
              width={100}
            />
            {/* <div className="w-[38px] h-[38px] flex-shrink-0 rounded-[8px] bg-gradient-to-br from-[#FD6232] to-[#C44B1A] flex items-center justify-center font-serif font-bold text-white text-[14px]">
              IC
            </div> */}
            <div>
              <strong className="block text-[16px] font-bold text-white tracking-[-0.01em] mb-1">
                {constants.companyName}
              </strong>
              <span className="text-[11px] text-[rgba(253,250,245,0.45)]">
                Winnipeg, Manitoba · Est. 2016
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[.1em] text-[rgba(253,250,245,0.4)] mb-3">
              Navigate
            </p>
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="text-[14px] text-[rgba(253,250,245,0.7)] hover:text-[#FD6232] transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[.1em] text-[rgba(253,250,245,0.4)] mb-3">
              Get in touch
            </p>
            <div className="flex flex-col gap-2">
              <a
                href={`tel:${constants.companyPhone}`}
                className="text-[14px] text-[rgba(253,250,245,0.7)] hover:text-[#FD6232] transition-colors"
              >
                {constants.companyPhone}
              </a>
              <a
                href={`mailto:${constants.companyEmail}`}
                className="text-[14px] text-[rgba(253,250,245,0.7)] hover:text-[#FD6232] transition-colors"
              >
                {constants.companyEmail}
              </a>
              <Link
                href={routes.quotation}
                className="mt-3 inline-flex items-center gap-2 bg-[#FD6232] text-white font-semibold text-sm px-5 py-2.5 rounded-full shadow-[0_4px_24px_rgba(253,98,50,0.28)] hover:bg-[#C44B1A] transition-all"
              >
                Book a move →
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-[rgba(253,250,245,0.1)] pt-6 flex flex-wrap justify-between gap-2 text-[12px] text-[rgba(253,250,245,0.35)]">
          <span>© 2026 ICANDO Movers. All rights reserved.</span>
          <span>{constants.websiteUrl}</span>
        </div>
      </div>
    </footer>
  );
}
