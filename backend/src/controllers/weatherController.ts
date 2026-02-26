import { Request, Response } from 'express';
import { getCurrentWeather, getForecast, getWeatherByCoords } from '../services/weatherService';

export const getCurrent = async (req: Request, res: Response) => {
  try {
    const { city } = req.params;
    const weather = await getCurrentWeather(city);
    res.json(weather);
  } catch (err: any) {
    if (err.response?.status === 404)
      return res.status(404).json({ message: 'City not found' });
    res.status(500).json({ message: 'Failed to fetch weather' });
  }
};

export const getForecastData = async (req: Request, res: Response) => {
  try {
    const forecast = await getForecast(req.params.city);
    res.json(forecast);
  } catch (err: any) {
    if (err.response?.status === 404)
      return res.status(404).json({ message: 'City not found' });
    res.status(500).json({ message: 'Failed to fetch forecast' });
  }
};

export const getByCoords = async (req: Request, res: Response) => {
  try {
    const { lat, lon } = req.query as { lat: string; lon: string };
    const weather = await getWeatherByCoords(+lat, +lon);
    res.json(weather);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch weather' });
  }
};

export const searchCities = async (req: Request, res: Response) => {
  const { q } = req.query;
  const response = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=5&appid=${process.env.OPENWEATHER_API_KEY}`
  );
  const data = await response.json();
  res.json(data);
};
