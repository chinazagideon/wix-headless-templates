'use client';
import { usePriceListItems } from "@app/hooks/usePricing";
import { useListCollections, useGetCollection } from "@app/hooks/useCollections";

const Page = () => {

  const { data: priceListItems } = usePriceListItems();
  const { data: collections } = useListCollections();
  const { data: collection } = useGetCollection('"PriceList"');

  console.log(collection);
  const tableHeaders = [
    {
      ...collections?.fields.map((item: any) => ({
        label: item.label,
        key: item.key,
      })),
    }
  ];

  // console.log(collection);

  console.log(tableHeaders);

  const data = priceListItems?.map((item: any) => ({
    location: item.location,
    distanceKm: item.distanceKm,
    truckFee: item.truckFee,
    priceListImage: item.priceListImage,
    effectiveDate: item.effectiveDate,
  }));
  // console.log(data);

  const generateId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  return (
    <>
      <div className="w-full bg-[#D9D9D9] lg:h-[338px] pt-32 px-2 lg:px-20 py-10 lg:py-auto">
        <div className="flex flex-col items-start lg:items-center px-4 justify-center p-2 lg:p-10 py-10">
          <h1 className="font-outfit font-thin lg:text-6xl text-4xl text-black normal-case mb-4">
            <span className="text-theme-orange font-bold">Pricing</span>
          </h1>
          <p className="text-gray-500 text-sm">
            Choose the plan that's right for you
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full px-2 lg:px-20 py-10 lg:py-auto">
        <div
          className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
          <table className="w-full text-left table-auto min-w-max">
            <thead>
              <tr>
                <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                  <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                    Location
                  </p>
                </th>
                <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                  <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                    Distance (km)
                  </p>
                </th>
                <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                  <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                    Truck Fee
                  </p>
                </th>
                <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                  <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70"></p>
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
                    <td className="p-4 border-b border-blue-gray-50">
                      <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                        {item.distanceKm}
                      </p>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                        {item.truckFee}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Page;