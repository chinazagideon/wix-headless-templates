interface WeatherIconProps {
  weatherMain: string;
  size?: number;
}

export const WeatherIcon = ({ weatherMain, size = 24 }: WeatherIconProps) => {
  const icons = {
    Clear: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="5" fill="#FFD700" />
        <path
          d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
          stroke="#FFD700"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    ),
    Clouds: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M18 10a6 6 0 0 0-12 0c0 1.5.5 2.9 1.3 4"
          stroke="#87CEEB"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="8" cy="14" r="3" fill="#E6E6FA" />
        <circle cx="16" cy="14" r="3" fill="#E6E6FA" />
        <circle cx="12" cy="16" r="2" fill="#E6E6FA" />
      </svg>
    ),
    Rain: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M18 10a6 6 0 0 0-12 0c0 1.5.5 2.9 1.3 4"
          stroke="#87CEEB"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="8" cy="14" r="3" fill="#E6E6FA" />
        <circle cx="16" cy="14" r="3" fill="#E6E6FA" />
        <circle cx="12" cy="16" r="2" fill="#E6E6FA" />
        <path
          d="M8 18l1 3M12 18l1 3M16 18l1 3"
          stroke="#4682B4"
          strokeWidth="2"
        />
      </svg>
    ),
    Snow: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M18 10a6 6 0 0 0-12 0c0 1.5.5 2.9 1.3 4"
          stroke="#87CEEB"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="8" cy="14" r="3" fill="#E6E6FA" />
        <circle cx="16" cy="14" r="3" fill="#E6E6FA" />
        <circle cx="12" cy="16" r="2" fill="#E6E6FA" />
        <path
          d="M8 18l1 1M12 18l1 1M16 18l1 1"
          stroke="#FFFFFF"
          strokeWidth="2"
        />
      </svg>
    ),
    Thunderstorm: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M18 10a6 6 0 0 0-12 0c0 1.5.5 2.9 1.3 4"
          stroke="#87CEEB"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="8" cy="14" r="3" fill="#E6E6FA" />
        <circle cx="16" cy="14" r="3" fill="#E6E6FA" />
        <circle cx="12" cy="16" r="2" fill="#E6E6FA" />
        <path d="M12 18l-2 4h4l-2-4" fill="#FFD700" />
      </svg>
    ),
    Drizzle: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M18 10a6 6 0 0 0-12 0c0 1.5.5 2.9 1.3 4"
          stroke="#87CEEB"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="8" cy="14" r="3" fill="#E6E6FA" />
        <circle cx="16" cy="14" r="3" fill="#E6E6FA" />
        <circle cx="12" cy="16" r="2" fill="#E6E6FA" />
        <path
          d="M8 18l0.5 2M12 18l0.5 2M16 18l0.5 2"
          stroke="#4682B4"
          strokeWidth="1"
        />
      </svg>
    ),
    Mist: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 12h16" stroke="#C0C0C0" strokeWidth="2" />
        <path d="M4 14h16" stroke="#C0C0C0" strokeWidth="2" />
        <path d="M4 16h16" stroke="#C0C0C0" strokeWidth="2" />
      </svg>
    ),
    Smoke: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 12h16" stroke="#A9A9A9" strokeWidth="2" />
        <path d="M4 14h16" stroke="#A9A9A9" strokeWidth="2" />
        <path d="M4 16h16" stroke="#A9A9A9" strokeWidth="2" />
      </svg>
    ),
    Haze: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 12h16" stroke="#D3D3D3" strokeWidth="2" />
        <path d="M4 14h16" stroke="#D3D3D3" strokeWidth="2" />
        <path d="M4 16h16" stroke="#D3D3D3" strokeWidth="2" />
      </svg>
    ),
    Dust: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 12h16" stroke="#D2B48C" strokeWidth="2" />
        <path d="M4 14h16" stroke="#D2B48C" strokeWidth="2" />
        <path d="M4 16h16" stroke="#D2B48C" strokeWidth="2" />
      </svg>
    ),
    Fog: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 12h16" stroke="#B0C4DE" strokeWidth="2" />
        <path d="M4 14h16" stroke="#B0C4DE" strokeWidth="2" />
        <path d="M4 16h16" stroke="#B0C4DE" strokeWidth="2" />
      </svg>
    ),
    Sand: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 12h16" stroke="#F4A460" strokeWidth="2" />
        <path d="M4 14h16" stroke="#F4A460" strokeWidth="2" />
        <path d="M4 16h16" stroke="#F4A460" strokeWidth="2" />
      </svg>
    ),
    Ash: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 12h16" stroke="#696969" strokeWidth="2" />
        <path d="M4 14h16" stroke="#696969" strokeWidth="2" />
        <path d="M4 16h16" stroke="#696969" strokeWidth="2" />
      </svg>
    ),
    Squall: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 12h16" stroke="#87CEEB" strokeWidth="2" />
        <path d="M4 14h16" stroke="#87CEEB" strokeWidth="2" />
        <path d="M4 16h16" stroke="#87CEEB" strokeWidth="2" />
      </svg>
    ),
    Tornado: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 4c-2 0-4 1-4 3s2 3 4 3 4-1 4-3-2-3-4-3z" fill="#8B4513" />
        <path
          d="M12 8c-1 0-2 0.5-2 1s1 1 2 1 2-0.5 2-1-1-1-2-1z"
          fill="#8B4513"
        />
        <path
          d="M12 10c-0.5 0-1 0.25-1 0.5s0.5 0.5 1 0.5 1-0.25 1-0.5-0.5-0.5-1-0.5z"
          fill="#8B4513"
        />
      </svg>
    ),
  };

  return icons[weatherMain as keyof typeof icons] || icons.Clouds;
};
