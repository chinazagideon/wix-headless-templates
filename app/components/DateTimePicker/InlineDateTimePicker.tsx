'use client';

import { useEffect, useMemo, useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import {
  toWixDateTime,
  formatDateForDisplay,
  formatTimeForDisplay,
} from '../../utils/wix-date-converter';
import TimePickerDropdown from './TimePickerDropdown';

/**
 * InlineDateTimePickerProps interface
 * @param value - The value of the date and time picker
 * @param onChange - The function to call when the date and time changes
 * @param error - The error message to display
 */
interface InlineDateTimePickerProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}

/**
 * InlineDateTimePicker component
 * @param value - The value of the date and time picker
 * @param onChange - The function to call when the date and time changes
 * @param error - The error message to display
 */
export default function InlineDateTimePicker({
  value,
  onChange,
  error,
}: InlineDateTimePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');

  useEffect(() => {
    if (value) {
      try {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          setSelectedDate(date);
          const hh = String(date.getHours()).padStart(2, '0');
          const mm = String(date.getMinutes()).padStart(2, '0');
          setSelectedTime(`${hh}:${mm}`);
        }
      } catch (error) {
        console.error('Invalid date value:', error);
      }
    }
  }, [value]);

  const displayTime = useMemo(() => {
    if (!selectedDate || !selectedTime) return '';
    const [hh, mm] = selectedTime.split(':');
    const composed = new Date(selectedDate);
    composed.setHours(parseInt(hh, 10), parseInt(mm, 10), 0, 0);
    return formatTimeForDisplay(composed);
  }, [selectedDate, selectedTime]);

  const commitIfReady = (next?: { date?: Date | null; time?: string }) => {
    const d = next?.date !== undefined ? next.date : selectedDate;
    const t = next?.time !== undefined ? next.time : selectedTime;
    if (!d || !t) return;
    const [hh, mm] = t.split(':');
    let h24 = parseInt(hh, 10);
    const composed = new Date(d);
    composed.setHours(h24, parseInt(mm, 10), 0, 0);
    onChange(toWixDateTime(composed));
  };

  const handleDateSelect = (date?: Date) => {
    if (!date) return;
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    if (date < startOfToday) return;
    setSelectedDate(date);
    commitIfReady({ date });
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    commitIfReady({ time });
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {selectedDate && displayTime && (
        <div className="mb-6 p-4 bg-theme-orange/10 rounded-xl border border-theme-orange/20">
          <div className="flex items-center justify-center space-x-4">
            <Calendar className="w-5 h-5 text-theme-orange" />
            <span className="text-lg font-outfit font-semibold text-gray-900">
              {formatDateForDisplay(selectedDate)}
            </span>
            <Clock className="w-5 h-5 text-theme-orange" />
            <span className="text-lg font-outfit font-semibold text-gray-900">
              {displayTime}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Calendar (same as popover DateTimePicker, but inline) */}
        <div className="flex lg:flex-row flex-col bg-white justify-center items-right lg:px-16 px-0">
          <DayPicker
            mode="single"
            selected={selectedDate ?? undefined}
            onSelect={handleDateSelect}
            disabled={{ before: new Date() }}
            styles={{
              caption: { color: '#111827', fontFamily: 'Outfit, sans-serif' },
              head_cell: { color: '#6b7280', fontFamily: 'Outfit, sans-serif' },
              day: { color: '#374151', fontFamily: 'Outfit, sans-serif' },
            }}
            modifiersStyles={{
              selected: { backgroundColor: '#FA5C33', color: '#000' },
              today: { color: '#FA5C33', fontWeight: 700 },
            }}
          />
        </div>

        {/* Time Picker */}
        <div className="flex lg:flex-row flex-col bg-white lg:mt-6 ml-0">
          <h3 className="text-gray-900 text-base font-medium mb-5 text-center">
            {/* {selectedDate ? formatDateForDisplay(selectedDate) : ''} */}
          </h3>

          <TimePickerDropdown
            value={selectedTime}
            onChange={handleTimeChange}
            disabled={!selectedDate}
            minTime="08:00"
            maxTime="18:00"
            interval={30}
          />
        </div>
      </div>

      {error && (
        <p className="mt-2 text-red-500 text-sm font-outfit">{error}</p>
      )}
    </div>
  );
}
