import { Dialog, DialogPanel } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import routes from './routes';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { constants } from '@app/components/constants';

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
  isActivePage,
}: NavLinkProps) => {
  const pathname = usePathname();
  // Auto-close menu on route change (SPA navigation)
  useEffect(() => {
    if (mobileMenuOpen) setMobileMenuOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
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
            <Link href={routes.home} className="-m-1.5 p-1.5">
              <span className="sr-only">IcanDo Movers</span>
              <Image
                alt=""
                src="/custom/logo.svg"
                className="h-8 w-auto"
                width={32}
                height={32}
              />
            </Link>
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
                  <Link
                    key={item.name}
                    href={item.href}
                    prefetch
                    onClick={() => setMobileMenuOpen(false)}
                    className={`-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50
                    ${
                      item.href === pathname
                        ? 'text-theme-orange underline underline-offset-4'
                        : ''
                    }
                        `}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                <Link
                  href={routes.quotation}
                  prefetch
                  onClick={() => setMobileMenuOpen(false)}
                  className={`-mx-3 block rounded-lg px-3 py-2 border border-theme-orange rounded-lg bg-theme-orange text-center text-base/7 font-semibold text-gray-900 hover:bg-theme-orange/10
                    ${
                      routes.quotation === pathname
                        ? 'text-white/60 underline underline-offset-4'
                        : 'text-white'
                    }
                        `}
                >
                  {constants.requestQuotationText}
                </Link>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </>
  );
};

export default NavLink;
