'use client';
import Image from 'next/image';
import HeroWidget from '../components/Widget/HeroWdget';
import PageHeader from '@app/components/Layout/PageHeader';
import { media as wixMedia } from '@wix/sdk';
import { constants } from '@app/components/constants';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { PhoneIcon } from '@heroicons/react/24/outline';
import QuoteComponent from '@app/components/Quote/QuoteComponent';
import { useWixServices } from '@app/hooks/useWixServices';

const Page = () => {
  const { services, isLoading, error: wixError } = useWixServices();
  const data = {
    contactPhone: constants.companyPhone,
    contactEmail: constants.companyEmail,
    contactAddress:
      constants.companyAddress +
      ' ' +
      constants.companyCity +
      ' ' +
      constants.companyProvince +
      ' ' +
      constants.companyPostalCode,
  };
  return (
    <>
      <PageHeader
        title={`Contact ${constants.companyName}`}
        description={'Feel free to reach out with any questions or concerns.'}
      />

      {/* <div className="w-full pt-4 lg:pt-12 px-4 sm:px-6 justify-center h-[300px] rounded-lg  overflow-hidden flex flex-col lg:flex-row gap-4 lg:gap-10 pb-10">
        <div className="hidden lg:flex flex-col gap-4 lg:w-[100%] justify-center items-center">
          {src ? (
            <Image
              src={src}
              alt="About image"
              width={width}
              height={height}
              className="rounded-lg"
            />
          ) : null}
        </div>
      </div> */}
      <div className="flex w-full flex-col justify-center px-4 gap-1 sm:px-6 lg:px-20 py-10 items-center">
        <div className="flex flex-row lg:flex-row gap-4 lg:w-full items-center">
          <div className="flex flex-col pt-4 lg:pt-8 lg:w-full w-full">
            <h4 className="font-outfit font-bold text-3xl lg:text-4xl text-black normal-case p-4 text-center">
              Contact Information
            </h4>
            <div className="flex lg:flex-row flex-col gap-4 justify-center items-center w-full">
              <div className="font-outfit font-thin text-xs text-black w-full pt-4 border border-gray-200 p-6 rounded-lg flex flex-col items-center text-center">
                <span className="flex items-center justify-center p-4">
                  <MapPinIcon className="w-5 h-5 text-theme-orange/50" />
                </span>
                <h4 className="font-outfit font-thin text-sm text-black normal-case items-center justify-center">
                  Address
                </h4>
                <p className="font-outfit font-bold text-lg text-black">
                  {data.contactAddress}
                </p>
              </div>
              <div className="font-outfit font-thin text-xs text-black  w-full pt-4 border border-gray-200 p-6 rounded-lg flex flex-col items-center text-center">
                <span className="flex items-center justify-center p-4">
                  <EnvelopeIcon className="w-5 h-5 text-theme-orange/50" />
                </span>
                <h4 className="font-outfit font-thin text-sm text-black normal-case items-center justify-center">
                  Email
                </h4>
                <a
                  href={`mailto:${data.contactEmail}`}
                  className="font-outfit font-bold text-lg text-black"
                >
                  {data.contactEmail}
                </a>
              </div>
              <div className="font-outfit font-thin text-xs text-black w-full pt-4 border border-gray-200 p-6 rounded-lg flex flex-col items-center text-center">
                <span className="flex items-center justify-center p-4">
                  <PhoneIcon className="w-5 h-5 text-theme-orange/50" />
                </span>
                <h4 className="font-outfit font-thin text-xs text-black normal-case items-center justify-center">
                  Phone
                </h4>
                <a
                  href={`tel:${data.contactPhone}`}
                  className="font-outfit font-bold text-lg text-black"
                >
                  {data.contactPhone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <QuoteComponent services={services} />

      <HeroWidget />
    </>
  );
};

export default Page;
