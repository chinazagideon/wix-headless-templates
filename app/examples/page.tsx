'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import {
  ArrowRightIcon,
  Bars3Icon,
  MapPinIcon,
  PhoneIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';

const navigation = [
  { name: 'Home', href: '#' },
  { name: 'About', href: '#' },
  { name: 'Services', href: '#' },
  { name: 'Relocation Hub', href: '#' },
  { name: 'Contact Us', href: '#' },
];

import { WeatherWidget, useWeather } from '../components/Weather';
import TestimonialComponent from '../components/Testimonials/TestimonialComponent';

export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { weatherData, loading, error } = useWeather();

  return (
    <>
      <div className="bg-white w-full">
        <div className="relative flex flex-col items-center justify-center min-h-screen isolate bg-black">
          {/* Video Background with Enhanced UX */}
          <div className="absolute inset-0 w-full h-full overflow-hidden ">
            {/* Loading State */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 animate-pulse"></div>

            {/* Video with Loading Handler */}
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover opacity-0 transition-opacity duration-1000"
              onLoadedData={(e) => {
                const video = e.target as HTMLVideoElement;
                video.classList.remove('opacity-0');
                video.classList.add('opacity-100');
              }}
              onError={(e) => {
                // Fallback to static background on error
                const video = e.target as HTMLVideoElement;
                video.style.display = 'none';
              }}
            >
              <source src="/custom/moving-video.mp4" type="video/mp4" />
              <source src="/custom/moving-video.webm" type="video/webm" />
            </video>

            {/* Dark Overlay with Gradient */}
            <div
              className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 overlay"
              style={{
                backgroundImage: 'url(/custom/truck-move-2.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundBlendMode: 'overlay',
              }}
            ></div>

            {/* Gray Overlay */}
            <div className="absolute inset-0 bg-black/80"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 w-[90%] mx-auto flex flex-col lg:flex-row items-center justify-center min-h-[80vh] px-5 lg:pt-0 pt-10">
            {/* Left: Hero Text - More Width */}
            <div className="flex-[2] flex flex-col justify-center items-center lg:items-start text-center lg:text-left py-24 lg:py-0 lg:pr-12">
              <div className="space-y-6 mt-0 gap-4">
                <h3 className="text-white text-6xl sm:text-7xl font-outfit font-thin drop-shadow-lg">
                  Your Move{' '}
                  <span className="font-din-neu font-outfit font-bold">
                    Mastered
                  </span>
                </h3>
                <p className="font-outfit font-light text-pretty text-gray-200 sm:text-xl/8 mb-2 drop-shadow-md">
                  Live in Winnipeg? We are moving experts.
                </p>
                {weatherData?.main && (
                  <p>
                    <span className="font-outfit font-bold text-gray-200 text-sm">
                      Weather now in the city: ~{weatherData?.main?.temp}°
                      <span className="text-base">C</span>,{' '}
                      {weatherData?.weather?.[0]?.description?.toUpperCase()}
                    </span>
                  </p>
                )}
              </div>
              <div className="hidden lg:flex relative top-40 sm:flex-row items-center lg:items-start gap-4 w-full lg:pt-[5%]">
                <div className="flex-row gap-4 flex">
                  <div className="flex items-center gap-2">
                    <a
                      href="#"
                      className="rounded-3xl bg-theme-orange px-3 w-fit py-3 text-base font-outfit font-light text-white hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 transition-all duration-200 hover:scale-105 flex flex-row items-center gap-2 normal-case"
                    >
                      What We Do
                      <ArrowRightIcon className="w-10 h-10 rounded-full bg-[#000] p-1 text-white hover:scale-105 transition-all duration-200" />
                    </a>
                  </div>
                  <a
                    href="#"
                    className="flex flex-col py-5 font-outfit font-bold text-white hover:text-gray-200 transition-colors duration-200"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
            {/* Right: Weather Widget - Less Width */}
            <div className="hidden lg:flex flex-1 items-center justify-end h-full relative lg:pt-[15%]">
              <div className="sticky top-32 right-0 z-20 w-[300px] max-w-xs">
                <WeatherWidget
                  weatherData={weatherData}
                  loading={loading}
                  error={error}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-full bg-white dark:bg-black py-10 rounded-lg">
        <div className="w-[90%] mx-auto flex flex-col justify-center items-center ">
          <div className="w-full h-full dark:bg-white sm:flex-row flex-col flex justify-between items-center gap-4 lg:grid lg:grid-cols-2">
            <div className="flex flex-col gap-4 lg:px-12 px-0">
              <h1 className="text-black dark:text-white text-2xl font-outfit font-thin normal-case">
                Why <span className=" font-outfit font-bold">Movers?</span>
              </h1>
              <p className="text-black dark:text-white text-base font-outfit font-light">
                Moving can often feel overwhelming, especially when relocating
                to a different city or province.
              </p>
              <p className="text-black dark:text-white text-base font-outfit font-light">
                We offer a variety of moving services designed to make the
                process smoother and less stressful.
              </p>
              <div className="flex flex-row gap-4">
                <a
                  href="#"
                  className="rounded-lg bg-theme-orange px-1 w-fit py-1 pr-3 pl-3 text-base font-outfit font-light text-white  hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 transition-all duration-200 hover:scale-105 flex flex-row items-center gap-2"
                >
                  About Us
                  <ArrowRightIcon className="w-5 h-5 rounded-full bg-[#000] p-1 text-white hover:scale-105 transition-all duration-200" />
                </a>
              </div>
            </div>
            <div className="flex flex-col">
              <Image
                src="/custom/moving-elevator.jpg"
                className="w-full h-full object-cover rounded-lg"
                alt="Movers"
                width={500}
                height={500}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-full bg-black py-10 mt-10">
        <div className="w-full lg:w-[70%] mx-auto flex flex-col justify-center items-center gap-3">
          <h1 className="text-white dark:text-white text-2xl font-outfit font-light mb-4 normal-case">
            <span className="font-bold">Our</span> Services
          </h1>
          <div className="flex lg:flex-row flex-col w-full gap-8 lg:grid lg:grid-cols-3 px-4">
            <div className="flex flex-col rounded-lg bg-[#D9D9D9] dark:bg-black p-4 items-center justify-center gap-4 w-full">
              <Image
                src="/custom/city.svg"
                alt="Movers"
                className="w-15 h-15"
                width={100}
                height={100}
              />

              <h2 className="text-black dark:text-white text-base font-outfit font-light">
                Commercial Moving
              </h2>
              <p className="text-black dark:text-white text-sm font-outfit font-thin text-center">
                We offer a variety of commercial moving services designed to
                make the process smoother and less stressful.
              </p>
            </div>
            <div className="flex flex-col rounded-lg bg-[#D9D9D9] dark:bg-black p-4 items-center justify-center gap-4">
              <Image
                src="/custom/palm.svg"
                alt="Movers"
                className="w-15 h-15"
                width={100}
                height={100}
              />

              <h2 className="text-black dark:text-white text-base font-outfit font-light">
                Residential Moving
              </h2>
              <p className="text-black dark:text-white text-sm font-outfit font-thin text-center">
                We offer a variety of commercial moving services designed to
                make the process smoother and less stressful.
              </p>
            </div>
            <div className="flex flex-col rounded-lg bg-[#D9D9D9] dark:bg-black p-4 items-center justify-center gap-4">
              <Image
                src="/custom/surbway.svg"
                alt="Movers"
                className="w-15 h-15"
                width={100}
                height={100}
              />

              <h2 className="text-black dark:text-white text-base font-outfit font-light">
                Storage
              </h2>
              <p className="text-black dark:text-white text-sm font-outfit font-thin text-center">
                We offer a variety of commercial moving services designed to
                make the process smoother and less stressful.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-full py-10 px-10 relative">
        <div className="flex flex-col justify-center items-center ">
          <h1 className="text-black dark:text-white text-2xl font-outfit font-light normal-case">
            <span className="font-bold">Customer</span> Voices
          </h1>
          <div className="flex flex-col justify-center items-center">
            {/* <svg width="250" viewBox="0 0 300 1404" fill="none" xmlns="http://www.w3.org/2000/svg" className="mil-lines">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M1 892L1 941H299V892C299 809.71 232.29 743 150 743C67.7096 743 1 809.71 1 892ZM0 942H300V892C300 809.157 232.843 742 150 742C67.1573 742 0 809.157 0 892L0 942Z" className="mil-move"></path>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M299 146V97L1 97V146C1 228.29 67.7096 295 150 295C232.29 295 299 228.29 299 146ZM300 96L0 96V146C0 228.843 67.1573 296 150 296C232.843 296 300 228.843 300 146V96Z" className="mil-move"></path>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M299 1H1V1403H299V1ZM0 0V1404H300V0H0Z"></path>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M150 -4.37115e-08L150 1404L149 1404L149 0L150 -4.37115e-08Z"></path>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M150 1324C232.29 1324 299 1257.29 299 1175C299 1092.71 232.29 1026 150 1026C67.7096 1026 1 1092.71 1 1175C1 1257.29 67.7096 1324 150 1324ZM150 1325C232.843 1325 300 1257.84 300 1175C300 1092.16 232.843 1025 150 1025C67.1573 1025 0 1092.16 0 1175C0 1257.84 67.1573 1325 150 1325Z" className="mil-move"></path>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M300 1175H0V1174H300V1175Z" className="mil-move"></path>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M150 678C232.29 678 299 611.29 299 529C299 446.71 232.29 380 150 380C67.7096 380 1 446.71 1 529C1 611.29 67.7096 678 150 678ZM150 679C232.843 679 300 611.843 300 529C300 446.157 232.843 379 150 379C67.1573 379 0 446.157 0 529C0 611.843 67.1573 679 150 679Z" className="mil-move"></path>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M299 380H1V678H299V380ZM0 379V679H300V379H0Z" className="mil-move"></path>
            </svg> */}
            {/* <h1 className="text-theme-orange/30 text-lg font-outfit font-light normal-case font-size-400">
            
            </h1> */}
            <p className="text-black dark:text-white text-sm font-outfit font-light normal-case">
              Hear what our satisfied customers have to say about their moving
              experience
            </p>
          </div>

          {/* Testimonial Slider */}
          <TestimonialComponent />
        </div>
      </div>
    </>
  );
}
