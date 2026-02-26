import axios from 'axios';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600 }); // 10 min TTL
const OW_BASE = 'https://api.openweathermap.org/data/2.5';
const APIKEY = process.env.OPENWEATHER_API_KEY!;

export interface CurrentWeather {
  city: string; country: string;
  temp: number; feelsLike: number; tempMin: number; tempMax: number;
  humidity: number; windSpeed: number; windDeg: number;
  description: string; icon: string;
  sunrise: number; sunset: number;
  visibility: number; pressure: number;
}

export interface ForecastItem {
  dt: number; temp: number; feelsLike: number;
  description: string; icon: string; precipitation: number;
}

export const getCurrentWeather = async (city: string): Promise<CurrentWeather> => {
  const key = `current:${city.toLowerCase()}`;
  const cached = cache.get<CurrentWeather>(key);
  if (cached) return cached;

  const { data } = await axios.get(`${OW_BASE}/weather`, {
    params: { q: city, appid: APIKEY, units: 'metric' }
  });

  const result: CurrentWeather = {
    city: data.name, country: data.sys.country,
    temp: data.main.temp, feelsLike: data.main.feels_like,
    tempMin: data.main.temp_min, tempMax: data.main.temp_max,
    humidity: data.main.humidity, windSpeed: data.wind.speed, windDeg: data.wind.deg,
    description: data.weather[0].description, icon: data.weather[0].icon,
    sunrise: data.sys.sunrise, sunset: data.sys.sunset,
    visibility: data.visibility, pressure: data.main.pressure
  };
  cache.set(key, result);
  return result;
};

export const getForecast = async (city: string): Promise<ForecastItem[]> => {
  const key = `forecast:${city.toLowerCase()}`;
  const cached = cache.get<ForecastItem[]>(key);
  if (cached) return cached;

  const { data } = await axios.get(`${OW_BASE}/forecast`, {
    params: { q: city, appid: APIKEY, units: 'metric', cnt: 40 }
  });

  const result: ForecastItem[] = data.list.map((item: any) => ({
    dt: item.dt, temp: item.main.temp, feelsLike: item.main.feels_like,
    description: item.weather[0].description, icon: item.weather[0].icon,
    precipitation: item.pop || 0
  }));
  cache.set(key, result);
  return result;
};

export const getWeatherByCoords = async (lat: number, lon: number): Promise<CurrentWeather> => {
  const key = `coords:${lat.toFixed(2)},${lon.toFixed(2)}`;
  const cached = cache.get<CurrentWeather>(key);
  if (cached) return cached;

  const { data } = await axios.get(`${OW_BASE}/weather`, {
    params: { lat, lon, appid: APIKEY, units: 'metric' }
  });

  const result: CurrentWeather = {
    city: data.name, country: data.sys.country,
    temp: data.main.temp, feelsLike: data.main.feels_like,
    tempMin: data.main.temp_min, tempMax: data.main.temp_max,
    humidity: data.main.humidity, windSpeed: data.wind.speed, windDeg: data.wind.deg,
    description: data.weather[0].description, icon: data.weather[0].icon,
    sunrise: data.sys.sunrise, sunset: data.sys.sunset,
    visibility: data.visibility, pressure: data.main.pressure
  };
  cache.set(key, result);
  return result;
};
