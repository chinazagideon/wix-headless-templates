export interface WeatherData {
    main?: {
        temp: number
        humidity: number
        feels_like: number
    }
    weather?: Array<{
        description: string
        main: string
        icon: string
    }>
    name?: string
    wind?: {
        speed: number
    }
} 