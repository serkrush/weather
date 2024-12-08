import * as Location from 'expo-location';
import { fetchWeatherByCoords } from '../services/weatherService';
import { fetchWeatherByLatLon } from '../redux/slices/weatherSlice';
import { fetchWeatherLatLon } from '../api/weatherApi';
import { AppDispatch } from '../redux/store'; 

export const getCurrentLocationWeather = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission to access location was denied');
    return null;
  }

  const location = await Location.getCurrentPositionAsync({});

  return await fetchWeatherLatLon(location.coords.latitude, location.coords.longitude);
};

export const handleCurrentLocation = async (dispatch: AppDispatch) => {
  try {
    const locationWeather = await getCurrentLocationWeather();

    if (locationWeather) {
      dispatch(
        fetchWeatherByLatLon({
          lat: locationWeather.coord.lat,
          lon: locationWeather.coord.lon,
        })
      );
    }
  } catch (error) {
    console.error('Failed to fetch current location weather:', error);
  }
};