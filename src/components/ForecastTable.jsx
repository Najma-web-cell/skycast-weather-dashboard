import { describeWeatherCode, formatDate } from '../utils/weatherCodes'

export default function ForecastTable({ daily }) {
  // daily is Open-Meteo's arrays-of-values format; we "zip" it into one row per day
  const rows = daily.time.map((date, i) => ({
    date,
    code: daily.weathercode[i],
    max: daily.temperature_2m_max[i],
    min: daily.temperature_2m_min[i],
    rain: daily.precipitation_sum[i],
    wind: daily.windspeed_10m_max[i],
  }))

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Condition</th>
            <th>Max °C</th>
            <th>Min °C</th>
            <th>Rain (mm)</th>
            <th>Wind (km/h)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const { label, icon } = describeWeatherCode(row.code)
            return (
              <tr key={row.date} style={{ animationDelay: `${i * 50}ms` }}>
                <td>{formatDate(row.date)}</td>
                <td>{icon} {label}</td>
                <td className="mono">{Math.round(row.max)}°</td>
                <td className="mono">{Math.round(row.min)}°</td>
                <td className="mono">{row.rain}</td>
                <td className="mono">{Math.round(row.wind)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
