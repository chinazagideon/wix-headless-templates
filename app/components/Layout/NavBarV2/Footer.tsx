import Image from 'next/image';
import {
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';

const Footer = () => {
  return (
    <>
      <footer className="w-full h-full py-5 px-10 bg-[#D9D9D9]">
        <div className="flex flex-col justify-between lg:items-start items-center gap-2 w-full lg:h-[200px]">
          <div className="flex flex-row items-start text-black text-2xl font-outfit font-light normal-case ">
            <Image
              src="/custom/logo.svg"
              alt="Movers"
              width={100}
              height={100}
              className="w-20 h-20"
            />
          </div>
        </div>

        <div className="flex lg:flex-row flex-col items-center lg:items-end justify-between gap-2 w-full mt-4">
          <div className="align-start flex flex-row items-center gap-2 hidden lg:block">
            <p className="text-black text-sm font-outfit font-light normal-case">
              &copy; 2025 Movers. All rights reserved.
            </p>
          </div>
          <div className="align-end flex flex-row items-center gap-2">
            <div className="flex flex-col gap-2 w-full">
              <p className="font-outfit font-thin  text-[#023465] font-size-10 capitalise flex  flex-col lg:flex-row items-center gap-2 lg:pl-5 pl-0">
                Contact Information:
              </p>

              <div className="justify-end flex w-full sm:flex-row flex-col items-center lg:items-end lg:gap-10 gap-2 lg:mb-0 mb-4 ">
                {/* <div className='flex flex-col items-center gap-2'> */}
                <div className="flex lg:flex-col  flex-col items-center lg:items-start ">
                  <p className="font-outfit font-light text-gray-700 flex flex-col lg:flex-row items-center gap-2">
                    {' '}
                    <MapPinIcon className="w-5 h-5 text-theme-orange/50" />{' '}
                    <span className="text-sm">
                      246 Hatcher Road, Winnipeg <br />
                      MB R2C 3W7, Canada
                    </span>
                  </p>
                </div>
                <div className="flex lg:flex-col flex-col items-center lg:items-start">
                  <p className="text-gray-700 text-1xl font-outfit font-light normal-case flex flex-col lg:flex-row items-center gap-2">
                    <EnvelopeIcon className="w-3 h-3 text-theme-orange/50" />{' '}
                    <span className="text-sm">info@icanndo.ca</span>
                  </p>
                  <p className="text-gray-700 text-1xl font-outfit font-light normal-case flex  flex-col lg:flex-row items-center gap-2">
                    <PhoneIcon className="w-3 h-3 text-theme-orange/50" />{' '}
                    <span className="text-sm">+1 (120) 422-95871</span>
                  </p>
                </div>
                {/* </div> */}
              </div>
            </div>
            {/* <div className='flex gap-4'>
              <p className='text-black text-sm font-outfit font-light normal-case'>
                Terms of Service
              </p>
              <p className='text-black text-sm font-outfit font-light normal-case'>
                Privacy Policy
              </p>
            </div> */}
          </div>
          <div className="flex flex-row items-center gap-2 lg:hidden justify-center border-t-2 border-theme-orange/10 w-full mt-4 py-4">
            <p className="text-black text-sm font-outfit font-light normal-case">
              &copy; 2025 Movers. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
