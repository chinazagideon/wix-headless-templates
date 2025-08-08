// Weather API Configuration
export const weatherConfig = {
  // OpenWeather API Key - Replace with your actual key for production
  apiKey:
    process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY ||
    '22dc670fcad7cbde5c54d017f01e0760',

  // Winnipeg City ID
  cityId: '6183235',

  // API Base URL
  baseUrl: 'https://api.openweathermap.org/data/2.5/weather',

  // Units (metric for Celsius)
  units: 'metric',

  // Language
  language: 'en',

  // Mock data for fallback
  mockData: {
    name: 'Winnipeg',
    main: {
      temp: 18,
      feels_like: 16,
      humidity: 70,
    },
    weather: [
      {
        main: 'Clear',
        description: 'clear sky',
        icon: '01d',
      },
    ],
    wind: {
      speed: 8,
    },
  },
};

// Helper function to build API URL
export const buildWeatherApiUrl = () => {
  const { apiKey, cityId, baseUrl, units, language } = weatherConfig;
  return `${baseUrl}?id=${cityId}&appid=${apiKey}&units=${units}&lang=${language}`;
};
