'use client';
import { usePriceListItems } from '@app/hooks/usePricing';
import Lines from '@app/components/Design/Lines';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import routes from '@app/components/Layout/NavBarV2/routes';

// import { useListCollections, useGetCollection } from "@app/hooks/useCollections";

const Page = () => {
  const {
    data: priceListItems,
    isLoading,
    isError,
    isFetching,
  } = usePriceListItems();
  // const { data: collections } = useListCollections();
  // const { data: collection } = useGetCollection('"PriceList"');

  // console.log(collection);
  // const tableHeaders = [
  //   {
  //     ...collections?.fields.map((item: any) => ({
  //       label: item.label,
  //       key: item.key,
  //     })),
  //   }
  // ];

  // console.log(collections);

  // console.log(tableHeaders);

  const data = priceListItems?.map((item: any) => ({
    location: item.location,
    distanceKm: item.distanceKm,
    truckFee: item.truckFee,
    priceListImage: item.priceListImage,
    effectiveDate: item.effectiveDate,
  }));
  // console.log(data);

  const generateId = () => {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  };

  return (
    <>
      <div className="w-full bg-[#D9D9D9] lg:h-[338px] pt-32 px-2 lg:px-20 py-10 lg:py-auto">
        <div className="flex flex-col items-start lg:items-center px-4 justify-center p-2 lg:p-10 py-10">
          <h1 className="font-outfit font-thin lg:text-6xl text-4xl text-black normal-case mb-4">
            <span className="text-theme-orange font-bold">Pricing</span>
          </h1>
          <p className="text-gray-500 text-sm">
            Affordable and reliable moving services available at your fingertips
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full px-2 lg:px-20 py-10 lg:py-auto">
        <div className="w-[90%] mx-auto flex flex-col justify-center items-center ">
          <Lines
            linesColor="black"
            strokeWidth={1}
            className="lg:mr-60 lg:ml-0 ml-60 z-10"
            layer="background"
          />

          <div className="w-full h-full dark:bg-white flex-col flex justify-center items-center gap-4 lg:w-[90%]">
            <div className="flex flex-col gap-4 lg:px-12 px-0 text-center ">
              <p className="text-[#000000] dark:text-white text-center text-medium lg:text-2xl font-outfit font-thin">
                Getting a Moving{' '}
                <span className="font-outfit font-light">
                  Quote in Winnipeg
                </span>{' '}
                that goes above and beyond{' '}
                <span className="font-outfit font-light">
                  and throughout Manitoba{' '}
                </span>
              </p>
              <p className="text-[#000000] dark:text-white text-center text-base font-outfit font-bold flex justify-center items-center gap-2">
                <Link
                  href={routes.quotation}
                  className="flex items-center gap-2 text-theme-orange underline underline-offset-4"
                >
                  Request Quote
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="relative flex flex-col w-full lg:w-2/3 h-full overflow-scroll text-gray-700 bg-gray-100 shadow-md rounded-xl bg-clip-border space-y-4 mt-4">
          <table className="w-full text-left table-auto min-w-max">
            <thead>
              <tr>
                <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                  <p className="block font-sans text-sm antialiased font-bold leading-none text-black opacity-70">
                    Location
                  </p>
                </th>
                <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                  <p className="block font-sans text-sm antialiased font-bold leading-none text-black opacity-70">
                    Distance (km)
                  </p>
                </th>
                <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                  <p className="block font-sans text-sm antialiased font-bold leading-none text-black opacity-70">
                    Truck Fee
                  </p>
                </th>
              </tr>
            </thead>

            <tbody>
              {data && data.length > 0 ? (
                data?.map((item: any) => (
                  <tr key={generateId()}>
                    <td className="p-4 border-b border-blue-gray-50">
                      <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                        {item.location}
                      </p>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50 item">
                      <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                        {item.distanceKm}
                      </p>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                        {item.truckFee}
                        {item.currency}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-4 text-center">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {isFetching && (
            <div className="flex justify-center items-center h-full">
              <div className="w-full h-full flex justify-center items-center">
                <div className="w-10 h-10 border-t-transparent border-b-transparent border-r-transparent border-l-transparent border-t-gray-500 border-r-gray-500 border-l-gray-500 border-b-gray-500 rounded-full animate-spin"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
