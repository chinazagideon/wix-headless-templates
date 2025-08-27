'use client';

import ServiceListPreviewView from '@app/components/ServiceList/ServiceListPreview';
import { WixBookingsClientProvider } from '@app/components/Provider/WixBookingsClientProvider';
import { useWixServices } from '@app/hooks/useWixServices';
import HeroWidget from '@app/components/Widget/HeroWdget';
import { Loader } from 'lucide-react';
import Lines from '@app/components/Design/Lines';

const ServicePageContent = () => {
  const { services, isLoading, error } = useWixServices();

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader className="w-10 h-10 animate-spin text-theme-orange" />
        </div>
      ) : error ? (
        <div>Error loading services: {error}</div>
      ) : (
        <>
          <div className="w-full bg-[#D9D9D9] lg:h-[338px] pt-32 px-2 lg:px-20 py-10 lg:py-auto">
            <div className="flex flex-col items-start lg:items-center px-4 justify-center p-2 lg:p-10 py-10">
              <h1 className="font-outfit font-thin lg:text-7xl text-4xl text-black normal-case">
                Our{' '}
                <span className="font-outfit font-bold lg:text-7xl text-4xl normal-case">
                  Services
                </span>
              </h1>
            </div>
          </div>

          <div className="w-full h-full bg-white dark:bg-black py-10 rounded-lg relative transition-all duration-300">
            <div className="w-[90%] mx-auto flex flex-col justify-center items-center ">
              <Lines
                linesColor="black"
                strokeWidth={1}
                className="lg:mr-60 lg:ml-0 ml-20"
              />

              <div className="w-full h-full dark:bg-white flex-col flex justify-center items-center gap-4 lg:w-[90%]">
                <div className="flex flex-col gap-4 lg:px-12 px-0 text-center ">
                  <p className="text-[#000000] dark:text-white text-center text-medium lg:text-2xl font-outfit font-thin">
                    We provide{' '}
                    <span className="font-outfit font-light">
                      exceptional service
                    </span>{' '}
                    that goes above and beyond{' '}
                    <span className="font-outfit font-light">
                      our customers&apos; expectations
                    </span>
                    . From the moment they contact us to the completion of their
                    move, we deliver a{' '}
                    <span className="font-outfit font-light">
                      seamless and stress-free experience
                    </span>
                    . Our dedicated team of professionals is committed to
                    ensuring{' '}
                    <span className="font-outfit font-light">
                      customer satisfaction
                    </span>{' '}
                    at every step.
                  </p>
                  <p className="text-[#000000] dark:text-white text-center text-base font-outfit font-bold">
                    We offer a variety of moving services designed to make the
                    process smoother and less stressful.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center px-4 sm:px-6 lg:px-20  justify-center">
            <ServiceListPreviewView services={services} isLoading={isLoading} />
          </div>
          <HeroWidget />
        </>
      )}
    </>
  );
};

const Page = () => {
  return (
    <WixBookingsClientProvider>
      <ServicePageContent />
    </WixBookingsClientProvider>
  );
};

export default Page;
