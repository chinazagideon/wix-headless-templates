'use client';

import {
  MapPinIcon,
  PhoneIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import { useState } from 'react';
import NavLink from './NavLink';
import routes from './routes';
import { constants } from '@app/components/constants';
import Image from 'next/image';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigation = [
    { name: 'Home', href: routes.home },
    { name: 'About Us', href: routes.about },
    { name: 'Services', href: routes.services },
    { name: 'Pricing', href: routes.pricing },
    { name: 'Relocation Hub', href: routes.relocation_hub },
    { name: 'Contact Us', href: routes.contact },
  ];
  const quotation_url = routes.quotation;

  const isActivePage = (path: string) => {
    return path === window.location.pathname;
  };

  return (
    <>
      <header className="absolute inset-x-0 mx-auto top-0 z-50">
        <nav
          aria-label="Global"
          className="flex items-center justify-center p-6 lg:px-8"
        >
          <div className="flex flex-col justify-center items-center w-full">
            <div className="w-[95%] mx-auto bg-black dark:bg-black text-white p-2 flex flex-row justify-center items-center rounded-2xl mb-2 sm:flex-col">
              <div className="flex justify-between items-center w-full">
                <p className="text-sm font-light text-white font-outfit flex flex-row items-center justify-start gap-2">
                  <MapPinIcon
                    className="size-4 text-theme-orange"
                    height={6}
                    width={6}
                  />
                  <span className="font-outfit font-thin text-sm text-white">
                    {constants.companyCity}, {constants.companyProvince}
                  </span>
                </p>
                <p className="text-sm font-light text-gray-900 font-outfit flex flex-row items-center justify-end gap-2">
                  <span className="hidden sm:block font-outfit font-thin text-sm text-white">
                    Need help moving? Call us today!
                  </span>
                  <PhoneIcon
                    className="size-4 text-theme-orange"
                    height={6}
                    width={6}
                  />
                  <span
                    className="font-outfit font-thin text-sm text-white cursor-pointer"
                    onClick={() =>
                      window.open(`tel:${constants.companyPhone}`, '_blank')
                    }
                  >
                    {constants.companyPhone}
                  </span>
                </p>
              </div>
            </div>
            <div className="w-full bg-white dark:bg-black dark:text-white rounded-lg p-4 flex flex-col justify-center items-center">
              <div className="flex flex-row justify-between items-center w-full">
                <div className="flex lg:flex-1">
                  <a href={routes.home} className="-m-1.5 p-1.5">
                    <span className="sr-only">{constants.companyName}</span>
                    <Image
                      alt=""
                      src={constants.companyLogo}
                      height={32}
                      width={100}
                      className="h-8 w-auto"
                    />
                  </a>
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
                    <a
                      key={item.name}
                      href={item.href}
                      className={`text-sm/6 font-light  md:text-xs/10 lg:text-sm text-gray-900 dark:text-white font-outfit ${
                        isActivePage(item.href)
                          ? 'text-theme-orange underline underline-offset-4'
                          : ''
                      }`}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                  <a
                    href={quotation_url}
                    className="text-sm/6 font-light md:text-xs lg:text-sm text-gray-900 dark:text-white font-outfit"
                  >
                    Request Quotation <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <NavLink
          navigation={navigation}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      </header>
    </>
  );
};

export default Header;
