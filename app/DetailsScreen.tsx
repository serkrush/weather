import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const DetailsScreen = ({ route }: any) => {
  const { loading,  data, error } = useSelector((state: RootState) => state.weather);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather Details</Text>
      <Text style={styles.details}>
        Humidity: {data.main.humidity}% 
      </Text>
      <Text style={styles.details}>
        Wind Speed: {data.wind.speed} m/s
      </Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  details: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default DetailsScreen;