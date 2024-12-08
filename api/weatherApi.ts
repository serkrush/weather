import axios, { AxiosError } from 'axios';
import Config from '../config';

const weatherApi = axios.create({
  baseURL: Config.API_OPENWEATHERMAP_URL,
});

const apiKey = Config.OPENWEATHERMAP_API_KEY;

export const fetchWeatherCity = async (city: string) => {
  console.log('API1!!!!!!!!!!!!!!!')
  try {
    const response = await weatherApi.get(`weather?q=${city}&appid=${apiKey}`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Error fetching weather data');
    }
    throw new Error('Unknown error occurred');
  }
};

export const fetchWeatherLatLon = async (lat: number, lon: number) => {
  try {
    const response = await weatherApi.get(`weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Error fetching weather data');
    }
    throw new Error('Unknown error occurred');
  }
};