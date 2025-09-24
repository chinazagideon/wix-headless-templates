'use client';

import { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';
import { useUserTimezone } from '@app/hooks/useFormattedTimezone';

/**
 * TimePickerDropdownProps interface
 * @param value - The value of the time picker
 * @param onChange - The function to call when the time changes
 * @param disabled - Whether the time picker is disabled
 * @param minTime - The minimum time
 * @param maxTime - The maximum time
 * @param interval - The interval of the time picker
 */
interface TimePickerDropdownProps {
  value: string;
  onChange: (time: string) => void;
  disabled?: boolean;
  minTime?: string; // HH:mm format
  maxTime?: string; // HH:mm format
  interval?: number; // minutes
}

/**
 * TimePickerDropdown component
 * @param value - The value of the time picker
 * @param onChange - The function to call when the time changes
 * @param disabled - Whether the time picker is disabled
 * @param minTime - The minimum time
 * @param maxTime - The maximum time
 * @param interval - The interval of the time picker
 */
export default function TimePickerDropdown({
  value,
  onChange,
  disabled = false,
  minTime = '08:00',
  maxTime = '18:00',
  interval = 30,
}: TimePickerDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userTimezone = useUserTimezone();

  // Generate time slots
  const timeSlots = (() => {
    const slots = [];
    const [minHour, minMinute] = minTime.split(':').map(Number);
    const [maxHour, maxMinute] = maxTime.split(':').map(Number);

    let currentHour = minHour;
    let currentMinute = minMinute;

    while (
      currentHour < maxHour ||
      (currentHour === maxHour && currentMinute <= maxMinute)
    ) {
      const time = `${String(currentHour).padStart(2, '0')}:${String(
        currentMinute
      ).padStart(2, '0')}`;
      const date = new Date();
      date.setHours(currentHour, currentMinute, 0, 0);

      slots.push({
        value: time,
        label: date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
          timeZone: userTimezone,
        }),
      });

      currentMinute += interval;
      if (currentMinute >= 60) {
        currentHour += Math.floor(currentMinute / 60);
        currentMinute = currentMinute % 60;
      }
    }

    return slots;
  })();

  useEffect(() => {
    if (!value) {
      setDisplayValue('');
      return;
    }
    const date = new Date();
    const [hours, minutes] = value.split(':').map(Number);
    date.setHours(hours, minutes, 0, 0);
    setDisplayValue(
      date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: userTimezone,
      })
    );
  }, [value, userTimezone]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block  text-sm font-bold text-gray-600 mb-1.5">
        Pick a time
      </label>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          relative w-full px-4 py-2.5 pl-12 text-left bg-white border rounded-lg
          ${
            disabled
              ? 'cursor-not-allowed bg-gray-50 text-gray-400 border-gray-200'
              : 'cursor-pointer text-gray-900 border-gray-200 hover:border-theme-orange focus:border-theme-orange focus:ring-1 focus:ring-theme-orange'
          }
        `}
      >
        <Clock
          className={`w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 ${
            disabled ? 'text-gray-400' : 'text-gray-500'
          }`}
        />
        <span className="block truncate">{displayValue || 'Select time'}</span>
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          <div className="py-1">
            {timeSlots.map(({ value: timeValue, label }) => (
              <button
                key={timeValue}
                type="button"
                className={`
                  w-full px-4 py-2 text-sm text-left hover:bg-gray-100
                  ${
                    value === timeValue
                      ? 'bg-theme-orange/10 text-theme-orange font-medium'
                      : 'text-gray-900'
                  }
                `}
                onClick={() => {
                  onChange(timeValue);
                  setIsOpen(false);
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="mt-1.5 text-xs text-gray-500">
        Available between {timeSlots[0].label} and{' '}
        {timeSlots[timeSlots.length - 1].label} in {interval} minute intervals
      </p>
    </div>
  );
}
