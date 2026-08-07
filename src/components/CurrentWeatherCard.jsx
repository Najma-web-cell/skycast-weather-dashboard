import { describeWeatherCode } from '../utils/weatherCodes'

export default function CurrentWeatherCard({ city, current }) {
  const { label, icon } = describeWeatherCode(current.weathercode)

  return (
    <div className="current-card glass">
      <div className="current-left">
        <p className="current-city">{city}</p>
        <p className="current-temp">{Math.round(current.temperature)}°C</p>
        <p className="current-desc">{icon} {label}</p>
      </div>
      <div className="current-right">
        <div className="current-stat">
          <span className="stat-label">Wind</span>
          <span className="stat-value">{current.windspeed} km/h</span>
        </div>
        <div className="current-stat">
          <span className="stat-label">Updated</span>
          <span className="stat-value">{new Date(current.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  )
}
