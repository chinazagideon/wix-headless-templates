import { useState, useEffect } from 'react';
import { WeatherData } from './weather.types';

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Add a timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const res = await fetch(`/api/weather`, {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        // Check if the response has an error property
        if (data.error) {
          throw new Error(data.error);
        }

        // Validate that we have the required weather data
        if (!data.main || !data.weather) {
          throw new Error('Invalid weather data received');
        }

        setWeatherData(data);
      } catch (err) {
        console.error('Weather fetch error:', err);
        if (err instanceof Error && err.name === 'AbortError') {
          setError('Request timeout - weather data unavailable');
        } else {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  return { weatherData, loading, error };
};
