import Image from 'next/image';
import {
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import { constants } from '@app/components/constants';

const Footer = () => {
  const fullYear = new Date().getFullYear();
  const contactInfo = [
    {
      rightComment: `${fullYear} ${constants.companyName}. All
                  rights reserved.`,
      logo: (
        <Image
          src={constants.companyLogo}
          alt="Movers"
          width={100}
          height={100}
        />
      ),
      designerByPlaceHolder: `Designed by`,
      designerLogo: (
        <Image
          src={constants.designerLogo}
          alt={constants.designerName}
          className="shadow-md"
          width={60}
          height={60}
        />
      ),
      bbbSeal: (
        <Image
          src={constants.bbbSeal}
          alt="Icando Movers BBB Business Review"
          width={150}
          height={35}
          className="border-0"
        />
      ),
    },
  ];
  return (
    <>
      <footer className="w-full h-full py-5 px-10 bg-[#f95b33]">
        <div className="flex flex-col justify-between lg:items-start items-center gap-2 w-full lg:h-[200px]">
          <div className="flex lg:flex-row flex-col items-start text-black text-2xl font-outfit font-light normal-case w-full">
            <div className="flex flex-col lg:flex-row items-center gap-2 w-full">
              {contactInfo[0].logo}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 w-full ">
          <div className="flex lg:flex-row flex-col items-center lg:items-end justify-between gap-2 w-full mt-4">
            <div className="flex flex-col justify-between lg:flex-row items-center gap-2 w-full">
              <div className="align-start flex flex-row items-center gap-2 hidden lg:block justify-start lg:w-auto py-4">
                <p className="font-bold text-sm font-outfit font-light normal-case">
                  &copy; {contactInfo[0].rightComment}
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
                    {contactInfo[0].bbbSeal}
                  </a>
                </div>
              </div>
              <div className="flex flex-row gap-4 justify-end hidden lg:block">
                <div
                  onClick={() => window.open(constants.designer, '_blank')}
                  className="flex flex-row items-center gap-2 w-full hover:text-theme-orange/60 transition-all duration-300 cursor-pointer lg:w-auto"
                >
                  <p className="text-xs font-outfit font-light ">
                    {contactInfo[0].designerByPlaceHolder}
                  </p>
                  {contactInfo[0].designerLogo}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 lg:hidden justify-center border-t-2 border-theme-orange/10 w-full mt-4 py-6">
            <p className="text-black text-xs font-outfit font-light normal-case py-4">
              &copy; {contactInfo[0].rightComment}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
