'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ExternalLinkIcon } from 'lucide-react';
import Lines from '../Design/Lines';
import { constants } from '@app/components/constants';
import { useTestimonials } from '@app/hooks/useTestimonials';
import { Stars, formatDateMMDDYYYY, Star } from './(components)/utils';

const TestimonialComponent = () => {
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

  if (isLoading) {
    return <div className="text-center text-gray-700">Loading...</div>;
  }

  return (
    <div className="w-full h-full py-10 px-5 transition-all duration-300 relative">
      <div className="flex flex-col justify-center items-center mt-8">
        <Lines
          linesColor="#023465"
          strokeWidth={1}
          className=""
          layer="background"
        />

        <h1 className="text-black text-center dark:text-white text-2xl font-outfit font-light normal-case">
          <span className="font-bold text-gray-700">Customer</span> Voices
        </h1>

        <div className="flex flex-col justify-center items-center px-4">
          <p className="text-black text-center dark:text-white text-sm font-outfit font-thin normal-case">
            Hear what our satisfied customers have to say about their moving
            experience.
          </p>
          {(overallRating !== undefined || totalRatings !== undefined) && (
            <div className="mt-2 flex lg:flex-row flex-col items-center gap-2 text-gray-700 font-outfit font-light">
              {overallRating !== undefined && (
                <>
                  <span className="font-thin text-xs text-black outfit">
                    {' '}
                    Google Rating:
                  </span>
                  <span className="font-bold text-2xl text-black outfit">
                    {' '}
                    {overallRating.toFixed(1)}
                  </span>
                  <Stars rating={overallRating} />
                </>
              )}
              {totalRatings !== undefined && (
                <span className="font-light text-sm text-gray-500">
                  ({totalRatings} reviews)
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center items-center gap-2 mt-6">
          <div className="flex flex-row">
            <Link
              href={constants.googleReviewLink}
              target="_blank"
              className="text-theme-orange hover:text-theme-orange-dark transition-all duration-300 text-xs font-outfit font-bold pt-1 normal-case"
            >
              Write a review on google
            </Link>
            <ExternalLinkIcon className="w-4 h-4 pt-2 text-theme-orange" />
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto">
          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {reviews.map((r, idx) => (
                  <div
                    key={idx}
                    className="w-full flex-shrink-0 px-8 py-10 rounded-2xl"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-4 h-4 bg-[inherit] rounded-full flex items-center justify-center mb-1">
                        <span className="text-2xl font-bold text-white"></span>
                      </div>

                      {r.text?.text && (
                        <blockquote className="text-gray-700 text-lg font-outfit font-light leading-relaxed mb-6 max-w-2xl normal-case">
                          &ldquo;
                          {r.text.text.length > 1000
                            ? r.text.text.slice(0, 1000) +
                              '... (view full review on Google)'
                            : r.text.text}
                          &rdquo;
                        </blockquote>
                      )}

                      {r.text?.text && r.text.text.length > 1000 && (
                        <p
                          onClick={() =>
                            window.open(r.authorAttribution?.uri, '_blank')
                          }
                          title="View on Google"
                          className="text-gray-700 text-sm font-outfit font-light leading-relaxed mb-6 max-w-2xl normal-case cursor-pointer"
                        >
                          (view full review on Google)
                        </p>
                      )}

                      <div className="flex flex-col items-center gap-3">
                        {r.authorAttribution?.photoUri ? (
                          <Image
                            src={r.authorAttribution.photoUri}
                            alt={r.authorAttribution.displayName || 'Reviewer'}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200" />
                        )}
                        <div
                          className="text-center cursor-pointer"
                          onClick={() =>
                            window.open(r.authorAttribution?.uri, '_blank')
                          }
                          title="View on Google"
                        >
                          <p className="text-gray-700 font-outfit font-semibold normal-case">
                            {r.authorAttribution?.displayName || 'Anonymous'}
                          </p>
                          <div className="flex flex-col items-center justify-center gap-2">
                            {!!r.rating && <Stars rating={r.rating} />}
                            <span className="text-gray-500 text-sm">
                              {formatDateMMDDYYYY(
                                r.publishTime as any as number
                              ) || r.relativePublishTimeDescription}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation dots */}
            <div className="flex justify-center mt-8 gap-2">
              {Array.from({ length: Math.max(1, totalSlides) }).map(
                (_, index) => (
                  <button
                    key={index}
                    onClick={() => goTo(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentSlide === index
                        ? 'bg-theme-orange scale-110'
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                )
              )}
            </div>

            {/* Prev arrow */}
            <button
              onClick={goPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              aria-label="Previous testimonial"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Next arrow */}
            <button
              onClick={goNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              aria-label="Next testimonial"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialComponent;
