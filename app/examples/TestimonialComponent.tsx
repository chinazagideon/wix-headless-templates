import { useState, useEffect } from 'react';

const TestimonialComponent = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <>
      <div className="w-full max-w-4xl mx-auto">
        <div className="relative">
          {/* Slider Container */}
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {/* Testimonial 1 */}
              <div className="w-full flex-shrink-0 px-8 py-12 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-theme-orange rounded-full flex items-center justify-center mb-6">
                    <span className="text-2xl font-bold text-white">
                      &ldquo;
                    </span>
                  </div>
                  <blockquote className="text-white text-lg font-outfit font-light leading-relaxed mb-6 max-w-2xl normal-case">
                    &ldquo;The team at Movers made our relocation from Toronto
                    to Winnipeg absolutely seamless. Their attention to detail
                    and professional service exceeded our expectations.
                    Everything arrived on time and in perfect condition.&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-600 rounded-full"></div>
                    <div className="text-left">
                      <p className="text-white font-outfit font-semibold normal-case">
                        Sarah Johnson
                      </p>
                      <p className="text-gray-300 text-sm font-outfit font-light normal-case">
                        Toronto → Winnipeg
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="w-full flex-shrink-0 px-8 py-12 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-theme-orange rounded-full flex items-center justify-center mb-6">
                    <span className="text-2xl font-bold text-white">
                      &ldquo;
                    </span>
                  </div>
                  <blockquote className="text-white text-lg font-outfit font-light leading-relaxed mb-6 max-w-2xl normal-case">
                    &ldquo;Moving our office was a huge undertaking, but Movers
                    handled it with incredible professionalism. They packed
                    everything carefully and set up our new space perfectly.
                    Highly recommend for commercial moves!&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-600 rounded-full"></div>
                    <div className="text-left">
                      <p className="text-white font-outfit font-semibold normal-case">
                        Michael Chen
                      </p>
                      <p className="text-gray-300 text-sm font-outfit font-light normal-case">
                        Business Owner
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="w-full flex-shrink-0 px-8 py-12 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-theme-orange rounded-full flex items-center justify-center mb-6">
                    <span className="text-2xl font-bold text-white">
                      &ldquo;
                    </span>
                  </div>
                  <blockquote className="text-white text-lg font-outfit font-light leading-relaxed mb-6 max-w-2xl normal-case">
                    &ldquo;I was worried about moving my antique furniture, but
                    the team treated everything like it was their own. The
                    storage service was also excellent when we needed extra time
                    to find our new home.&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-600 rounded-full"></div>
                    <div className="text-left">
                      <p className="text-white font-outfit font-semibold normal-case">
                        Emma Rodriguez
                      </p>
                      <p className="text-gray-300 text-sm font-outfit font-light normal-case">
                        Homeowner
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 gap-2">
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? 'bg-theme-orange scale-110'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Arrow Navigation */}
          <button
            onClick={() =>
              setCurrentSlide(currentSlide === 0 ? 2 : currentSlide - 1)
            }
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
          <button
            onClick={() =>
              setCurrentSlide(currentSlide === 2 ? 0 : currentSlide + 1)
            }
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
    </>
  );
};

export default TestimonialComponent;
