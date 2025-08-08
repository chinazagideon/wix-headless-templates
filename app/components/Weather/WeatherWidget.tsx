import { WeatherData } from './weather.types';
import { WeatherIcon } from './WeatherIcon';

interface WeatherWidgetProps {
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
}

export const WeatherWidget = ({
  weatherData,
  loading,
  error,
}: WeatherWidgetProps) => {
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 shadow-lg border border-orange-200">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-orange"></div>
          <span className="ml-3 text-theme-orange font-medium font-outfit">
            Loading weather...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 shadow-lg border border-orange-200">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl mb-2">🌤️</div>
            <h3 className="text-lg font-semibold text-gray-900 font-outfit mb-1">
              Winnipeg
            </h3>
            <p className="text-sm text-gray-600 font-outfit">
              Weather widget temporarily unavailable
            </p>
            <p className="text-xs text-gray-500 font-outfit mt-2">
              Please check back later
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!weatherData) return null;

  const weatherMain = weatherData.weather?.[0]?.main || 'Clouds';
  const temperature = weatherData.main?.temp;
  const feelsLike = weatherData.main?.feels_like;
  const humidity = weatherData.main?.humidity;
  const windSpeed = weatherData.wind?.speed;
  const description = weatherData.weather?.[0]?.description;
  const location = weatherData.name;

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 shadow-lg border border-orange-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 font-outfit">
            {location}
          </h3>
          <p className="text-sm text-gray-600 capitalize font-outfit">
            {description}
          </p>
        </div>
        <div className="text-theme-orange">
          <WeatherIcon weatherMain={weatherMain} size={48} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 font-outfit">
            {temperature ? Math.round(temperature) : '--'}°C
          </div>
          <div className="text-sm text-gray-600 font-outfit">
            Feels like {feelsLike ? Math.round(feelsLike) : '--'}°C
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 font-outfit">Humidity</span>
            <span className="font-medium text-gray-900 font-outfit">
              {humidity || '--'}%
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 font-outfit">Wind</span>
            <span className="font-medium text-gray-900 font-outfit">
              {windSpeed ? `${Math.round(windSpeed)} m/s` : '--'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-orange-200">
        <div className="flex items-center justify-center">
          {temperature && temperature > 15 ? (
            <div className="flex items-center text-theme-orange">
              <svg
                className="w-5 h-5 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium font-outfit">
                Warm weather
              </span>
            </div>
          ) : temperature && temperature > 5 ? (
            <div className="flex items-center text-theme-orange">
              <svg
                className="w-5 h-5 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium font-outfit">
                Mild weather
              </span>
            </div>
          ) : (
            <div className="flex items-center text-theme-orange">
              <svg
                className="w-5 h-5 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium font-outfit">
                Cold weather
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
