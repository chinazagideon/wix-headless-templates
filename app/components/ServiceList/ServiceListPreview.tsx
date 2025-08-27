'use client';
import { ServiceInfoViewModel } from '@app/model/service/service.mapper';
import { useServiceFormattedPrice } from '@app/hooks/useServiceFormattedPrice';
import WixMediaImage from '@app/components/Image/WixMediaImage';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function ServiceListPreviewView({
  services,
  isLoading,
}: {
  services: ServiceInfoViewModel[];
  isLoading?: boolean;
}) {
  const visibleServices = (services ?? []).filter((s) => !s.hidden);
  const smClassName = (visibleServices.length ?? 0) > 1 ? 'sm:grid-cols-2' : '';
  const mdClassName = (visibleServices.length ?? 0) > 2 ? 'md:grid-cols-3' : '';

  return (
    <div className="w-full mx-auto px-4">
      {visibleServices.length ? (
        <>
          <div
            className={`flex flex-wrap my-3 m-auto grid grid-cols-1 gap-6 ${smClassName} ${mdClassName}`}
          >
            {visibleServices.map((service, index) => (
              <ServiceCardPreview service={service} key={service.id} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center">
          No services found.
          {/* Click{' '} */}
          {/* <a
            href="https://manage.wix.com/account/site-selector?actionUrl=https%3A%2F%2Fmanage.wix.com%2Fdashboard%2F%7BmetaSiteId%7D%2Fbookings%2Fservices%2Ftemplates-catalog%3Forigin%3DHeadless"
            target="_blank"
            rel="noreferrer"
            className="text-highlight"
          >
            here
          </a>{' '}
          to go to the business dashboard to add services. Once added, they will
          appear here. */}
        </div>
      )}
    </div>
  );
}

const ServiceCardPreview = ({ service }: { service: ServiceInfoViewModel }) => {
  const formattedPrice = useServiceFormattedPrice(
    service!.payment!.paymentDetails
  );

  return (
    <div className="w-full rounded-none overflow-hidden mx-auto relative h-full min-h-[300px] text-black">
      <span className="font-bold text-xl">
        <WixMediaImage
          media={
            service.info.media?.mainMedia || service.info.media?.coverMedia
          }
          width={640}
          height={480}
        />
        {/* <div className="absolute top-0 right-0 pb-3 flex flex-row gap-2 rounded-md p-2 bg-white rounded-sm">
          <ShoppingCartIcon className="h-4 w-4 text-theme-orange" />
          <p className="text-sm font-bold font-outfit text-theme-orange">
            {formattedPrice.userFormattedPrice}
          </p>
        </div> */}
        <div className="pt-6 px-3 text-center hover:text-theme-orange transition-colors text-black">
          {service.info.name}
        </div>
      </span>
      <div className="font-outfit text-sm text-center p-3">
        <div className="hover:text-gray-300 pb-3 transition-colors">
          <p className="text-1xs font-light font-outfit text-gray-500">
            {service.info?.description?.length &&
            service.info?.description?.length > 400
              ? service.info?.description?.slice(0, 400) + '...'
              : service.info.description}
          </p>
          {/* <a href={`/service/${service.slug}`} className="underline">
            Read More
          </a> */}
        </div>
      </div>
    </div>
  );
};
