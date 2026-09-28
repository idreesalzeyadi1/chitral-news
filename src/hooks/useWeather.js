import { useEffect, useState } from 'react'

// Chitral, Pakistan coordinates
const LAT = 35.8515
const LON = 71.7885

// WMO weather codes -> { label, icon (FontAwesome class) }
function describeWeatherCode(code) {
  if (code === 0) return { label: 'Clear Sky', icon: 'fa-sun' }
  if ([1, 2].includes(code)) return { label: 'Partly Cloudy', icon: 'fa-cloud-sun' }
  if (code === 3) return { label: 'Overcast', icon: 'fa-cloud' }
  if ([45, 48].includes(code)) return { label: 'Foggy', icon: 'fa-smog' }
  if ([51, 53, 55, 56, 57].includes(code)) return { label: 'Drizzle', icon: 'fa-cloud-rain' }
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { label: 'Rain', icon: 'fa-cloud-showers-heavy' }
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: 'Snow', icon: 'fa-snowflake' }
  if ([95, 96, 99].includes(code)) return { label: 'Thunderstorm', icon: 'fa-bolt' }
  return { label: 'Clear', icon: 'fa-sun' }
}

function describeAqi(usAqi) {
  if (usAqi == null) return 'N/A'
  if (usAqi <= 50) return 'Good'
  if (usAqi <= 100) return 'Moderate'
  if (usAqi <= 150) return 'Unhealthy (Sensitive)'
  if (usAqi <= 200) return 'Unhealthy'
  if (usAqi <= 300) return 'Very Unhealthy'
  return 'Hazardous'
}

export function useWeather() {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('loading') // loading | ready | error

  useEffect(() => {
    let cancelled = false

    async function fetchWeather() {
      try {
        const [weatherRes, aqiRes] = await Promise.all([
          fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,weather_code&timezone=auto`,
          ),
          fetch(
            `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${LAT}&longitude=${LON}&current=us_aqi&timezone=auto`,
          ),
        ])

        const weatherJson = await weatherRes.json()
        const aqiJson = aqiRes.ok ? await aqiRes.json() : null

        if (cancelled) return

        const temp = weatherJson?.current?.temperature_2m
        const code = weatherJson?.current?.weather_code
        const usAqi = aqiJson?.current?.us_aqi

        setData({
          temp: temp != null ? Math.round(temp) : null,
          ...describeWeatherCode(code),
          aqi: usAqi != null ? Math.round(usAqi) : null,
          aqiLabel: describeAqi(usAqi),
        })
        setStatus('ready')
      } catch (err) {
        if (!cancelled) setStatus('error')
      }
    }

    fetchWeather()
    // Refresh every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  return { data, status }
}
