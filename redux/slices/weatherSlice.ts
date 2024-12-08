import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWeatherCity, fetchWeatherLatLon } from '../../api/weatherApi';

interface WeatherData {
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  sys: {
    country: string;
  };
  name: string;
  weather: Array<{
    description: string;
  }>;
}

interface WeatherState {
  loading: boolean;
  data: WeatherData | null;
  error: string | null;
}

const initialState: WeatherState = {
  loading: false,
  data: null,
  error: null,
};

export const fetchWeatherByCity = createAsyncThunk<WeatherData, string>(
  'weather/fetchWeatherByCity',
  async (city: string) => {
    const data = await fetchWeatherCity(city);
    return data;
  }
);

export const fetchWeatherByLatLon = createAsyncThunk<WeatherData, { lat: number; lon: number }>(
  'weather/fetchWeatherByLatLon',
  async ({ lat, lon }) => {
    const data = await fetchWeatherLatLon(lat, lon);
    return data;
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherByCity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherByCity.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchWeatherByCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      })
      .addCase(fetchWeatherByLatLon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherByLatLon.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchWeatherByLatLon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export default weatherSlice.reducer;