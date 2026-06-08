'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { useGoogleAutocomplete } from '@app/hooks/useGoogleAutocomplete';

export interface ResolvedPlace {
  formatted_address: string;
  place_id: string;
}

interface PlaceAutocompleteInputProps {
  value: string;
  onPlaceResolved: (place: ResolvedPlace) => void;
  onClear: () => void;
  placeholder?: string;
  label: string;
  required?: boolean;
  className?: string;
  fieldClassName?: string;
  labelClassName?: string;
}

export default function PlaceAutocompleteInput({
  value,
  onPlaceResolved,
  onClear,
  placeholder = 'City / Province',
  label,
  required = false,
  className = '',
  fieldClassName = '',
  labelClassName = '',
}: PlaceAutocompleteInputProps) {
  const [inputText, setInputText] = useState(value);
  const [isResolved, setIsResolved] = useState(Boolean(value));
  const [inlineError, setInlineError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const searchTimeout = useRef<NodeJS.Timeout>();

  // Keep inputText in sync when parent resets the value (e.g. form reset)
  useEffect(() => {
    if (!value) {
      setInputText('');
      setIsResolved(false);
    }
  }, [value]);

  const { data: suggestions, isLoading, isFetching } = useGoogleAutocomplete({
    q: searchQuery ?? '',
  });

  useEffect(() => {
    if (suggestions?.length) setShowSuggestions(true);
  }, [suggestions]);

  const handleChange = (text: string) => {
    setInputText(text);
    setIsResolved(false);
    setInlineError('');

    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!text.trim() || text.trim().length < 3) {
      setSearchQuery(null);
      setShowSuggestions(false);
      return;
    }
    searchTimeout.current = setTimeout(() => setSearchQuery(text), 300);
  };

  const handleSelect = (prediction: {
    text: { text: string };
    placeId: string;
  }) => {
    const formatted = prediction.text.text;
    setInputText(formatted);
    setIsResolved(true);
    setInlineError('');
    setShowSuggestions(false);
    setSearchQuery(null);
    onPlaceResolved({ formatted_address: formatted, place_id: prediction.placeId });
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
      if (inputText.trim() && !isResolved) {
        setInputText('');
        setInlineError('Please select an address from the suggestions');
        onClear();
      }
    }, 200);
  };

  const handleFocus = () => {
    if ((suggestions?.length ?? 0) > 0 && inputText.length >= 3) {
      setShowSuggestions(true);
    }
  };

  useEffect(() => {
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <label className="block">
        <span className={`font-medium ${labelClassName}`}>
          {label}
          {required && <span className="text-red-500 text-xs ml-1">*</span>}
        </span>
        <div className="relative mt-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPinIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={inputText}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={`text-gray-700 block w-full pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-theme-orange focus:border-transparent transition-all duration-200 ${fieldClassName}`}
          />
          {(isLoading || isFetching) && inputText.length >= 3 && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-theme-orange" />
            </div>
          )}
        </div>
      </label>

      {inlineError && (
        <p className="text-red-500 text-xs mt-1">{inlineError}</p>
      )}

      {showSuggestions && (suggestions?.length ?? 0) > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions!.map((s: any) => (
            <div
              key={s?.placePrediction?.placeId}
              onMouseDown={() => handleSelect(s.placePrediction)}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
            >
              <div className="flex items-start">
                <MapPinIcon className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-gray-900 text-sm font-medium">
                    {s?.placePrediction?.structuredFormat?.mainText?.text || 'Location'}
                  </div>
                  <div className="text-gray-600 text-xs">
                    {s?.placePrediction?.text?.text || 'Location'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
