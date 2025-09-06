'use client';

import {
  MapPinIcon,
  PhoneIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightIcon,
  PhoneArrowDownLeftIcon,
} from '@heroicons/react/24/outline';

import { useEffect, useState } from 'react';
import NavLink from './NavLink';
import routes from './routes';
import { constants } from '@app/components/constants';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const navigation = [
    { name: 'Home', href: routes.home },
    { name: 'About Us', href: routes.about },
    { name: 'Services', href: routes.services },
    { name: 'Pricing', href: routes.pricing },
    { name: 'Relocation Hub', href: routes.relocation_hub },
    { name: 'Contact Us', href: routes.contact },
  ];
  const quotation_url = routes.quotation;

  const isActivePage = (path: string) => path === pathname;

  return (
    <>
      <header className="absolute inset-x-0 mx-auto top-0 z-50">
        <nav
          aria-label="Global"
          className="flex items-center justify-center p-0 lg:p-4 px-0 lg:px-8 md:px-0"
        >
          <div className="flex flex-col justify-center items-center w-full">
            {/* <div className="w-full lg:w-[95%] mx-auto bg-[#011a34] dark:bg-black text-white p-2 flex flex-row justify-center items-center rounded-none lg:rounded-2xl mb-0 lg:mb-2 sm:flex-col">
              <div className="flex flex-col  md:flex-row lg:flex-row justify-between items-center md:w-full w-fit"> */}
            {/* <div
                  className="flex flex-col w-full lg:rounded-none rounded-none cursor-pointer hover:bg-[#011a34] lg:border-none border-b border-theme-orange/10 lg:mb-0 mb-2 transition-all duration-300"
                  onClick={() => {
                    const quote = document.getElementById('quote');
                    if (quote) {
                      quote.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  <Link
                    href="/#quote"
                    className="flex flex-row items-center gap-2 hover:text-theme-orange transition-all duration-300"
                  >
                    <p className="flex flex-row  items-center gap-2 text-white text-sm lg:text-md font-outfit shadow-md font-thin px-2 py-2">
                      In a rush
                      <span className="font-light text-xs text-theme-orange border border-theme-orange rounded-full px-2 py-1 hover:bg-theme-orange hover:text-white transition-all duration-300">
                        get a free quote!
                      </span>
                    </p>
                  </Link>
                </div> */}
            {/* <p className="hidden md:flex text-sm font-light text-white font-outfit flex-row items-center justify-start gap-2">
                  <MapPinIcon
                    className="size-4 text-theme-orange"
                    height={6}
                    width={6}
                  />
                  <span className="font-outfit font-thin text-sm text-white ">
                    {constants.companyCity}, {constants.companyProvince}
                  </span>
                </p> */}
            {/* <div className="text-sm font-light text-gray-900 font-outfit flex flex-col md:flex-row items-center md:justify-end justify-center gap-2 pr-0 lg:pr-2 w-full">
                  <span className="font-outfit text-xs md:text-sm font-thin lg:text-sm text-white">
                    Need help moving? Call us today!
                  </span>
                  <div className="flex flex-row items-center justify-end gap-1">
                    <PhoneArrowDownLeftIcon
                      className="size-4 pt-1 text-theme-orange "
                      height={4}
                      width={4}
                    />
                    <span
                      title="click to speak with us now"
                      className="font-outfit font-light underline cursor-pointer text-sm text-theme-orange cursor-pointer hover:text-theme-orange/60 transition-all duration-300"
                      onClick={() =>
                        window.open(`tel:${constants.companyPhone}`, '_blank')
                      }
                    >
                      {constants.companyPhone}
                    </span>
                  </div>
                </div> */}
            {/* </div>
            </div> */}

            <div className="w-full bg-white dark:bg-black dark:text-white rounded-none lg:rounded-lg p-4 flex flex-col justify-center items-center">
              <div className="flex flex-row justify-between items-center w-full">
                <div className="flex lg:flex-1">
                  <Link href={routes.home} className="-m-1.5 p-1.5">
                    <span className="sr-only">{constants.companyName}</span>
                    <Image
                      alt=""
                      src={constants.companyLogo}
                      height={32}
                      width={100}
                      className="h-8 w-auto"
                    />
                  </Link>
                </div>

                <div className="flex lg:hidden w-full justify-end">
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(true)}
                    className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                  >
                    <span className="sr-only">Open main menu</span>
                    <Bars3Icon aria-hidden="true" className="size-6" />
                  </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      prefetch
                      className={`text-sm/6 font-light  md:text-xs/5 text-gray-900 dark:text-white font-outfit ${
                        isActivePage(item.href)
                          ? 'text-theme-orange underline underline-offset-4'
                          : ''
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                  <Link
                    href={quotation_url}
                    prefetch
                    className={`text-xs font-light md:text-xs/5 lg:text-sm text-gray-900 dark:text-white font-outfit ${
                      isActivePage(quotation_url)
                        ? 'text-theme-orange underline underline-offset-4'
                        : ''
                    }`}
                  >
                    {constants.requestQuotationText}{' '}
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
            {/* {pathname === routes.home && (
              <div
                className="flex flex-col justify-center items-center lg:w-[95%] w-full h-full bg-[#011a34]/90 lg:rounded-none rounded-none cursor-pointer hover:bg-[#011a34] transition-all duration-300"
                onClick={() => {
                  const quote = document.getElementById('quote');
                  if (quote) {
                    quote.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <p className="flex flex-row items-center gap-2 text-gray-100 text-xl font-outfit shadow-md font-thin px-2 py-2">
                  In a rush?{' '}
                  <Link
                    href="/#quote"
                    className="flex flex-row items-center gap-2"
                  >
                    get a free quote{' '}
                    <ArrowRightIcon className="w-4 h-4 rounded-full bg-[#fff] p-1  text-black hover:scale-105 transition-all duration-200" />
                  </Link>
                </p>
              </div>
            )} */}
          </div>
        </nav>

        <NavLink
          navigation={navigation}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          isActivePage={isActivePage as any}
        />
      </header>
    </>
  );
};

export default Header;
