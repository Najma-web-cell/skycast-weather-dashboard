import React, { useState } from 'react';
import { useFetch } from './hooks/useFetch';
import { 
  Sun, Cloud, CloudRain, CloudLightning, Snowflake, CloudDrizzle, 
  Search, RefreshCw, AlertTriangle, Wind, Droplets, Calendar, Clock, Eye, X, Moon
} from 'lucide-react';

// Weather Condition Mapping Function
const getWeatherMeta = (code, isDay = 1) => {
  if (code === 0) {
    return isDay 
      ? { label: 'Clear Sky', icon: Sun, color: '#fbbf24', theme: 'bg-theme-sunny', isRainy: false }
      : { label: 'Clear Night', icon: Moon, color: '#e0f2fe', theme: 'bg-theme-night', isRainy: false };
  }
  if ([1, 2, 3].includes(code)) return { label: 'Partly Cloudy', icon: Cloud, color: '#cbd5e1', theme: 'bg-theme-cloudy', isRainy: false };
  if ([45, 48].includes(code)) return { label: 'Foggy', icon: Cloud, color: '#94a3b8', theme: 'bg-theme-cloudy', isRainy: false };
  if ([51, 53, 55, 56, 57].includes(code)) return { label: 'Light Drizzle', icon: CloudDrizzle, color: '#2dd4bf', theme: 'bg-theme-rainy', isRainy: true };
  if ([61, 63, 65, 80, 81, 82].includes(code)) return { label: 'Rainy', icon: CloudRain, color: '#38bdf8', theme: 'bg-theme-rainy', isRainy: true };
  if ([71, 73, 75, 85, 86].includes(code)) return { label: 'Snowfall', icon: Snowflake, color: '#bae6fd', theme: 'bg-theme-cloudy', isRainy: false };
  if ([95, 96, 99].includes(code)) return { label: 'Thunderstorm', icon: CloudLightning, color: '#c084fc', theme: 'bg-theme-rainy', isRainy: true };
  return { label: 'Overcast', icon: Cloud, color: '#7dd3fc', theme: 'bg-theme-cloudy', isRainy: false };
};

