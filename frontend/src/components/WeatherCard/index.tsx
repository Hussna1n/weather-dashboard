import { Wind, Droplets, Eye, Gauge, Sunrise, Sunset, Thermometer } from 'lucide-react';
import { format } from 'date-fns';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

interface CurrentWeather {
  city: string; country: string;
  temp: number; feelsLike: number; tempMin: number; tempMax: number;
  humidity: number; windSpeed: number;
  description: string; icon: string;
  sunrise: number; sunset: number;
  visibility: number; pressure: number;
}

interface ForecastItem { dt: number; temp: number; description: string; icon: string; precipitation: number; }

function getGradient(icon: string) {
  if (icon.includes('01')) return 'from-sky-400 to-blue-600';
  if (icon.includes('02') || icon.includes('03') || icon.includes('04')) return 'from-slate-400 to-slate-600';
  if (icon.includes('09') || icon.includes('10')) return 'from-indigo-500 to-blue-700';
  if (icon.includes('11')) return 'from-gray-600 to-gray-800';
  if (icon.includes('13')) return 'from-blue-200 to-blue-400';
  return 'from-orange-400 to-yellow-500';
}

export default function WeatherCard({
  current, forecast
}: { current: CurrentWeather; forecast: ForecastItem[] }) {
  const hourly = forecast.slice(0, 8);
  const daily = forecast.filter((_, i) => i % 8 === 0).slice(0, 5);

  return (
    <div className={`bg-gradient-to-br ${getGradient(current.icon)} rounded-3xl p-6 text-white shadow-2xl max-w-md w-full`}>
      {/* Location & Icon */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold">{current.city}</h2>
          <p className="text-white/70 text-sm">{current.country}</p>
          <p className="text-white/80 text-sm mt-1 capitalize">{current.description}</p>
        </div>
        <img src={`https://openweathermap.org/img/wn/${current.icon}@2x.png`}
          alt={current.description} className="w-20 h-20" />
      </div>

      {/* Main Temp */}
      <div className="mb-6">
        <span className="text-7xl font-extralight">{Math.round(current.temp)}°</span>
        <span className="text-2xl">C</span>
        <p className="text-white/70 text-sm mt-1">
          Feels like {Math.round(current.feelsLike)}° · H:{Math.round(current.tempMax)}° L:{Math.round(current.tempMin)}°
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { icon: Droplets, label: 'Humidity', value: `${current.humidity}%` },
          { icon: Wind, label: 'Wind', value: `${current.windSpeed} m/s` },
          { icon: Eye, label: 'Visibility', value: `${(current.visibility / 1000).toFixed(1)} km` },
          { icon: Gauge, label: 'Pressure', value: `${current.pressure} hPa` },
          { icon: Sunrise, label: 'Sunrise', value: format(current.sunrise * 1000, 'HH:mm') },
          { icon: Sunset, label: 'Sunset', value: format(current.sunset * 1000, 'HH:mm') },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-white/20 rounded-2xl p-3 backdrop-blur">
            <Icon size={16} className="opacity-70 mb-1" />
            <p className="text-xs opacity-70">{label}</p>
            <p className="text-sm font-semibold">{value}</p>
          </div>
        ))}
      </div>

      {/* Hourly Chart */}
      <div className="bg-white/15 rounded-2xl p-4 mb-4 backdrop-blur">
        <p className="text-xs font-medium opacity-70 mb-3">HOURLY FORECAST</p>
        <ResponsiveContainer width="100%" height={80}>
          <AreaChart data={hourly.map(h => ({ time: format(h.dt * 1000, 'HH:mm'), temp: Math.round(h.temp) }))}>
            <defs>
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fff" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#fff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.7)' }} />
            <YAxis hide />
            <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12 }} />
            <Area type="monotone" dataKey="temp" stroke="#fff" strokeWidth={2} fill="url(#tempGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 5-Day Forecast */}
      <div className="bg-white/15 rounded-2xl p-4 backdrop-blur">
        <p className="text-xs font-medium opacity-70 mb-3">5-DAY FORECAST</p>
        <div className="space-y-2">
          {daily.map(d => (
            <div key={d.dt} className="flex items-center justify-between">
              <span className="text-sm w-12 opacity-80">{format(d.dt * 1000, 'EEE')}</span>
              <img src={`https://openweathermap.org/img/wn/${d.icon}.png`} className="w-8 h-8" alt={d.description} />
              <div className="flex items-center gap-1 text-xs opacity-70">
                <Droplets size={10} />
                {Math.round(d.precipitation * 100)}%
              </div>
              <span className="text-sm font-semibold">{Math.round(d.temp)}°C</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
