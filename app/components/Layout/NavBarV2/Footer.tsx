import Image from 'next/image';
import {
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import { constants } from '@app/components/constants';

const Footer = () => {
  return (
    <>
      <footer className="w-full h-full py-5 px-10 bg-[#D9D9D9]">
        <div className="flex flex-col justify-between lg:items-start items-center gap-2 w-full lg:h-[200px]">
          <div className="flex lg:flex-row flex-col items-start text-black text-2xl font-outfit font-light normal-case w-full">
            <div className="flex flex-col lg:flex-row items-center gap-2 w-full">
              <Image
                src={constants.companyLogo}
                alt="Movers"
                width={100}
                height={100}
                className="w-20 h-20 "
              />
            </div>
            {/* <div className="w-full flex flex-col gap-4 lg:justify-end lg:items-end py-0 lg:py-10 border-b-2 border-theme-orange/10 pb-4"> */}
            {/* <div className="flex flex-row gap-4 "> */}
            {/* <p className="font-outfit font-light  text-[#023465] text-xs capitalise flex flex-col lg:flex-row items-center gap-2 lg:pl-5 pl-0">
                  Contact Information:
                </p> */}

            {/* <div className="flex w-full flex-col lg:flex-row items-center lg:items-end lg:gap-6 gap-2 lg:mb-0 mb-4 ">
                  <div className="flex lg:flex-col  flex-col items-center text-center lg:text-left lg:items-start gap-2 ">
                    <h4 className="font-outfit font-light text-[#023465] text-xs capitalise flex flex-col lg:flex-row items-center gap-2 lg:pl-5 pl-0">
                      Contact Information:
                    </h4>
                    <p className="font-outfit font-light text-gray-700 flex flex-col lg:flex-row items-center gap-2">
                      {' '}
                      <MapPinIcon className="w-5 h-5 text-theme-orange/50" />{' '}
                      <span className="text-sm">
                        <span className="font-outfit font-bold">
                          {constants.companyAddress},
                        </span>{' '}
                        <br />
                        <span className="font-outfit font-light">
                          {constants.companyCity}, {constants.companyProvince}{' '}
                          {constants.companyPostalCode}
                        </span>
                      </span>
                    </p>
                  </div>

                  <div className="flex lg:flex-col flex-col items-center lg:items-start gap-1">
                    <p className="text-gray-700 text-1xl font-outfit font-light normal-case flex flex-col lg:flex-row items-center gap-2">
                      <EnvelopeIcon className="w-3 h-3 text-theme-orange/50" />{' '}
                      <span
                        onClick={() =>
                          window.open(
                            `mailto:${constants.companyEmail}`,
                            '_blank'
                          )
                        }
                        className="text-sm cursor-pointer hover:text-theme-orange/60 transition-all duration-300"
                      >
                        {constants.companyEmail}
                      </span>
                    </p>
                    <p className="text-gray-700 text-1xl font-outfit font-light normal-case flex  flex-col lg:flex-row items-center gap-2">
                      <PhoneIcon className="w-3 h-3 text-theme-orange/50" />{' '}
                      <span
                        onClick={() =>
                          window.open(`tel:${constants.companyPhone}`, '_blank')
                        }
                        className="text-sm cursor-pointer hover:text-theme-orange/60 transition-all duration-300"
                      >
                        {constants.companyPhone}
                      </span>
                    </p>
                  </div>
                </div> */}
            {/* </div> */}
            {/* </div> */}
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 w-full ">
          <div className="flex lg:flex-row flex-col items-center lg:items-end justify-between gap-2 w-full mt-4">
            <div className="flex flex-col justify-between lg:flex-row items-center gap-2 w-full">
              <div className="align-start flex flex-row items-center gap-2 hidden lg:block justify-start lg:w-auto">
                <p className="text-black text-sm font-outfit font-light normal-case">
                  &copy; {new Date().getFullYear()} {constants.companyName}. All
                  rights reserved.
                </p>
              </div>
              <div className="flex flex-row justify-center items-center gap-2 w-full hover:text-theme-orange/60 transition-all duration-300 cursor-pointer lg:w-auto">
                <div className="flex lg:flex-row flex-col justify-between items-center gap-2 w-full">
                  <a
                    href={constants.bbbReviewLink}
                    target="_blank"
                    rel="nofollow"
                    className="hover:opacity-80 transition-all duration-300 flex lg:flex-row flex-col items-center gap-2"
                  >
                    <p className="text-black text-xs font-outfit font-light normal-case">
                      BBB Accredited Business
                    </p>
                    <Image
                      src="/blue-badge-184-70-blue-bbb-1000009479.png"
                      alt="Icando Movers BBB Business Review"
                      width={92}
                      height={35}
                      className="border-0"
                    />
                  </a>
                </div>
              </div>
              <div className="flex flex-row gap-4 justify-end hidden lg:block">
                <div
                  onClick={() => window.open('https://evoocta.com', '_blank')}
                  className="flex flex-row items-center gap-2 w-full hover:text-theme-orange/60 transition-all duration-300 cursor-pointer lg:w-auto"
                >
                  <p className="text-black text-xs font-outfit font-light ">
                    Designed by
                  </p>
                  <Image
                    src={'/custom/evoocta.png'}
                    alt="evoocta"
                    width={60}
                    height={60}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 lg:hidden justify-center border-t-2 border-theme-orange/10 w-full mt-4 py-2">
            <p className="text-black text-xs font-outfit font-light normal-case">
              &copy; {new Date().getFullYear()} {constants.companyName}. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
