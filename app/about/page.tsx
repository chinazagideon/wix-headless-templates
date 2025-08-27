'use client';
import Image from 'next/image';
import HeroWidget from '../components/Widget/HeroWdget';
import { useAboutUsItems } from '@app/hooks/useAbout';
import { media as wixMedia } from '@wix/sdk';
import { constants } from '@app/components/constants';

const Page = () => {
  const { data: aboutUsItems, isFetching, isLoading } = useAboutUsItems();
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
      <div className="w-full bg-[#D9D9D9] lg:h-[338px] pt-32 px-2 lg:px-20 py-10 lg:py-auto">
        <div className="flex flex-col items-start lg:items-center px-4 justify-center p-2 lg:p-10 py-10">
          <h1 className="font-outfit font-thin lg:text-7xl text-4xl text-black normal-case">
            About{' '}
            <span className="font-outfit font-bold lg:text-7xl text-4xl normal-case">
              {constants.companyName}
            </span>
          </h1>
          <p className="font-outfit font-thin lg:text-sm text-xs text-black lg:w-[70%] w-full pt-4">
            <span
              dangerouslySetInnerHTML={{ __html: data.aboutDescription || '' }}
            />
          </p>
        </div>
      </div>

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
        <div className="flex flex-col lg:flex-row gap-4 lg:w-full items-center">
          <div className="flex flex-col pt-4 lg:pt-8">
            <h4 className="font-outfit font-bold text-3xl lg:text-4xl text-black normal-case">
              Our Vision
            </h4>
            <p className="font-outfit font-thin lg:text-sm text-xs text-black lg:w-[70%] w-full pt-4">
              {data.ourVision}
            </p>
          </div>
          <div className="flex flex-col pt-4 lg:pt-8">
            <h4 className="font-outfit font-bold text-3xl lg:text-4xl text-black normal-case">
              Our Mission
            </h4>
            <p className="font-outfit font-thin lg:text-sm text-xs text-black lg:w-[70%] w-full pt-4">
              {data.ourMission}
            </p>
          </div>
        </div>
      </div>
      <HeroWidget />
    </>
  );
};

export default Page;
