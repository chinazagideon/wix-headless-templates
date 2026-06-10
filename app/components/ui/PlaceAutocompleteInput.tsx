'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';
import {
  useGooglePlaces,
  type PlacePrediction,
  type ResolvedPlace,
} from '@app/hooks/useGooglePlaces';
import { cn } from '@app/utils';

export type { ResolvedPlace };

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
  const { isReady, getPredictions, resolvePlace } = useGooglePlaces();

  const [inputText, setInputText] = useState(value);
  const [isResolved, setIsResolved] = useState(Boolean(value));
  const [inlineError, setInlineError] = useState('');
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Sync when parent resets value
  useEffect(() => {
    if (!value) {
      setInputText('');
      setIsResolved(false);
      setPredictions([]);
    }
  }, [value]);

  const fetchPredictions = useCallback(
    async (text: string) => {
      if (text.trim().length < 3) {
        setPredictions([]);
        setShowSuggestions(false);
        return;
      }
      setIsLoading(true);
      try {
        const results = await getPredictions(text);
        setPredictions(results);
        setShowSuggestions(results.length > 0);
      } finally {
        setIsLoading(false);
      }
    },
    [getPredictions]
  );

  const handleChange = (text: string) => {
    setInputText(text);
    setIsResolved(false);
    setInlineError('');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPredictions(text), 300);
  };

  const handleSelect = async (prediction: PlacePrediction) => {
    // Mark resolved immediately so blur does not clear the field
    // while the async details call is in-flight
    setInputText(prediction.fullText);
    setIsResolved(true);
    setShowSuggestions(false);
    setPredictions([]);
    setIsLoading(true);
    try {
      const resolved = await resolvePlace(prediction.placeId);
      setInlineError('');
      onPlaceResolved(resolved);
    } catch {
      setInlineError('Could not resolve address. Please try again.');
      setIsResolved(false);
      setInputText('');
    } finally {
      setIsLoading(false);
    }
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
    if (predictions.length > 0 && inputText.length >= 3) {
      setShowSuggestions(true);
    }
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
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
            placeholder={isReady ? placeholder : 'Loading…'}
            disabled={!isReady}
            className={cn(
              `text-gray-700 block w-full pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-theme-orange focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`,
              fieldClassName
            )}
          />
          {isLoading && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-theme-orange" />
            </div>
          )}
        </div>
      </label>

      {inlineError && (
        <p className="text-red-500 text-xs mt-1">{inlineError}</p>
      )}

      {showSuggestions && predictions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {predictions.map((p) => (
            <div
              key={p.placeId}
              onMouseDown={() => handleSelect(p)}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
            >
              <div className="flex items-start">
                <MapPinIcon className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-gray-900 text-sm font-medium">
                    {p.mainText}
                  </div>
                  <div className="text-gray-500 text-xs">{p.secondaryText}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
