import { useQuery } from '@tanstack/react-query';
import { getServiceAvailability } from '@app/model/availability/availability-api';
import { useClientAuthSession } from '@app/hooks/useClientAuthSession';
import { wixClient } from '@app/server/wix';
import { useGetMySitePropertiesFunction } from '@app/hooks/useGetMySiteProperties';

async function getAvailabilityTimeSlot(
  serviceId: string,
  localStartDate: string,
  localEndDate: string,
  timeZone: string,
  location: any,
  options: any,
) {
  const mySiteProperties = await useGetMySitePropertiesFunction();
  console.log('mySiteProperties', mySiteProperties);
  const response = await wixClient.availabilityTimeSlots.getAvailabilityTimeSlot(
    serviceId,
    localStartDate,
    localEndDate,
    timeZone,
    location,
    options,
  );
  return response;
}
// export const useAvailability = ({
//   serviceId,
//   from,
//   to,
//   timezone = Intl.DateTimeFormat().resolvedOptions().timeZone,
//   slotsPerDay,
//   limit,
// }: {
//   serviceId?: string | string[];
//   from: string;
//   to: string;
//   timezone?: string;
//   slotsPerDay?: number;
//   limit?: number;
// }) => {
//   const wixSession = useClientAuthSession();
//   return useQuery(
//     [
//       'calendar-availability',
//       serviceId,
//       from,
//       to,
//       wixSession,
//       timezone,
//       slotsPerDay,
//       limit,
//     ],
//     () =>
//       getServiceAvailability(wixSession, {
//         serviceId,
//         from,
//         to,
//         timezone,
//         slotsPerDay,
//         limit,
//       })
//   );
// };
