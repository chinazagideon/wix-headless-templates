'use client';

import { useTestimonials } from '@app/hooks/useTestimonials';
import { constants } from '@app/components/constants';
import { Stars } from '../Testimonials/(components)/utils';

function getInitials(displayName: string): string {
  const parts = displayName.trim().split(/\s+/);
  if (parts.length >= 2)
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return displayName.slice(0, 2).toUpperCase();
}

function truncate(text: string, max = 280): string {
  return text.length > max ? text.slice(0, max).trimEnd() + '…' : text;
}

export default function Testimonials() {
  const {
    reviews,
    overallRating,
    totalRatings,
    isLoading,
    currentSlide,
    totalSlides,
    goTo,
    goNext,
    goPrev,
  } = useTestimonials();

  return (
    <section className="bg-[#F5F0E8] py-20 md:py-24" id="reviews">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-9">
          <p className="text-[11px] font-semibold tracking-[.12em] uppercase text-[#FD6232] mb-2">
            Customer Voices
          </p>
          <h2
            className="font-serif font-bold text-[#1A1208] mb-3"
            style={{ fontSize: 'clamp(28px,3vw,38px)' }}
          >
            What Winnipeg says about us
          </h2>
          <div className="inline-flex items-center gap-2 bg-[#FDFAF5] border border-[#D9D2C4] rounded-full px-4 py-1.5">
            <Stars rating={overallRating ?? 4.8} />
            <span className="font-serif font-bold text-[18px] text-[#1A1208]">
              {overallRating?.toFixed(1) ?? '4.8'}
            </span>
            <span className="text-[11px] text-[#9C8E7A]">
              Google Rating{totalRatings ? ` · ${totalRatings} reviews` : ''}
            </span>
          </div>
        </div>

        {/* Slider */}
        {isLoading ? (
          <div className="h-[220px] flex items-center justify-center text-[#9C8E7A] text-sm">
            Loading reviews…
          </div>
        ) : (
          <div className="overflow-hidden rounded-[24px] bg-[#FDFAF5] border border-[#D9D2C4] shadow-[0_2px_16px_rgba(61,26,8,0.06)] mb-5">
            <div
              className="flex transition-transform duration-[450ms] ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {reviews.map((r, i) => (
                <div
                  key={r.authorAttribution?.uri ?? i}
                  className="min-w-full px-8 md:px-16 py-12 md:py-14 text-center"
                >
                  <blockquote
                    className="font-serif italic text-[#1A1208] leading-[1.55] max-w-[680px] mx-auto mb-8"
                    style={{ fontSize: 'clamp(18px,2.5vw,23px)' }}
                  >
                    &ldquo;{truncate(r.text?.text ?? '')}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-3.5 justify-center">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#FD6232] to-[#C44B1A] text-white text-[13px] font-bold flex items-center justify-center flex-shrink-0">
                      {getInitials(r.authorAttribution?.displayName ?? '?')}
                    </div>
                    <div className="text-left">
                      <strong className="block text-[15px] font-semibold text-[#1A1208]">
                        {r.authorAttribution?.displayName ?? 'Anonymous'}
                      </strong>
                      <span className="flex items-center gap-1.5">
                        <Stars rating={r.rating ?? 5} />
                        {r.relativePublishTimeDescription && (
                          <span className="text-[11px] text-[#9C8E7A]">
                            · {r.relativePublishTimeDescription}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={goPrev}
            className="w-10 h-10 rounded-full border-[1.5px] border-[#D9D2C4] bg-[#FDFAF5] text-[#5C4F3D] flex items-center justify-center hover:border-[#FD6232] hover:text-[#FD6232] transition-colors"
            aria-label="Previous"
          >
            ←
          </button>
          <div className="flex gap-1.5 items-center">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full border-none transition-all ${
                  i === currentSlide
                    ? 'w-2.5 h-2.5 bg-[#FD6232] scale-110'
                    : 'w-2 h-2 bg-[#D9D2C4]'
                }`}
                aria-label={`Go to review ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={goNext}
            className="w-10 h-10 rounded-full border-[1.5px] border-[#D9D2C4] bg-[#FDFAF5] text-[#5C4F3D] flex items-center justify-center hover:border-[#FD6232] hover:text-[#FD6232] transition-colors"
            aria-label="Next"
          >
            →
          </button>
        </div>

        <div className="text-center mt-5">
          <a
            href={constants.googleReviewLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FD6232] font-semibold text-[14px] hover:text-[#C44B1A] transition-colors"
          >
            Write a review on Google →
          </a>
        </div>
      </div>
    </section>
  );
}
