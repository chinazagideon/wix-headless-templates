'use client';

import { constants } from '../constants';

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      id="hero"
    >
      {/* Background photo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/custom/icando-move-truck.jpg')",
          backgroundPosition: 'center 30%',
        }}
      />
      {/* Warm dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(10,4,2,0.88)] via-[rgba(0,20,50,0.75)] to-[rgba(61,26,8,0.65)]" />

      {/* Faint watermark quote */}
      <div
        className="absolute right-[-2%] bottom-[8%] z-[1] font-serif italic text-[rgba(253,250,245,0.06)] text-right leading-tight pointer-events-none select-none hidden lg:block"
        style={{ fontSize: 'clamp(32px,5vw,72px)' }}
        aria-hidden="true"
      >
        Redefining the
        <br />
        neighborhood
        <br />
        moving services
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1100px] mx-auto px-12 pt-36 pb-24">
        <div className="max-w-[600px]">
          <p className="text-[11px] font-semibold tracking-[.14em] uppercase text-[#E8832A] mb-3">
            Winnipeg&apos;s trusted moving crew · Est. 2016
          </p>

          <h1
            className="font-serif font-bold text-white leading-[1.05] tracking-[-0.02em] mt-2 mb-5"
            style={{ fontSize: 'clamp(44px,6vw,76px)' }}
          >
            The move that
            <br />
            <em className="italic text-[#E8832A]">actually</em> goes right
          </h1>

          {/* Brand tagline */}
          <p
            className="font-serif italic text-[rgba(253,250,245,0.72)] border-l-2 border-[#E8832A] pl-3.5 mb-5 leading-relaxed"
            style={{ fontSize: 'clamp(15px,1.8vw,19px)' }}
          >
            &ldquo;Redefining the neighbourhood moving experience&rdquo;
          </p>

          <p
            className="text-[rgba(253,250,245,0.78)] mb-8 leading-[1.65]"
            style={{ fontSize: 'clamp(15px,1.8vw,18px)' }}
          >
            Flat hourly rates. Real crew. No surprises at the door.
          </p>

          <div className="flex flex-wrap gap-3 mb-6">
            <a
              href="#quote"
              className="inline-flex items-center gap-2 bg-[#FDFAF5] text-[#FD6232] font-semibold px-6 py-3 rounded-full hover:bg-white hover:-translate-y-px transition-all"
            >
              Get a free quote →
            </a>
            <a
              href={`tel:${constants.companyPhone}`}
              className="inline-flex items-center gap-2 text-white border-2 border-[rgba(253,250,245,0.55)] font-semibold px-6 py-3 rounded-full hover:bg-[rgba(253,250,245,0.1)] transition-all"
            >
              <PhoneIcon />
              {constants.companyPhone}
            </a>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {['⭐ 4.8 Google', '✓ Fully insured', '✓ No hidden fees'].map(
              (b) => (
                <span
                  key={b}
                  className="text-[12px] font-medium text-[rgba(253,250,245,0.72)] bg-[rgba(253,250,245,0.1)] border border-[rgba(253,250,245,0.18)] rounded-full px-3.5 py-1"
                >
                  {b}
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#stats"
        className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 text-[rgba(253,250,245,0.45)] animate-bounce"
        aria-label="Scroll down"
      >
        <ChevronDown />
      </a>
    </section>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="15"
      height="15"
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

function ChevronDown() {
  return (
    <svg
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
