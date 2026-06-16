'use client';

import { ServiceInfoViewModel } from '@app/model/service/service.mapper';
import Image from 'next/image';
import Link from 'next/link';
import WixMediaImage from '../Image/WixMediaImage';
import { useWixServices } from '@app/hooks/useWixServices';
import routes from '../Layout/NavBarV2/routes';

const SERVICES = [
  {
    num: '01',
    title: 'Residential Move',
    desc: 'House, condo and apartment moves done carefully and on time.',
    image: '/custom/icando-move-truck.jpg',
    alt: 'ICANDO truck at a Winnipeg home',
  },
  {
    num: '02',
    title: 'Commercial Move',
    desc: 'Offices, retail and warehouse relocations with minimal downtime.',
    image: '/custom/moving-elevator.jpg',
    alt: 'ICANDO mover on the ramp',
  },
  {
    num: '03',
    title: 'Moving Help (Labour only)',
    desc: 'Hire a strong, experienced crew — you provide the truck.',
    image: '/custom/truck-move-2.jpg',
    alt: 'Two movers loading the truck',
  },
];

export default function Services({
  initialServices,
}: {
  initialServices?: ServiceInfoViewModel[];
}) {
  const hookResult = useWixServices();
  const services = initialServices ?? hookResult.services;
  const isLoading = initialServices ? false : hookResult.isLoading;

  const items = (services ?? []).filter((s) => !s?.hidden);
  if (!isLoading && !items.length) return null;

  return (
    <section className="bg-[#FDFAF5] py-20 md:py-24" id="services">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12">
        {/* Header row */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-[11px] font-semibold tracking-[.12em] uppercase text-[#FD6232] mb-2">
              Our Services
            </p>
            <h2
              className="font-serif font-bold text-[#1A1208] leading-[1.15]"
              style={{ fontSize: 'clamp(28px,3.5vw,44px)' }}
            >
              A premium moving service
              <br />
              for every kind of move
            </h2>
          </div>
          <Link
            href={routes.services}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1A1208] hover:text-[#FD6232] transition-colors pb-1 flex-shrink-0"
          >
            View all services <span>→</span>
          </Link>
        </div>
        {/* {wixError && "Unable to load service " } */}
        {isLoading && <p>Loading services...</p>}

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((svc) => (
            <div
              key={svc?.id}
              className="group bg-[#FDFAF5] border border-[#D9D2C4] rounded-[20px] overflow-hidden flex flex-col shadow-[0_1px_6px_rgba(61,26,8,0.05)] hover:shadow-[0_8px_32px_rgba(61,26,8,0.12)] hover:-translate-y-1 transition-all duration-300"
            >
              {/* Photo */}
              <div className="h-[260px] overflow-hidden flex-shrink-0">
                <WixMediaImage
                  media={
                    svc?.info.media?.mainMedia || svc?.info.media?.coverMedia
                  }
                  width={1200}
                  height={600}
                />
              </div>

              {/* Body */}
              <div className="flex flex-col flex-1 px-6 pt-5 pb-7">
                <h3 className="font-serif font-bold text-[#1A1208] text-[22px] leading-[1.2] mb-2.5">
                  {svc?.info.name}
                </h3>
                <p className="text-[14px] text-[#5C4F3D] leading-[1.65] flex-1 mb-5">
                  {svc?.info?.description || 'No description available.'}
                </p>
                <Link
                  href={routes.quick_quote}
                  className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#1A1208] hover:text-[#FD6232] transition-colors group/link"
                >
                  Get a free quote
                  <span className="group-hover/link:translate-x-1 transition-transform inline-block">
                    →
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
