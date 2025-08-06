export async function getServerSideProps() {
    // The ID for Winnipeg is 6183235. Using ID is more reliable than city name.
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?id=6183235&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric&lang=fr`);
    const weatherData = await res.json();
  
    // This passes the weatherData to your page component as props
    return { props: { weatherData } };
  }
  