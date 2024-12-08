import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { kelvinToCelsius, kelvinToFahrenheit } from '../utils/temperature';

const DetailsScreen = () => {
  const { loading, data, error } = useSelector((state: RootState) => state.weather);
  const unit = useSelector((state: RootState) => state.settings.unit);

  const temperature = data
    ? unit === 'C'
      ? `${kelvinToCelsius(data.main.temp)}°C`
      : `${kelvinToFahrenheit(data.main.temp)}°F`
    : '';

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: Unable to fetch weather details.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.cityName}>{data.name}, {data.sys.country}</Text>
        <Text style={styles.temperature}>{temperature}</Text>
      </View>

      <Text style={styles.title}>Weather Details</Text>
      <Text style={styles.details}>Humidity: {data.main.humidity}%</Text>
      <Text style={styles.details}>Wind Speed: {data.wind.speed} m/s</Text>
      <Text style={styles.details}>
        Sunrise: {new Date(data.sys.sunrise * 1000).toLocaleTimeString()}
      </Text>
      <Text style={styles.details}>
        Sunset: {new Date(data.sys.sunset * 1000).toLocaleTimeString()}
      </Text>
      {!data.sys.sunrise && (
        <Text style={styles.details}>Sunrise time unavailable</Text>
      )}
      {!data.sys.sunset && (
        <Text style={styles.details}>Sunset time unavailable</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
  },
  cityName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  temperature: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ff5722',
    textAlign: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  details: {
    fontSize: 18,
    marginBottom: 10,
    color: '#555',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'red',
  },
});

export default DetailsScreen;
