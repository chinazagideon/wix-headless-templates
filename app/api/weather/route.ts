import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
        
        if (!apiKey) {
            return NextResponse.json(
                { error: 'OpenWeather API key not configured' },
                { status: 500 }
            )
        }

        // The ID for Winnipeg is 6183235. Using ID is more reliable than city name.
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?id=6183235&appid=${apiKey}&units=metric&lang=fr`
        )

        if (!res.ok) {
            throw new Error(`Weather API responded with status: ${res.status}`)
        }

        const weatherData = await res.json()
        
        return NextResponse.json(weatherData)
    } catch (error) {
        console.error('Weather API error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch weather data' },
            { status: 500 }
        )
    }
} 