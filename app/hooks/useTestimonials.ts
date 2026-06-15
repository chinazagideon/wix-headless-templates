import { useState, useEffect } from 'react';
import { useGoogleReviews, GoogleReview } from '@app/hooks/useGoogleReviews';

type ReviewWithNumericTime = Omit<GoogleReview, 'publishTime'> & {
  publishTime?: string | number;
  time?: number;
};

function relativeTimeToTimestamp(relativeTime: string): number {
  const now = new Date();
  const match = relativeTime
    .toLowerCase()
    .trim()
    .match(/^(\d+)\s+(day|week|month|year)s?\s+ago$/i);
  if (!match) return Math.floor(now.getTime() / 1000);

  const amount = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  const date = new Date(now);

  switch (unit) {
    case 'day':
      date.setDate(date.getDate() - amount);
      break;
    case 'week':
      date.setDate(date.getDate() - amount * 7);
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

const FALLBACK_REVIEWS: ReviewWithNumericTime[] = [
  {
    authorAttribution: {
      displayName: 'Grace Giglione',
      photoUri:
        'https://lh3.googleusercontent.com/a/ACg8ocKNb8x9WmUrQC4CqdcXtHVXXxVPoRceI0l1gHCUuMLm5yZshg=w144-h144-p-rp-mo-br100',
      uri: 'https://www.google.com/maps/contrib/116102116762978571456/reviews?hl=en-GB',
    },
    text: {
      text:
        'Recently used these guys to move the contents out of my mom’s condo into my house.' +
        'Back story is my mom passed away and I have sentimental attachment to some items. Without having ' +
        'to tell them anything they were super considerate, careful and attentive to what they were moving. ' +
        'Also not to mention they were quick and literally half the cost of some of these other companies I got quoted by. ' +
        'I HIGHLY recommend this company and certainly will use them again if need. The professionalism was awesome.',
    },
    rating: 5,
    publishTime: relativeTimeToTimestamp('1 week ago'),
    relativePublishTimeDescription: '1 week ago',
  },
  {
    authorAttribution: {
      displayName: 'Crystal LeMasurier',
      photoUri:
        'https://lh3.googleusercontent.com/a/ACg8ocK4kFW0KAWwXS0rRicQJa96cG0IorfsDq-E6F1c4bzjNrAKcg=w144-h144-p-rp-mo-ba2-br100',
      uri: 'https://www.google.com/maps/contrib/106879822032530368672/reviews?hl=en-GB',
    },
    text: {
      text:
        'Fabulous service. Small miscommunication when movers would be at the house - they arrive 30 mins before emailed schedule.' +
        'They were fast, courteous, the estimate was straight to the point, no aggressive sales. Wrapped my furniture well, asked where everything goes, ' +
        'took care to not damage anything, hands down the most cost friendly hourly rate. Got the job done in half the time. Easy payment. Highly recommend. \n' +
        "My only 'complaint' would be that they showed up in a U-Haul truck - which I could've rented for less for the time needed then booking a truck with the company. " +
        'HOWEVER does not take away how amazing this company was.',
    },
    rating: 5,
    publishTime: relativeTimeToTimestamp('2 months ago'),
    relativePublishTimeDescription: '2 months ago',
  },
  {
    authorAttribution: {
      displayName: 'Karyn Davis',
      photoUri:
        'https://lh3.googleusercontent.com/a/ACg8ocIzQYV4mgQ0VLGTDijYAUgBstpaMfmW-H92DU6-gGfQxxImaw=w144-h144-p-rp-mo-br100',
      uri: 'https://www.google.com/maps/contrib/118298829437995359492/reviews?hl=en-GB',
    },
    text: {
      text:
        'The movers were incredibly organized, efficient, careful & hard working. They moved all kinds of house furniture, yard furniture and everything else!\n' +
        'I would highly recommend them for future jobs. They are also very friendly & kind! My move out was a wonderful experience, little stress thank God.',
    },
    rating: 5,
    publishTime: relativeTimeToTimestamp('4 months ago'),
    relativePublishTimeDescription: '4 months ago',
  },
  {
    authorAttribution: {
      displayName: 'Sylvia Flint',
      photoUri:
        'https://lh3.googleusercontent.com/a/ACg8ocKFj5OoPqe5X3lCMZxOxm3t9jivY8waqSy266oLdWLmW8jnGg=w144-h144-p-rp-mo-br100',
      uri: 'https://www.google.com/maps/contrib/106565861145782012687/reviews?hl=en-GB',
    },
    text: {
      text:
        'ICANDO moved my mom last week and they were amazing. From my first call to Nelson to my subsequent questions when I thought we may need to change the date, ' +
        'Nelson was understanding and helpful. On moving Day, Nelson and his partner Trevor were on time and so kind. We and other members of our family have needed movers over the years, ' +
        'but ICANDO provided the best customer service than all of them put together. Thank you Nelson and I wish you all the success in your business!',
    },
    rating: 5,
    publishTime: relativeTimeToTimestamp('2 months ago'),
    relativePublishTimeDescription: '2 months ago',
  },
];

function getReviewTime(r: ReviewWithNumericTime): number {
  if (typeof r.publishTime === 'number') return r.publishTime;
  if (typeof r.time === 'number') return r.time;
  return 0;
}

function sortByTime(reviews: ReviewWithNumericTime[]): ReviewWithNumericTime[] {
  return [...reviews].sort((a, b) => getReviewTime(b) - getReviewTime(a));
}

export type UseTestimonialsReturn = {
  reviews: ReviewWithNumericTime[];
  overallRating: number | undefined;
  totalRatings: number | undefined;
  isLoading: boolean;
  currentSlide: number;
  totalSlides: number;
  goTo: (index: number) => void;
  goNext: () => void;
  goPrev: () => void;
};

export function useTestimonials(): UseTestimonialsReturn {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data, isLoading, isError } = useGoogleReviews({
    placeId: process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID,
  });

  const useFallback =
    isError || !data?.reviews || data.reviews.length === 0 || !!data.error;
  const source = useFallback
    ? FALLBACK_REVIEWS
    : (data?.reviews as ReviewWithNumericTime[]) ?? [];

  const reviews = [
    ...sortByTime(source.filter((r) => (r.rating ?? 0) >= 4)),
    ...sortByTime(
      source.filter((r) => (r.rating ?? 0) >= 4 && (r.rating ?? 0) < 4)
    ),
  ];

  const totalSlides = reviews.length;

  useEffect(() => {
    if (totalSlides <= 1) return;
    const id = setInterval(() => {
      setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(id);
  }, [totalSlides]);

  const goTo = (index: number) => setCurrentSlide(index);
  const goNext = () =>
    setCurrentSlide((prev) =>
      totalSlides ? (prev === totalSlides - 1 ? 0 : prev + 1) : 0
    );
  const goPrev = () =>
    setCurrentSlide((prev) =>
      totalSlides ? (prev === 0 ? totalSlides - 1 : prev - 1) : 0
    );

  return {
    reviews,
    overallRating: useFallback ? undefined : data?.rating,
    totalRatings: useFallback ? undefined : data?.userRatingCount,
    isLoading,
    currentSlide,
    totalSlides,
    goTo,
    goNext,
    goPrev,
  };
}
