import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useFetch = (cityName) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeatherData = useCallback(async () => {
    if (!cityName) return;
    setLoading(true);
    setError(null);

    try {
      // 1. Geocoding API Search
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
      const geoRes = await axios.get(geoUrl);

      if (!geoRes.data.results || geoRes.data.results.length === 0) {
        throw new Error('City not found. Please verify spelling and try again.');
      }

      const { latitude, longitude, name, country } = geoRes.data.results[0];

      // 2. Open-Meteo Weather API Call
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&timezone=auto`;
      
      const weatherRes = await axios.get(weatherUrl);

      setData({
        cityName: `${name}, ${country}`,
        current: weatherRes.data.current,
        daily: weatherRes.data.daily,
        hourly: weatherRes.data.hourly
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch weather data.');
    } finally {
      setLoading(false);
    }
  }, [cityName]);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  return { data, loading, error, refetch: fetchWeatherData };
};