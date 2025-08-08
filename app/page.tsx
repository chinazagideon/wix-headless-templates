'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import {
  ArrowRightIcon,
  Bars3Icon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';

import { WeatherWidget, useWeather } from '@app/components/Weather';
import TestimonialComponent from '@app/components/Testimonials/TestimonialComponent';
import Lines from '@app/components/Design/Lines';

export default function Page() {
  const { weatherData, loading, error } = useWeather();

  return (
    <>
      <div className="bg-white w-full">
        <div className="relative flex flex-col items-center justify-center min-h-screen isolate bg-black transition-all duration-300">
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
                  Live in Winnipeg? We are moving experts. <br />
                  {weatherData?.main && (
                    <span className="font-outfit font-bold text-gray-200 text-sm">
                      Weather now in the city: ~{weatherData?.main?.temp}°
                      <span className="text-base">C</span>,{' '}
                      {weatherData?.weather?.[0]?.description?.toUpperCase()}
                    </span>
                  )}
                </p>
              </div>
              {/* Desktop Button */}
              <div className="hidden lg:flex relative top-40 sm:flex-row items-center lg:items-start gap-4 w-full lg:pt-[5%]">
                <div className="flex-row gap-4 flex">
                  <div className="flex items-center gap-2">
                    <a
                      href="#"
                      className="capitalize rounded-full bg-theme-orange px-3 w-fit py-3 !font-size-10 font-outfit font-light text-white hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 transition-all duration-200 hover:scale-105 flex flex-row items-center gap-2 normal-case"
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

              {/* Mobile Button */}
              <div className="lg:hidden flex flex-col items-center justify-between gap-4 w-full mt-6">
                {/* <div className="flex-row gap-4 flex"> */}
                <div className="flex items-center gap-2">
                  <a
                    href="#"
                    className="capitalize rounded-full bg-theme-orange px-3 w-fit py-3 !font-size-10 font-outfit font-light text-white hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 transition-all duration-200 hover:scale-105 flex flex-row items-center gap-2 normal-case"
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
          {/* Lines SVG Effect - Background */}
          {/* <Lines linesColor="red" strokeWidth={4} /> */}
        </div>
      </div>

      <div className="w-full h-full bg-white dark:bg-black py-10 rounded-lg relative transition-all duration-300">
        <div className="w-[90%] mx-auto flex flex-col justify-center items-center ">
          <Lines
            linesColor="black"
            strokeWidth={1}
            className="lg:mr-60 lg:ml-0 ml-20"
          />

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
                className="w-full h-full rounded-lg"
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

      {/* Testimonial Slider */}
      <TestimonialComponent />
    </>
  );
}
