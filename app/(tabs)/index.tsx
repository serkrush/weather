import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Link } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchWeatherByCity, fetchWeatherByLatLon } from '../../redux/slices/weatherSlice';
import { getCurrentLocationWeather } from '../../utils/geoLocation';
import { useNavigation } from '@react-navigation/native';
import { kelvinToCelsius, kelvinToFahrenheit } from '../../utils/temperature';
import { fetchCitySuggestions } from '../../api/cities';

interface CitySuggestion {
  id: string;
  name: string;
  country: string;
}

const HomeScreen = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const { loading, data, error } = useAppSelector((state) => state.weather);
  const unit = useAppSelector((state) => state.settings.unit);

  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleSearch = () => {
    if (query.trim()) {
      dispatch(fetchWeatherByCity(query.trim()));
      setSuggestions([]);
    }
  };

  const handleLocationButtonPress = async () => {
    try {
      const locationWeather = await getCurrentLocationWeather();
      if (locationWeather) {
        dispatch(fetchWeatherByLatLon({
          lat: locationWeather.coord.lat,
          lon: locationWeather.coord.lon,
        }));
      }
    } catch (error) {
      console.error('Error getting weather for current location:', error);
    }
  };

  const handleCitySuggestions = async (text: string) => {
    setQuery(text);
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const timeout = setTimeout(async () => {
      const cities = await fetchCitySuggestions(text);
      setSuggestions(cities);
    }, 1500);

    setTypingTimeout(timeout);
  };

  const handleSuggestionSelect = (city) => {
    setQuery(city);
    setSuggestions([]);
    dispatch(fetchWeatherByCity(city));
  };

  const temperature = useMemo(() => {
    if (!data) return '';
    let tempInUnit;
    if (unit === 'C') {
      tempInUnit = kelvinToCelsius(data.main.temp);
      return `${tempInUnit}°C`;
    } else if (unit === 'F') {
      tempInUnit = kelvinToFahrenheit(data.main.temp);
      return `${tempInUnit}°F`;
    }
    return `${kelvinToCelsius(data.main.temp)}°C`;
  }, [unit, data]);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter city"
        value={query}
        onChangeText={handleCitySuggestions}
        style={styles.input}
      />
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionItem}
              onPress={() => handleSuggestionSelect(item.name)}
            >
              <Text>
                {item.name}, {item.country}
              </Text>
            </TouchableOpacity>
          )}
          style={styles.suggestionsList}
        />
      )}
      <Button title="Search" onPress={handleSearch} />
      <Button
        title="Use Current Location"
        onPress={handleLocationButtonPress}
      />

      {data && (
        <Link href="/DetailsScreen">
          <View style={styles.weatherContainer}>
            <Text style={styles.cityName}>
              {data.name}, {data.sys.country}
            </Text>
            <Text style={styles.temperature}>{temperature}</Text>
            <Text style={styles.description}>
              {data.weather[0]?.description.charAt(0).toUpperCase() +
                data.weather[0]?.description.slice(1)}
            </Text>
            <Text style={styles.details}>
              Humidity: {data.main.humidity}% | Wind: {data.wind.speed} m/s
            </Text>
            {loading && <Text style={styles.loadingText}>Loading...</Text>}
          </View>
        </Link>
      )}
      {error && <Text style={styles.errorText}>Error: {error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  input: {
    padding: 10,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  suggestionsList: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    maxHeight: 150,
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    zIndex: 10,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: 'blue',
    textAlign: 'center',
  },
  errorText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    color: 'red',
  },
  weatherContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
  },
  cityName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  temperature: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 8,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
    color: '#555',
  },
  details: {
    fontSize: 14,
    textAlign: 'center',
    color: '#777',
  },
});

export default HomeScreen;