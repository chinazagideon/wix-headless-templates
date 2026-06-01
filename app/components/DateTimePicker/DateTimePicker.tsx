'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Calendar as CalendarIcon, X as CloseIcon } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';
import TimePickerDropdown from './TimePickerDropdown';

type DateTimePickerProps = {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputClassName?: string;
  popoverClassName?: string;
};

export default function DateTimePicker(props: DateTimePickerProps) {
  const {
    value,
    onChange,
    placeholder = 'Select date and time',
    inputClassName = '',
    popoverClassName = '',
  } = props;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [tempDate, setTempDate] = useState<Date | undefined>(undefined);
  const [tempTime, setTempTime] = useState<string>('');

  const formattedValue = useMemo(() => {
    if (!value) return '';
    try {
      const d = new Date(value);
      return isNaN(d.getTime()) ? '' : format(d, 'MMM d, yyyy HH:mm');
    } catch {
      return '';
    }
  }, [value]);

  const open = () => {
    try {
      if (value) {
        const d = new Date(value);
        if (!isNaN(d.getTime())) {
          setTempDate(d);
          setTempTime(format(d, 'HH:mm'));
        } else {
          setTempDate(undefined);
          setTempTime('');
        }
      } else {
        setTempDate(undefined);
        setTempTime('');
      }
    } catch {
      setTempDate(undefined);
      setTempTime('');
    }
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  const commit = () => {
    if (!tempDate || !tempTime) return;
    const composed = `${format(tempDate, 'yyyy-MM-dd')}T${tempTime}`;
    onChange(composed);
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      const node = wrapperRef.current;
      if (node && !node.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className={inputClassName}
        value={formattedValue}
        readOnly
        onClick={open}
      />
      <button
        type="button"
        aria-label="Open date and time picker"
        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-theme-orange"
        onClick={open}
      >
        <CalendarIcon className="w-5 h-5" />
      </button>

      {isOpen && (
        /* Full-width on mobile, constrained popover on sm+. Stays absolute so
           it isn't clipped by overflow-x:hidden on body. */
        <div
          className={`
            absolute top-full mt-2 left-0 right-0 z-50
            sm:right-auto sm:min-w-[300px] sm:max-w-[360px]
            rounded-lg
            border border-theme-orange/30
            bg-[#0b2447] text-white shadow-xl
            ${popoverClassName}
          `}
        >
          <div className="flex items-center justify-between px-3 py-2 border-b border-theme-orange/20">
            <span className="text-sm text-gray-200">Pick date & time</span>
            <button
              type="button"
              className="text-gray-400 hover:text-white"
              aria-label="Close"
              onClick={close}
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="p-3">
            <div className="w-full overflow-x-hidden flex justify-center">
              <DayPicker
                mode="single"
                selected={tempDate}
                onSelect={setTempDate}
                disabled={{ before: new Date() }}
                styles={{
                  caption: { color: '#fff' },
                  head_cell: { color: '#94a3b8' },
                  day: { color: '#e2e8f0' },
                }}
                modifiersStyles={{
                  selected: { backgroundColor: '#f97316', color: '#000' },
                }}
              />
            </div>
            <div className="mt-2 w-full">
              <TimePickerDropdown
                value={tempTime}
                onChange={setTempTime}
                disabled={!tempDate}
                minTime="08:00"
                maxTime="18:00"
                interval={30}
                labelClassName="text-white"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 p-3 border-t border-theme-orange/20">
            <button
              type="button"
              className="px-3 py-1.5 rounded text-sm text-gray-300 hover:text-white"
              onClick={close}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-3 py-1.5 rounded text-sm bg-theme-orange text-black hover:bg-orange-500 disabled:opacity-50"
              onClick={commit}
              disabled={!tempDate || !tempTime}
            >
              Done
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        .rdp-day:hover,
        .rdp-day:focus {
          color: #000 !important;
          background-color: #f97316 !important;
        }
      `}</style>
    </div>
  );
}
