import React from 'react';
import { Clock } from 'lucide-react';
import { TimeSlot } from '@app/hooks/useAvailability';

interface TimeSlotButtonProps {
  slot: TimeSlot;
  selected: boolean;
  onClick: (slot: TimeSlot) => void;
}

/**
 * TimeSlotButton component for displaying available time slots
 */
const TimeSlotButton: React.FC<TimeSlotButtonProps> = ({ slot, selected, onClick }) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const startTime = formatTime(slot.startDate);
  const endTime = formatTime(slot.endDate);

  return (
    <button
      onClick={() => onClick(slot)}
      disabled={!slot.isAvailable}
      className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all duration-200 ${
        selected
          ? 'border-theme-orange bg-theme-orange text-white shadow-lg'
          : slot.isAvailable
          ? 'border-gray-300 hover:border-theme-orange hover:bg-orange-50 text-gray-900'
          : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
      }`}
    >
      <Clock className="w-4 h-4" />
      <span className="font-medium">
        {startTime} - {endTime}
      </span>
    </button>
  );
};

export default TimeSlotButton;
