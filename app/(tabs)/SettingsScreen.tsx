import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleUnit } from '../../redux/slices/settingsSlice';
import { RootState } from '../../redux/store';

const SettingsScreen = () => {
  const dispatch = useDispatch();
  const unit = useSelector((state: RootState) => state.settings.unit);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Temperature Unit</Text>
      <View style={styles.switchContainer}>
        <Text style={styles.unitLabel}>
          {unit === 'C' ? 'Celsius' : 'Fahrenheit'}
        </Text>
        <Switch
          value={unit === 'F'}
          onValueChange={() => dispatch(toggleUnit())}
        />
      </View>
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
    color: '#333',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  unitLabel: {
    fontSize: 18,
    color: '#555',
  },
});

export default SettingsScreen;