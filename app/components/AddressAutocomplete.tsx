'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  className?: string;
  fieldClassName?: string;
  labelClassName?: string;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address: {
    country?: string;
    state?: string;
    city?: string;
    postcode?: string;
  };
}

export default function AddressAutocomplete({
  value,
  onChange,
  placeholder,
  label,
  className = '',
  fieldClassName = '',
  labelClassName = '',
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeout = useRef<NodeJS.Timeout>();

  const searchAddresses = async (query: string) => {
    if (!query.trim() || query.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);

    try {
      // Use OpenStreetMap Nominatim API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
          `q=${encodeURIComponent(query)}` +
          `&countrycodes=ca` + // Restrict to Canada
          `&format=json` +
          `&addressdetails=1` +
          `&limit=10` +
          `&viewbox=-141.0,41.7,-52.6,83.3` + // Canadian bounding box
          `&bounded=1` // Only return results within the bounding box
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: NominatimResult[] = await response.json();

      // Filter for Canadian addresses and format results
      const canadianAddresses = data.filter(
        (result) =>
          result.address.country === 'Canada' ||
          result.display_name.toLowerCase().includes('canada') ||
          result.display_name.toLowerCase().includes('ontario') ||
          result.display_name.toLowerCase().includes('manitoba') ||
          result.display_name.toLowerCase().includes('saskatchewan') ||
          result.display_name.toLowerCase().includes('alberta') ||
          result.display_name.toLowerCase().includes('british columbia') ||
          result.display_name.toLowerCase().includes('quebec') ||
          result.display_name.toLowerCase().includes('nova scotia') ||
          result.display_name.toLowerCase().includes('new brunswick') ||
          result.display_name.toLowerCase().includes('newfoundland') ||
          result.display_name.toLowerCase().includes('pei') ||
          result.display_name.toLowerCase().includes('northwest territories') ||
          result.display_name.toLowerCase().includes('nunavut') ||
          result.display_name.toLowerCase().includes('yukon')
      );

      setSuggestions(canadianAddresses);
      setShowSuggestions(canadianAddresses.length > 0);
    } catch (error) {
      console.error('Address search error:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (inputValue: string) => {
    onChange(inputValue);

    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Debounce the search to avoid too many API calls
    searchTimeout.current = setTimeout(() => {
      searchAddresses(inputValue);
    }, 500); // 500ms delay
  };

  const handleSuggestionClick = (suggestion: NominatimResult) => {
    onChange(suggestion.display_name);
    setShowSuggestions(false);
    setSuggestions([]); // Clear suggestions after selection
  };

  const handleInputFocus = () => {
    // Only show suggestions if we have them and the input has content
    if (suggestions.length > 0 && value.trim().length >= 3) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  // Clear suggestions when input is cleared
  useEffect(() => {
    if (!value || value.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <label className="block">
        <span
          className={`font-medium ${labelClassName}`}
          dangerouslySetInnerHTML={{ __html: label || '' }}
        />
        <div className="relative mt-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPinIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder={placeholder}
            className={`text-gray-700 block w-full pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-theme-orange focus:border-transparent transition-all duration-200 ${fieldClassName}`}
          />
          {isLoading && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-theme-orange"></div>
            </div>
          )}
        </div>
      </label>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.place_id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
            >
              <div className="flex items-start">
                <MapPinIcon className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-gray-900 text-sm font-medium">
                    {suggestion.address.city ||
                      suggestion.address.state ||
                      'Location'}
                  </div>
                  <div className="text-gray-600 text-xs">
                    {suggestion.display_name}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No results message */}
      {!isLoading &&
        value &&
        value.length >= 3 &&
        value.length < 3 &&
        !showSuggestions &&
        suggestions.length === 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
            <div className="flex items-center text-gray-500 text-sm">
              <MapPinIcon className="h-4 w-4 mr-2" />
              <span>
                No Canadian addresses found. Please try a different search term.
              </span>
            </div>
          </div>
        )}
    </div>
  );
}
