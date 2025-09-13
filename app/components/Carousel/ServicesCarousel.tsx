'use client';

import Carousel from '@app/components/Carousel/Carousel';
import Link from 'next/link';
import WixMediaImage from '@app/components/Image/WixMediaImage';
import { ServiceInfoViewModel } from '@app/model/service/service.mapper';

export default function ServicesCarousel({
  services,
}: {
  services: ServiceInfoViewModel[] | undefined;
}) {
  const items = (services ?? []).filter((s) => !s.hidden);
  if (!items.length) return null;

  return (
    <Carousel className="rounded-lg" autoPlay intervalMs={5000}>
      {items.map((s) => (
        <div key={s.id} className="relative w-full">
          <Link href={`/services`} prefetch className="block">
            <WixMediaImage
              media={s.info.media?.mainMedia || s.info.media?.coverMedia}
              width={1200}
              height={600}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
              <h3 className="text-lg font-outfit font-semibold">
                {s.info.name}
              </h3>
            </div>
          </Link>
        </div>
      ))}
    </Carousel>
  );
}
