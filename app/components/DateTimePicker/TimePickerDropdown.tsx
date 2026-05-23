'use client';

import { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';
import { useUserTimezone } from '@app/hooks/useFormattedTimezone';

interface TimePickerDropdownProps {
  value: string;
  onChange: (time: string) => void;
  disabled?: boolean;
  minTime?: string; // HH:mm format
  maxTime?: string; // HH:mm format
  interval?: number; // minutes
  labelClassName?: string;
}

export default function TimePickerDropdown({
  value,
  onChange,
  disabled = false,
  minTime = '08:00',
  maxTime = '18:00',
  interval = 30,
  labelClassName = 'text-gray-700',
}: TimePickerDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const [displayValue, setDisplayValue] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const userTimezone = useUserTimezone();

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

  // Decide whether the dropdown should open upward to avoid viewport overflow.
  useEffect(() => {
    if (!isOpen || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    setDropUp(spaceBelow < 220);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className={`block text-sm mb-1.5 ${labelClassName}`}>Pick a time</label>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          relative w-full px-4 py-2.5 pl-8 text-left bg-white border rounded-lg
          ${
            disabled
              ? 'cursor-not-allowed bg-gray-50 text-gray-400 border-gray-200'
              : 'cursor-pointer text-gray-900 border-gray-200 hover:border-theme-orange focus:border-theme-orange focus:ring-1 focus:ring-theme-orange'
          }
        `}
      >
        <Clock
          size={15}
          className={`absolute left-2 top-1/2 -translate-y-1/2 ${
            disabled ? 'text-gray-400' : 'text-gray-500'
          }`}
        />
        <span className="block truncate text-xs">
          {displayValue || 'Select time'}
        </span>
      </button>

      {isOpen && !disabled && (
        <div
          className={`
            absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg
            max-h-48 sm:max-h-60 overflow-auto
            ${dropUp ? 'bottom-full mb-1' : 'top-full mt-1'}
          `}
        >
          <div className="py-1">
            {timeSlots.map(({ value: timeValue, label }) => (
              <button
                key={timeValue}
                type="button"
                className={`
                  w-full px-4 py-2 text-xs text-left hover:bg-gray-100
                  ${
                    value === timeValue
                      ? 'bg-theme-orange/10 text-theme-orange'
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
    </div>
  );
}
