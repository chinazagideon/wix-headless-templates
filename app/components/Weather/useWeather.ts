import { useState, useEffect } from 'react'
import { WeatherData } from './weather.types'

export const useWeather = () => {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const res = await fetch(`/api/weather`)
                if (!res.ok) {
                    throw new Error('Failed to fetch weather data')
                }
                const data = await res.json()
                setWeatherData(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred')
            } finally {
                setLoading(false)
            }
        }

        fetchWeather()
    }, [])

    return { weatherData, loading, error }
} 