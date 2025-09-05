'use client';
import Image from 'next/image';
import HeroWidget from '../components/Widget/HeroWdget';
import PageHeader from '@app/components/Layout/PageHeader';
import { useAboutUsItems } from '@app/hooks/useAbout';
import { media as wixMedia } from '@wix/sdk';
import { constants } from '@app/components/constants';
import { BinocularsIcon, Loader, Gauge } from 'lucide-react';

const Page = () => {
  const {
    data: aboutUsItems,
    isFetching,
    isLoading,
    error,
  } = useAboutUsItems();
  const data = {
    aboutTitle: aboutUsItems?.[0]?.title_fld,
    aboutDescription: aboutUsItems?.[0]?.description_fld,
    ourVision: aboutUsItems?.[0]?.ourVision,
    ourMission: aboutUsItems?.[0]?.ourMission,
    image: aboutUsItems?.[0]?.image_fld,
    description: aboutUsItems?.[0]?.description_fld,
  };
  // Fill crop to exact size
  const width = 1200;
  const height = 800;
  const src =
    typeof data.image === 'string' && data.image
      ? (() => {
          try {
            return wixMedia.getScaledToFillImageUrl(
              data.image,
              width,
              height,
              {}
            );
          } catch {
            return null;
          }
        })()
      : null;

  return (
    <>
      <PageHeader
        title={`About ${constants.companyName}`}
        description={
          <span
            dangerouslySetInnerHTML={{ __html: data.aboutDescription || '' }}
          />
        }
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
      {isFetching || isLoading ? (
        <div className="flex flex-col justify-center items-center h-screen py-2">
          <Loader className="w-5 h-5 mr-2 animate-spin text-theme-orange" />
          <span className="text-gray-600">Loading...</span>
        </div>
      ) : null}
      {error ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-red-500">Error loading about us items</p>
          {/* <p className="text-red-500">{error }</p> */}
        </div>
      ) : null}
      <div className="flex flex-col justify-center px-4 gap-1 sm:px-6 lg:px-20 py-10 items-center">
        {!isFetching && !isLoading && !error ? (
          <div className="flex flex-col lg:flex-row gap-12 w-full items-center lg:w-[90%]">
            <div className="flex flex-col pt-4 lg:pt-8">
              <span className="flex items-center justify-center p-6">
                <BinocularsIcon className="w-10 h-10 text-theme-orange" />{' '}
              </span>
              <h4 className="font-outfit text-center font-light text-lg lg:text-2xl text-black normal-case">
                Our Vision
              </h4>
              <p className="font-outfit text-center font-bold lg:text-md text-sm text-black pt-4">
                {data.ourVision}
              </p>
            </div>
            <div className="flex flex-col pt-4 lg:pt-8">
              <span className="flex items-center justify-center p-6">
                <Gauge className="w-10 h-10 text-theme-orange" />{' '}
              </span>
              <h4 className="font-outfit text-center font-light text-lg lg:text-2xl text-black normal-case">
                Our Mission
              </h4>
              <p className="font-outfit font-bold text-center lg:text-md text-sm text-black  pt-4">
                {data.ourMission}
              </p>
            </div>
          </div>
        ) : null}
      </div>
      <HeroWidget />
    </>
  );
};

export default Page;
