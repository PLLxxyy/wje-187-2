import { useState, useEffect } from 'react';

export function WeatherPanel() {
  const [weather, setWeather] = useState({
    temperature: -8,
    windSpeed: 12,
    snowfall: 3.5,
    visibility: '良好',
    humidity: 78,
  });

  // Simulate slight weather changes
  useEffect(() => {
    const interval = setInterval(() => {
      setWeather(prev => ({
        ...prev,
        temperature: prev.temperature + (Math.random() - 0.5) * 0.5,
        windSpeed: Math.max(0, prev.windSpeed + (Math.random() - 0.5) * 2),
        snowfall: Math.max(0, prev.snowfall + (Math.random() - 0.5) * 0.3),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="weather-panel">
      <h3>实时天气</h3>
      <div className="weather-item">
        <span className="label">温度</span>
        <span className="value">{weather.temperature.toFixed(1)}°C</span>
      </div>
      <div className="weather-item">
        <span className="label">风速</span>
        <span className="value">{weather.windSpeed.toFixed(1)} km/h</span>
      </div>
      <div className="weather-item">
        <span className="label">降雪量</span>
        <span className="value">{weather.snowfall.toFixed(1)} mm/h</span>
      </div>
      <div className="weather-item">
        <span className="label">能见度</span>
        <span className="value">{weather.visibility}</span>
      </div>
      <div className="weather-item">
        <span className="label">湿度</span>
        <span className="value">{weather.humidity}%</span>
      </div>
    </div>
  );
}
