'use client';

import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { WeatherWidget, useWeather } from '@app/components/Weather';
import TestimonialComponent from '@app/components/Testimonials/TestimonialComponent';
import QuoteComponent from '@app/components/Quote/QouteComponent';
import Lines from '@app/components/Design/Lines';
import routes from '@app/components/Layout/NavBarV2/routes';
import { constants } from '@app/components/constants';
import { useWixServices } from '@app/hooks/useWixServices';
import ServiceListPreviewView from '@app/components/ServiceList/ServiceListPreview';
import { Loader } from 'lucide-react';
import WixMediaImage from '@app/components/Image/WixMediaImage';
import HeroWidget from '@app/components/Widget/HeroWdget';
// import GoogleReviews from '@app/components/Testimonials/GoogleReviews';
import { useGoogleReviews } from '@app/hooks/useGoogleReviews';

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    // Prefetch high-traffic routes
    router.prefetch(routes.quotation);
    router.prefetch(routes.services);
    router.prefetch(routes.about);
  }, [router]);
  // const { weatherData, loading, error } = useWeather();
  const { services, isLoading, error: wixError } = useWixServices();
  const { data: reviewsData } = useGoogleReviews({
    website: 'icanndomovers.ca',
  });
  // const [items, setItems] = useState<any[]>([]);
  // useEffect(() => {
  //   fetchProductItems().then(setItems as any).catch(() => setItems([]));
  // }, []);
  // console.log(items);
  // queryPostsFunction();
  // queryReviewsFunction();
  return (
    <>
      <div className="bg-white w-full">
        <div className="relative flex flex-col items-center justify-center min-h-screen isolate bg-black transition-all duration-300">
          {/* Video Background with Enhanced UX */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            {/* Fallback Image Background */}
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: 'url(/custom/icando-move-truck.jpg)',
              }}
            ></div>

            {/* Video Background */}
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster="/custom/icando-move-truck.jpg"
              crossOrigin="anonymous"
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-1000"
              aria-hidden="true"
              role="presentation"
              onLoadedData={(e) => {
                const video = e.target as HTMLVideoElement;
                video.classList.remove('opacity-0');
                video.classList.add('opacity-100');
              }}
              onError={(e) => {
                // Hide video on error, fallback image will show
                const video = e.target as HTMLVideoElement;
                video.style.display = 'none';
              }}
            >
              <source src="/custom/videos/icandomovers.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Dark Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/60"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 w-[90%] mx-auto flex flex-col lg:flex-row items-center justify-center  px-5 lg:pt-0 pt-10">
            {/* Left: Hero Text - More Width */}

            <div className="flex flex-col justify-center items-center  text-center lg:text-left py-24 lg:py-10 lg:pr-12 lg:mt-0 mt-10">
              {/* <div className="space-y-6 mt-0 gap-4 animate-fade-in-up"> */}
              {/* <h1 className="text-center font-outfit normal-case font-thin text-pretty justify-center text-gray-200 text-3xl sm:text-4xl mb-2 drop-shadow-md animate-fade-in-delay">
                  Start your move today{' '}
                </h1>
                <span className="font-outfit font-bold text-6xl pt-2">
                  {constants.companyName}
                </span> */}
              {/* {weatherData?.main && (
                    <span className="font-outfit font-bold text-gray-200 text-sm animate-fade-in-delay-2">
                      Weather now in the city: ~{weatherData?.main?.temp}°
                      <span className="text-base">C</span>,{' '}
                      {weatherData?.weather?.[0]?.description?.toUpperCase()}
                    </span>
                  )} */}
              {/* </div> */}
              {/* Desktop Button */}
              {/* <div className=" flex flex-col items-center lg:items-center gap-4 w-full lg:pt-[10%] animate-fade-in-delay">
                <div className="flex-row gap-4 flex">
                  <div className="flex items-center gap-2 animate-slide-in-left">
                    <a
                      href={routes.quotation}
                      className="capitalize rounded-full bg-theme-orange px-3 w-fit py-3 text-base text-sm font-outfit font-bold text-white hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 transition-all duration-200 hover:scale-105 flex flex-row items-center gap-2 normal-case"
                    >
                      Get a free quote
                      <ArrowRightIcon className="w-5 h-5 rounded-full bg-[#000] p-1 text-white hover:scale-105 transition-all duration-200" />
                    </a>
                  </div>
                  <a
                    href={routes.about}
                    className="flex flex-col py-5 font-outfit font-bold text-white hover:text-gray-200 transition-colors duration-200 animate-slide-in-right"
                  >
                    About Us
                  </a>
                </div>
              </div> */}
            </div>
            {/* Right: Weather Widget - Less Width */}
            {/* <div className="hidden lg:flex flex-1 items-center justify-end h-full relative lg:pt-[1%]">
              <div className="sticky top-12 right-0 z-20 w-[300px] max-w-xs animate-fade-in-delay-2">
                <WeatherWidget
                  weatherData={weatherData}
                  loading={loading}
                  error={error}
                />
              </div>
            </div> */}
          </div>
          {/* Lines SVG Effect - Background */}
          {/* <Lines linesColor="red" strokeWidth={4} /> */}
        </div>
      </div>
      <QuoteComponent services={services} />
      <div className="w-full h-full py-10 px-4 lg:px-10 rounded-lg relative transition-all duration-300">
        <div className="w-full h-full dark:bg-white flex-col md:flex-col lg:flex-row flex px-0 lg:px-10 justify-between items-center gap-4 mt-0 md:mt-4 mb-0 md:mb-6">
          <div className="flex flex-col gap-4 px-0 py-10 text-center lg:text-left">
            <Lines
              layer="background"
              strokeWidth={5}
              linesColor="orange"
              className="lg:mr-60 lg:ml-0 ml-20"
            />

            <h3 className="text-black dark:text-white text-4xl lg:text-4xl md:text-5xl font-outfit font-thin drop-shadow-lg animate-slide-in-left">
              Redefining the{' '}
              <span className="font-din-neu font-outfit font-bold animate-slide-in-right">
                Neighborhood Moving Services
              </span>
            </h3>
            <p className="text-black dark:text-white text-center lg:text-left text-base font-outfit font-light">
              Moving can often feel overwhelming, especially when relocating to
              a different city or province.
            </p>
            <p className="text-black dark:text-white text-center lg:text-left text-base font-outfit font-light">
              We offer a variety of moving services designed to make the process
              smoother and less stressful.
            </p>
            <div className="flex flex-row gap-4 w-full justify-center md:justify-start lg:justify-start">
              <div className="flex items-center gap-2 animate-slide-in-left">
                <Link
                  href={routes.about}
                  prefetch
                  className="capitalize rounded-full bg-theme-orange px-3 w-fit py-3 text-base text-sm font-outfit font-bold text-white hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 transition-all duration-200 hover:scale-105 flex flex-row items-center gap-2 normal-case"
                >
                  About us{' '}
                  <ArrowRightIcon className="w-5 h-5 rounded-full bg-[#000] p-1 text-white hover:scale-105 transition-all duration-200" />
                </Link>
              </div>
              <Link
                href={routes.services}
                prefetch
                className="flex flex-col py-5 underline font-outfit font-bold text-black hover:text-theme-orange transition-colors duration-200 animate-slide-in-right"
              >
                Our services
              </Link>
            </div>
          </div>

          <div className="flex  items-center justify-center w-full">
            <Image
              src="/custom/moving-elevator.jpg"
              className="h-full rounded-lg w-full lg:w-3/3 "
              alt="Movers"
              width={500}
              height={500}
            />
          </div>
        </div>
      </div>

      <div className="w-full h-full bg-white relative transition-all duration-300 ">
        <div className="flex w-full h-full dark:bg-white flex-col md:flex-row lg:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center justify-center bg-white dark:bg-black w-full lg:pt-0 pt-4">
            <Image
              src="/custom/mobile-prototype.png"
              className="w-1/3 rounded-lg p-6"
              alt="Movers"
              width={500}
              height={500}
            />
          </div>
          <div className="flex flex-col gap-1 w-full px-4 lg:px-0 md:px-5 py-10 px-0 text-center justify-center items-center lg:text-left bg-white  md:border-l border-theme-orange/20 rounded-lg ">
            <h1 className="text-black text-2xl font-outfit font-thin normal-case text-center items-center">
              <span className=" font-outfit font-bold">
                Its Easy, Convenient <br />{' '}
              </span>
              Download our mobile app
            </h1>

            <p className="text-theme-orange mt-2 dark:text-white text-center lg:text-left text-xs font-outfit font-light">
              book your next move and track your move in real-time.
            </p>
            <div className="flex flex-row gap-4 mt-2 ">
              <a href="#" className="">
                <Image
                  src="/custom/download-apple-store.svg"
                  alt="Movers"
                  className="w-28"
                  width={800}
                  height={244}
                />
              </a>
              <a href="#" className="">
                <Image
                  src="/custom/download-google-store.svg"
                  alt="Movers"
                  className="w-28"
                  width={800}
                  height={265}
                />
              </a>
            </div>
            <span className="text-black dark:text-white text-xs mt-2 font-outfit font-light ">
              Available on Apple and Google Play Store soon.
            </span>
          </div>
        </div>
      </div>

      {/* Testimonial Slider */}
      <TestimonialComponent />
      <HeroWidget />
    </>
  );
}
