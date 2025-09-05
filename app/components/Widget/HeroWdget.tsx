import routes from '@app/components/Layout/NavBarV2/routes';
import Link from 'next/link';
import ThemeButton from '../Button/ThemeButton';

const HeroWidget = ({ className }: { className?: string }) => {
  const quotation_url = routes.quotation;
  return (
    <>
      <div
        className={`w-full bg-[#011a34] px-4 lg:px-20 py-10 pb-20 lg:py-auto overflow-hidden relative ${className}`}
        style={{
          background: `url('/custom/icando-move-truck.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-black/80 z-0"></div>
        <div className="flex flex-col justify-center items-center text-center relative z-10 p-1 lg:p-4">
          <h1 className="font-outfit font-bold lg:text-7xl text-4xl text-white normal-case">
            Winnipeg’s{' '}
            <span className="font-outfit font-thin lg:text-7xl text-4xl normal-case">
              Smartest Move
            </span>
          </h1>
          <p className="font-outfit font-thin text-lg text-white lg:w-[70%] w-full pt-4">
            At ICANDO Movers, we guarantee top-quality service to make your move
            seamless. Our skilled team handles your belongings with care,
            ensuring safe arrival at your new home. Trust us for an efficient,
            worry free move where quality is our promise.
          </p>
          <div className="flex flex-col lg:flex-row  items-center justify-center gap-4 w-full pt-10 lg:pt-[5%] animate-fade-in-delay">
            <div className="flex items-center gap-2 animate-slide-in-left">
              <ThemeButton isSubmitting={false} href={quotation_url}>
                Get a free quote
              </ThemeButton>
              {/* <a
                href={quotation_url}
                className="z-50 text-sm rounded-full bg-theme-orange px-3 w-fit py-2 !font-size-10 font-outfit font-light text-white hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 transition-all duration-200 hover:scale-105 flex flex-row items-center gap-2 normal-case"
              >
                Get a free quote
                <ArrowRightIcon className="w-6 h-6 rounded-full bg-[#000] p-1  text-white hover:scale-105 transition-all duration-200" />
              </a> */}
            </div>
            <Link
              href={routes.relocation_hub}
              prefetch
              className="flex underline flex-col text-md py-5 font-outfit font-light text-white hover:text-gray-200 transition-colors duration-200 animate-slide-in-right"
            >
              Visit our relocation hub
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroWidget;
