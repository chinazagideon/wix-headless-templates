import Image from 'next/image';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import HeroWidget from '../components/Widget/HeroWdget';

const Page = () => {
  return (
    <>
      <div className="w-full bg-[#D9D9D9] lg:h-[338px] pt-32 px-4 sm:px-6 lg:px-20 py-10 lg:py-auto">
        <div className="lg:mt-15 mt-10 lg:items-start items-center justify-center">
          <h1 className="font-outfit font-thin lg:text-7xl text-4xl text-black normal-case">
            About{' '}
            <span className="font-outfit font-bold lg:text-7xl text-4xl normal-case">
              IcanDo
            </span>
          </h1>
        </div>
      </div>
      <div className="w-full bg-white pt-4 lg:pt-12 px-4 sm:px-6 lg:px-32 flex flex-col lg:flex-row gap-4 lg:gap-10 pb-10">
        <div className="flex flex-col gap-4 lg:w-1/2 justify-center">
          <div className="flex flex-col pt-4 lg:pt-8">
            <h4 className="font-outfit font-bold text-3xl lg:text-4xl text-black normal-case">
              Our Vision
            </h4>
            <p className="font-outfit font-thin lg:text-sm text-xs text-black lg:w-[70%] w-full pt-4">
              Our vision is to revolutionize the moving industry by becoming the
              leading global provider of reliable and customer-centric moving
              services. We envision a future where moving is no longer a
              stressful experience, but rather a seamless and enjoyable process
              for individuals and businesses worldwide.
            </p>
          </div>
          <div className="flex flex-col pt-4 lg:pt-8">
            <h4 className="font-outfit font-bold text-3xl lg:text-4xl text-black normal-case">
              Our Mission
            </h4>
            <p className="font-outfit font-thin lg:text-sm text-xs text-black lg:w-[70%] w-full pt-4">
              Our mission is to provide exceptional moving services that exceed
              customer expectations. Our core values of customer satisfaction,
              affordability, trustworthiness, reliability, ease of booking
              services, and good customer support guide every aspect of our
              operations.
            </p>
          </div>
          <div className="flex flex-row justify-start pt-4">
            <div className="items-center justify-start gap-2 animate-slide-in-left">
              <a
                href="#"
                className="z-50 text-sm rounded-full bg-theme-orange px-3 w-fit py-2 !font-size-10 font-outfit font-light text-white hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 transition-all duration-200 hover:scale-105 flex flex-row items-center gap-2 normal-case"
              >
                Our Services
                <ArrowRightIcon className="w-6 h-6 rounded-full bg-[#000] p-1  text-white hover:scale-105 transition-all duration-200" />
              </a>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex flex-col gap-4 lg:w-1/2 justify-center items-center">
          <Image
            src={'/custom/moving-package-icando.jpg'}
            alt=""
            width={500}
            height={500}
            className="rounded-lg"
          />
        </div>
      </div>
      <HeroWidget />
    </>
  );
};

export default Page;
