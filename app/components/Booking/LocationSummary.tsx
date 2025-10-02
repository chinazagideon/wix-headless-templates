import { SummaryCard } from './SummaryCard';
import { MapPin, Building2, ArrowUpDown, MoveVertical } from 'lucide-react';

export interface LocationSummaryProps {
  title: string;
  address: string;
  buildingType: string;
  hasElevator: string;
  stairsCount: number;
}
export const LocationSummary = ({
  title,
  address,
  buildingType,
  hasElevator,
  stairsCount,
}: LocationSummaryProps) => (
  <div className="bg-white space-y-1 p-1">
    <small className="text-xs font-outfit font-semibold text-gray-900 my-4">
      {title}
    </small>
    <div className="space-y-2">
      <SummaryCard
        icon={<MapPin className="w-5 h-5" />}
        label="Address"
        value={address}
      />
      <SummaryCard
        icon={<Building2 className="w-5 h-5" />}
        label="Building Type"
        value={buildingType}
      />
      {buildingType === 'Apartment' && (
        <>
          <div className="flex flex-row gap-2 w-full">
            <SummaryCard
              icon={<ArrowUpDown className="w-5 h-5" />}
              label="Elevator Available"
              value={hasElevator?.toUpperCase() || 'N/A'}
              className="w-1/2"
            />
            <SummaryCard
              icon={<MoveVertical className="w-5 h-5" />}
              label="Flight of Stairs"
              value={stairsCount || 'N/A'}
              className="w-1/2"
            />
          </div>
        </>
      )}
    </div>
  </div>
);