export default function App() {
  const [inputCity, setInputCity] = useState('Taxila');
  const [activeCity, setActiveCity] = useState('Taxila');
  const [unit, setUnit] = useState('C'); // 'C' for Celsius, 'F' for Fahrenheit
  const [selectedDayIdx, setSelectedDayIdx] = useState(null);

  const { data, loading, error, refetch } = useFetch(activeCity);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputCity.trim()) {
      setActiveCity(inputCity.trim());
      setSelectedDayIdx(null);
    }
  };

  // Convert Temperature based on Unit State
  const formatTemp = (tempC) => {
    if (tempC === undefined || tempC === null) return '--';
    if (unit === 'F') {
      return `${Math.round((tempC * 9) / 5 + 32)}°F`;
    }
    return `${Math.round(tempC)}°C`;
  };

  const currentMeta = data?.current ? getWeatherMeta(data.current.weather_code, data.current.is_day) : null;
  const CurrentIcon = currentMeta?.icon || Sun;

  // Extract 24-hour timeline for selected day
  const getHourlyForSelectedDay = () => {
    if (selectedDayIdx === null || !data?.hourly) return [];
    const start = selectedDayIdx * 24;
    return data.hourly.time.slice(start, start + 24).map((t, i) => ({
      time: new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temp: data.hourly.temperature_2m[start + i],
      code: data.hourly.weather_code[start + i],
      humidity: data.hourly.relative_humidity_2m[start + i],
      wind: data.hourly.wind_speed_10m[start + i],
      isDay: data.hourly.is_day[start + i]
    }));
  };

  return (
    <div className={currentMeta ? currentMeta.theme : 'bg-theme-sunny'} style={{ minHeight: '100vh', width: '100%', padding: '24px 16px', transition: 'background 0.5s ease' }}>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* HEADER BAR */}
        <header className="glass-panel" style={{ padding: '16px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)', padding: '10px', borderRadius: '16px' }}>
              <CloudLightning style={{ width: '24px', height: '24px', color: '#fff' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: '800' }}>AetherWeather HD</h1>
              <p style={{ fontSize: '11px', color: '#7dd3fc' }}>Real-Time Mobile Meteorological Engine</p>
            </div>
          </div>

          {/* SEARCH & UNIT TOGGLE */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: '20px', padding: '4px', border: '1px solid rgba(255,255,255,0.2)' }}>
              <button 
                onClick={() => setUnit('C')} 
                style={{ background: unit === 'C' ? '#0284c7' : 'transparent', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '16px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}>
                °C
              </button>
              <button 
                onClick={() => setUnit('F')} 
                style={{ background: unit === 'F' ? '#0284c7' : 'transparent', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '16px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}>
                °F
              </button>
            </div>

            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.25)', padding: '4px 6px 4px 14px', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.2)', width: '280px' }}>
              <Search style={{ width: '18px', height: '18px', color: '#38bdf8', marginTop: '8px' }} />
              <input 
                type="text"
                placeholder="Search city..."
                value={inputCity}
                onChange={(e) => setInputCity(e.target.value)}
                style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', width: '100%', fontSize: '13px' }}
              />
              <button type="submit" style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '30px', fontWeight: '700', cursor: 'pointer', fontSize: '12px' }}>
                Search
              </button>
            </form>
          </div>
        </header>

        {/* LOADING STATE */}
        {loading && (
          <div className="glass-panel" style={{ padding: '80px', textAlign: 'center', minHeight: '350px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <RefreshCw style={{ width: '48px', height: '48px', color: '#38bdf8', marginBottom: '16px' }} className="sun-glow" />
            <p style={{ fontSize: '18px', color: '#e0f2fe' }}>Connecting to Atmospheric Data Stream...</p>
          </div>
        )}

        {/* ERROR STATE */}
        {error && !loading && (
          <div className="glass-panel" style={{ padding: '50px', textAlign: 'center', background: 'rgba(127, 29, 29, 0.4)', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
            <AlertTriangle style={{ width: '56px', height: '56px', color: '#f87171', marginBottom: '12px' }} />
            <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>Location Query Error</h2>
            <p style={{ color: '#fca5a5', marginBottom: '20px', fontSize: '14px' }}>{error}</p>
            <button onClick={refetch} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' }}>
              Retry Request
            </button>
          </div>
        )}

        {/* DASHBOARD MAIN CONTENT */}
        {data && !loading && !error && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* HERO SECTION */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              
              {/* MAIN CURRENT WEATHER CARD WITH LIVE ANIMATED RAIN DROPS */}
              <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h2 style={{ fontSize: '32px', fontWeight: '800' }}>{data.cityName}</h2>
                    <p style={{ fontSize: '12px', color: '#7dd3fc', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                      <Clock style={{ width: '14px', height: '14px' }} /> Real-time Sync Active
                    </p>
                  </div>
                  <span style={{ background: 'rgba(56, 189, 248, 0.2)', padding: '6px 14px', borderRadius: '30px', fontSize: '12px', fontWeight: '700', color: '#7dd3fc', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                    {currentMeta.label}
                  </span>
                </div>

                {/* ANIMATED ICON + LIVE FALLING RAIN PARTICLES */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', margin: '24px 0', position: 'relative' }}>
                  <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <CurrentIcon style={{ width: '84px', height: '84px', color: currentMeta.color }} className={data.current.weather_code === 0 && data.current.is_day ? "sun-glow" : ""} />
                    
                    {/* Dynamic Rain Drop Animation */}
                    {currentMeta.isRainy && (
                      <div className="rain-container" style={{ width: '80px' }}>
                        <div className="rain-drop" style={{ left: '15%', animationDelay: '0s' }}></div>
                        <div className="rain-drop" style={{ left: '40%', animationDelay: '0.3s' }}></div>
                        <div className="rain-drop" style={{ left: '70%', animationDelay: '0.1s' }}></div>
                        <div className="rain-drop" style={{ left: '85%', animationDelay: '0.5s' }}></div>
                      </div>
                    )}
                  </div>

                  <div>
                    <div style={{ fontSize: '60px', fontWeight: '900', lineHeight: '1' }}>
                      {formatTemp(data.current.temperature_2m)}
                    </div>
                    <p style={{ fontSize: '14px', color: '#cbd5e1', marginTop: '6px' }}>
                      Feels like <strong style={{ color: '#fff' }}>{formatTemp(data.current.apparent_temperature)}</strong>
                    </p>
                  </div>
                </div>

                {/* BOTTOM METRICS */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Wind style={{ color: '#38bdf8', width: '18px' }} />
                    <div>
                      <p style={{ fontSize: '10px', color: '#94a3b8' }}>Wind Speed</p>
                      <p style={{ fontSize: '12px', fontWeight: '700' }}>{data.current.wind_speed_10m} km/h</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Droplets style={{ color: '#60a5fa', width: '18px' }} />
                    <div>
                      <p style={{ fontSize: '10px', color: '#94a3b8' }}>Humidity</p>
                      <p style={{ fontSize: '12px', fontWeight: '700' }}>{data.current.relative_humidity_2m}%</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CloudRain style={{ color: '#a7f3d0', width: '18px' }} />
                    <div>
                      <p style={{ fontSize: '10px', color: '#94a3b8' }}>Precipitation</p>
                      <p style={{ fontSize: '12px', fontWeight: '700' }}>{data.current.precipitation} mm</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* MOBILE APP STYLE GRAPHICAL DAY CARDS */}
              <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar style={{ color: '#38bdf8', width: '20px' }} /> Visual Temp Bar Trends
                  </h3>
                  <p style={{ fontSize: '12px', color: '#cbd5e1' }}>
                    Min/Max graphical temperature indicators (Mobile App Feature)
                  </p>
                </div>

                {/* Dynamic Visual Temperature Bars Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', margin: '20px 0', textAlign: 'center' }}>
                  {data.daily.time.map((dateStr, idx) => {
                    const maxT = data.daily.temperature_2m_max[idx];
                    const minT = data.daily.temperature_2m_min[idx];
                    const barHeightPct = Math.min(100, Math.max(20, ((maxT - minT + 5) / 25) * 100));

                    return (
                      <div key={dateStr} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '10px', color: '#fbbf24', fontWeight: '700' }}>{Math.round(maxT)}°</span>
                        <div className="temp-bar-container">
                          <div className="temp-bar-fill" style={{ height: `${barHeightPct}%` }}></div>
                        </div>
                        <span style={{ fontSize: '10px', color: '#38bdf8', fontWeight: '700' }}>{Math.round(minT)}°</span>
                        <span style={{ fontSize: '9px', color: '#94a3b8' }}>{new Date(dateStr).toLocaleDateString(undefined, { weekday: 'narrow' })}</span>
                      </div>
                    );
                  })}
                </div>

                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '14px', textAlign: 'center' }}>
                  <p style={{ fontSize: '11px', color: '#7dd3fc' }}>Selected Day Inspector</p>
                  <p style={{ fontSize: '14px', fontWeight: '800', marginTop: '2px' }}>
                    {selectedDayIdx !== null ? data.daily.time[selectedDayIdx] : 'Click any table row below'}
                  </p>
                </div>
              </div>

            </div>

            {/* 7-DAY FORECAST DATA TABLE */}
            <div className="glass-panel" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700' }}>7-Day Weather Forecast Table</h3>
                  <p style={{ fontSize: '11px', color: '#7dd3fc' }}>Click a row to trigger full 24-hour day & night breakdown</p>
                </div>
                <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '20px' }}>
                  Click row for 24h Details
                </span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: 'rgba(0,0,0,0.3)', color: '#7dd3fc', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '1px' }}>
                      <th style={{ padding: '14px 20px' }}>Date</th>
                      <th style={{ padding: '14px 20px' }}>Condition</th>
                      <th style={{ padding: '14px 20px', textAlign: 'center' }}>Max Temp</th>
                      <th style={{ padding: '14px 20px', textAlign: 'center' }}>Min Temp</th>
                      <th style={{ padding: '14px 20px', textAlign: 'center' }}>Rain Fall</th>
                      <th style={{ padding: '14px 20px', textAlign: 'center' }}>Max Wind</th>
                      <th style={{ padding: '14px 20px', textAlign: 'center' }}>Inspect</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.daily.time.map((dateStr, idx) => {
                      const meta = getWeatherMeta(data.daily.weather_code[idx]);
                      const Icon = meta.icon;
                      const isSelected = selectedDayIdx === idx;

                      return (
                        <tr 
                          key={dateStr}
                          onClick={() => setSelectedDayIdx(idx)}
                          className="glass-panel-interactive"
                          style={{ 
                            borderBottom: '1px solid rgba(255,255,255,0.08)', 
                            cursor: 'pointer',
                            background: isSelected ? 'rgba(56, 189, 248, 0.25)' : 'transparent' 
                          }}
                        >
                          <td style={{ padding: '14px 20px', fontWeight: '600' }}>
                            {new Date(dateStr).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                          </td>
                          <td style={{ padding: '14px 20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Icon style={{ width: '18px', height: '18px', color: meta.color }} />
                              <span>{meta.label}</span>
                            </div>
                          </td>
                          <td style={{ padding: '14px 20px', textAlign: 'center', color: '#fbbf24', fontWeight: '700' }}>
                            {formatTemp(data.daily.temperature_2m_max[idx])}
                          </td>
                          <td style={{ padding: '14px 20px', textAlign: 'center', color: '#38bdf8', fontWeight: '700' }}>
                            {formatTemp(data.daily.temperature_2m_min[idx])}
                          </td>
                          <td style={{ padding: '14px 20px', textAlign: 'center', color: '#93c5fd' }}>
                            {data.daily.precipitation_sum[idx]} mm
                          </td>
                          <td style={{ padding: '14px 20px', textAlign: 'center', color: '#cbd5e1' }}>
                            {data.daily.wind_speed_10m_max[idx]} km/h
                          </td>
                          <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                            <button style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}>
                              <Eye style={{ width: '14px', height: '14px' }} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 24-HOUR HOURLY SLIDE-IN STRIP */}
            {selectedDayIdx !== null && (
              <div className="glass-panel" style={{ padding: '24px', border: '1px solid rgba(56, 189, 248, 0.5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h4 style={{ fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock style={{ color: '#38bdf8' }} /> 24-Hour Day & Night Detailed Breakdown: {data.daily.time[selectedDayIdx]}
                    </h4>
                    <p style={{ fontSize: '11px', color: '#94a3b8' }}>Hourly condition, temperatures, and relative humidity</p>
                  </div>
                  <button onClick={() => setSelectedDayIdx(null)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer' }}>
                    <X style={{ width: '18px', height: '18px', margin: '0 auto' }} />
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '12px' }}>
                  {getHourlyForSelectedDay().map((item, hIdx) => {
                    const hMeta = getWeatherMeta(item.code, item.isDay);
                    const HIcon = hMeta.icon;
                    return (
                      <div key={hIdx} style={{ flexShrink: 0, width: '95px', padding: '12px 8px', borderRadius: '16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                        <p style={{ fontSize: '10px', color: '#94a3b8' }}>{item.time}</p>
                        <HIcon style={{ width: '24px', height: '24px', color: hMeta.color, margin: '8px auto' }} />
                        <p style={{ fontSize: '15px', fontWeight: '800' }}>{formatTemp(item.temp)}</p>
                        <p style={{ fontSize: '10px', color: '#7dd3fc', marginTop: '4px' }}>💧 {item.humidity}%</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}