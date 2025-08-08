import { NextResponse } from 'next/server';
import { weatherConfig, buildWeatherApiUrl } from '../../config/weather';

export async function GET() {
  try {
    const isProduction = process.env.NODE_ENV === 'production';

    // In production without env var, return mock data
    if (isProduction && !process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY) {
      console.log(
        'Production environment without API key, returning mock data'
      );
      return NextResponse.json(weatherConfig.mockData);
    }

    // Try to fetch real weather data
    const res = await fetch(buildWeatherApiUrl());

    if (!res.ok) {
      throw new Error(`Weather API responded with status: ${res.status}`);
    }

    const weatherData = await res.json();

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('Weather API error:', error);

    // Return mock data on error
    return NextResponse.json(weatherConfig.mockData);
  }
}
