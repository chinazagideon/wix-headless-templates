import { useState, useEffect } from 'react';
import Lines from '../Design/Lines';
import { useGoogleReviews } from '@app/hooks/useGoogleReviews';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLinkIcon } from 'lucide-react';
import { constants } from '@app/components/constants';

/**
 * Converts a relative time description (e.g., "1 week ago", "2 months ago") to a Unix timestamp in seconds
 */
function calculateTimestampFromRelativeTime(relativeTime: string): number {
  const now = new Date();
  const lowerTime = relativeTime.toLowerCase().trim();
  
  // Match patterns like "1 week ago", "2 months ago", etc.
  const match = lowerTime.match(/^(\d+)\s+(day|week|month|year)s?\s+ago$/i);
  
  if (!match) {
    // Fallback: if we can't parse it, return current time
    return Math.floor(now.getTime() / 1000);
  }
  
  const amount = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  
  const date = new Date(now);
  
  switch (unit) {
    case 'day':
      date.setDate(date.getDate() - amount);
      break;
    case 'week':
      date.setDate(date.getDate() - (amount * 7));
      break;
    case 'month':
      date.setMonth(date.getMonth() - amount);
      break;
    case 'year':
      date.setFullYear(date.getFullYear() - amount);
      break;
    default:
      return Math.floor(now.getTime() / 1000);
  }
  
  return Math.floor(date.getTime() / 1000);
}

