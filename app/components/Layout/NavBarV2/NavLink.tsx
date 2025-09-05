import { Dialog, DialogPanel } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import routes from './routes';
import Image from 'next/image';

export type NavLinkProps = {
  navigation: { name: string; href: string }[];
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  isActivePage?: (href: string) => boolean;
};

const NavLink = ({
  navigation,
  mobileMenuOpen,
  setMobileMenuOpen,
  isActivePage = () => false,
}: NavLinkProps) => {
  return (
    <>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href={routes.home} className="-m-1.5 p-1.5">
              <span className="sr-only">IcanDo Movers</span>
              <Image
                alt=""
                src="/custom/logo.svg"
                className="h-8 w-auto"
                width={32}
                height={32}
              />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50
                    ${
                      isActivePage(item.href)
                        ? 'text-theme-orange underline underline-offset-4'
                        : ''
                    }
                        `}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="py-6">
                <a
                  href={routes.quotation}
                  className={`-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50
                    ${
                      isActivePage(routes.quotation)
                        ? 'text-theme-orange underline underline-offset-4'
                        : ''
                    }
                        `}
                >
                  Request Quotation
                </a>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </>
  );
};

export default NavLink;