const fallbackReviewsData = [
  {
    authorAttribution: {
      displayName: 'Grace Giglione',
      photoUri: 'https://lh3.googleusercontent.com/a/ACg8ocKNb8x9WmUrQC4CqdcXtHVXXxVPoRceI0l1gHCUuMLm5yZshg=w144-h144-p-rp-mo-br100',
      uri: 'https://www.google.com/maps/contrib/116102116762978571456/reviews?hl=en-GB',
    },
    text: {
      text: "Recently used these guys to move the contents out of my mom’s condo into my house." +
        "Back story is my mom passed away and I have sentimental attachment to some items. Without having " +
        "to tell them anything they were super considerate, careful and attentive to what they were moving. " +
        "Also not to mention they were quick and literally half the cost of some of these other companies I got quoted by. " +
        "I HIGHLY recommend this company and certainly will use them again if need. The professionalism was awesome.",
    },
    rating: 5,
    publishTime: calculateTimestampFromRelativeTime('1 week ago'),
    relativePublishTimeDescription: '1 week ago',
  },
  {
    authorAttribution: {
      displayName: 'Crystal LeMasurier',
      photoUri: 'https://lh3.googleusercontent.com/a/ACg8ocK4kFW0KAWwXS0rRicQJa96cG0IorfsDq-E6F1c4bzjNrAKcg=w144-h144-p-rp-mo-ba2-br100',
      uri: 'https://www.google.com/maps/contrib/106879822032530368672/reviews?hl=en-GB',
    },
    text: {
      text: "Fabulous service. Small miscommunication when movers would be at the house - they arrive 30 mins before emailed schedule." +
        "They were fast, courteous, the estimate was straight to the point, no aggressive sales. Wrapped my furniture well, asked where everything goes, " +
        "took care to not damage anything, hands down the most cost friendly hourly rate. Got the job done in half the time. Easy payment. Highly recommend. \n" +

        "My only 'complaint' would be that they showed up in a U-Haul truck - which I could've rented for less for the time needed then booking a truck with the company. " +
        "HOWEVER does not take away how amazing this company was."
    },
    rating: 5,
    publishTime: calculateTimestampFromRelativeTime('2 months ago'),
    relativePublishTimeDescription: '2 months ago',
  },
  {
    authorAttribution: {
      displayName: 'Karyn Davis',
      photoUri: 'https://lh3.googleusercontent.com/a/ACg8ocIzQYV4mgQ0VLGTDijYAUgBstpaMfmW-H92DU6-gGfQxxImaw=w144-h144-p-rp-mo-br100',
      uri: 'https://www.google.com/maps/contrib/118298829437995359492/reviews?hl=en-GB',
    },
    text: {
      text: "The movers were incredibly organized, efficient, careful & hard working. They moved all kinds of house furniture, yard furniture and everything else!\n" +
        "I would highly recommend them for future jobs. They are also very friendly & kind! My move out was a wonderful experience, little stress thank God.",
    },
    rating: 5,
    publishTime: calculateTimestampFromRelativeTime('4 months ago'),
    relativePublishTimeDescription: '4 months ago',
  },
  {
    authorAttribution: {
      displayName: 'Sylvia Flint',
      photoUri: 'https://lh3.googleusercontent.com/a/ACg8ocKFj5OoPqe5X3lCMZxOxm3t9jivY8waqSy266oLdWLmW8jnGg=w144-h144-p-rp-mo-br100',
      uri: 'https://www.google.com/maps/contrib/106565861145782012687/reviews?hl=en-GB',
    },
    text: {
      text: "ICANDO moved my mom last week and they were amazing. From my first call to Nelson to my subsequent questions when I thought we may need to change the date, " +
        "Nelson was understanding and helpful. On moving Day, Nelson and his partner Trevor were on time and so kind. We and other members of our family have needed movers over the years, "+ 
        "but ICANDO provided the best customer service than all of them put together. Thank you Nelson and I wish you all the success in your business!"
    },
    rating: 5,
    publishTime: calculateTimestampFromRelativeTime('2 months ago'),
    relativePublishTimeDescription: '2 months ago',
  }
]
const TestimonialComponent = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const {
    data: reviewsData,
    isLoading,
    isError,
  } = useGoogleReviews({ placeId: process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID });

  // Use fallback data if there's an error, no reviews, or error property exists
  const shouldUseFallback = 
    isError || 
    !reviewsData?.reviews || 
    reviewsData.reviews.length === 0 || 
    reviewsData.error;
  
  const allReviews = shouldUseFallback 
    ? fallbackReviewsData 
    : (reviewsData?.reviews ?? []);
  
  const getReviewTime = (r: any) => {
    // Handle both timestamp (number) and time property
    if (typeof r?.publishTime === 'number') return r.publishTime;
    if (typeof r?.time === 'number') return r.time;
    return 0;
  };
  const highRated = allReviews
    .filter((r) => (r.rating ?? 0) > 4)
    .sort((a, b) => getReviewTime(b) - getReviewTime(a));
  const lowerRated = allReviews
    .filter((r) => (r.rating ?? 0) > 2 && (r.rating ?? 0) < 4)
    .sort((a, b) => getReviewTime(b) - getReviewTime(a));
  const reviews = [...highRated, ...lowerRated];
  // const reviews = allReviews;
  const totalSlides = reviews.length;

  useEffect(() => {
    if (!totalSlides || totalSlides <= 1) return;
    const intervalId = setInterval(() => {
      setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(intervalId);
  }, [totalSlides]);
  const overallRating = reviewsData?.rating;
  const totalRatings = reviewsData?.userRatingCount;
  // const overallRating = reviewsData?.result?.rating ?? undefined;
  // const totalRatings = reviewsData?.result?.user_ratings_total ?? undefined;

  return (
    <>
      {isLoading ? (
        <div className="text-center text-gray-700">Loading...</div>
      ) : (
        <div className="w-full h-full py-10 px-5 transition-all duration-300 relative">
          <div className="flex flex-col justify-center items-center mt-8">
            <Lines
              linesColor="#023465"
              strokeWidth={1}
              className=""
              layer="background"
            />
            <h1 className="text-black text-center dark:text-white text-2xl font-outfit font-light normal-case ">
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
                        {overallRating ? overallRating?.toFixed(1) : ''}
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
              {/* <p className='text-gray-700 text-xs font-outfit font-light leading-relaxed mb-6 max-w-2xl normal-case'>
                    for any feedback, questions, or concerns.
                  </p> */}
            </div>

            {/* </div> */}

            <div className="w-full max-w-4xl mx-auto">
              <div className="relative">
                {/* Slider Container */}
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
                              <>
                                <Image
                                  src={r.authorAttribution?.photoUri}
                                  alt={
                                    r.authorAttribution?.displayName ||
                                    'Reviewer'
                                  }
                                  width={40}
                                  height={40}
                                  className="rounded-full object-cover"
                                />
                              </>
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
                              <p className="text-gray-700 font-outfit font-semibold normal-case cursor-pointer">
                                {r?.authorAttribution?.displayName ||
                                  'Anonymous'}
                              </p>
                              <div className="flex flex-col items-center justify-center gap-2">
                                {!!r.rating && <Stars rating={r.rating} />}
                                <span className="text-gray-500 text-sm">
                                  {formatDateMMDDYYYY(
                                    (r as any)?.publishTime
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

                {/* Navigation Dots */}
                <div className="flex justify-center mt-8 gap-2">
                  {Array.from({ length: Math.max(1, totalSlides || 0) }).map(
                    (_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index
                          ? 'bg-theme-orange scale-110'
                          : 'bg-gray-600 hover:bg-gray-500'
                          }`}
                        aria-label={`Go to testimonial ${index + 1}`}
                      />
                    )
                  )}
                </div>

                {/* Arrow Navigation */}
                <button
                  onClick={() =>
                    setCurrentSlide(
                      totalSlides
                        ? currentSlide === 0
                          ? totalSlides - 1
                          : currentSlide - 1
                        : 0
                    )
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
                    setCurrentSlide(
                      totalSlides
                        ? currentSlide === totalSlides - 1
                          ? 0
                          : currentSlide + 1
                        : 0
                    )
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
          </div>
        </div>
      )}
    </>
  );
};

export default TestimonialComponent;

function formatDateMMDDYYYY(timestampSeconds?: number) {
  if (typeof timestampSeconds !== 'number') return undefined;
  const d = new Date(timestampSeconds * 1000);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

function Stars({ rating = 0 }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const empty = 5 - fullStars - (hasHalf ? 1 : 0);
  return (
    <div className="flex items-center">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`f-${i}`} type="full" />
      ))}
      {hasHalf && <Star key="half" type="half" />}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e-${i}`} type="empty" />
      ))}
    </div>
  );
}

function Star({ type }: { type: 'full' | 'half' | 'empty' }) {
  if (type === 'full') {
    return (
      <svg
        className="h-4 w-4 text-yellow-400"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    );
  }
  if (type === 'half') {
    return (
      <svg className="h-4 w-4 text-yellow-400" viewBox="0 0 24 24" aria-hidden>
        <defs>
          <linearGradient id="halfGrad">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          fill="url(#halfGrad)"
          d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.402 8.168L12 18.896l-7.336 3.869 1.402-8.168L.132 9.21l8.2-1.192z"
        />
        <path
          fill="none"
          stroke="currentColor"
          d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.402 8.168L12 18.896l-7.336 3.869 1.402-8.168L.132 9.21l8.2-1.192z"
        />
      </svg>
    );
  }
  return (
    <svg
      className="h-4 w-4 text-gray-300"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}
