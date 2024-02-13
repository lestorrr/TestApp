import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import Slider from '@react-native-community/slider';

const UltrasonicScreen = ({ sensorData }) => {
  return (
    <View style={styles.container}>
      <View style={styles.sensorContainer}>
        <SensorItem label="Chair 1" value={sensorData.chair1} />
        <SensorItem label="Chair 2" value={sensorData.chair2} />
        <SensorItem label="Chair 3" value={sensorData.chair3} />
        <SensorItem label="Chair 4" value={sensorData.chair4} />
        <SensorItem label="Chair 5" value={sensorData.chair5} />
        <SensorItem label="Chair 6" value={sensorData.chair6} />
      </View>
    </View>
  );
};

const SensorItem = ({ label, value }) => {
  const detectedValue = value === 'No person detected' ? value : 'Person detected';
  const textColor = value === 'No person detected' ? 'green' : 'red';

  return (
    <View style={styles.sensorItem}>
      <Text style={[styles.sensorLabel, { color: textColor }]}>{label}</Text>
      <Text style={[styles.sensorValue, { color: textColor }]}>{detectedValue}</Text>
    </View>
  );
};

const App = () => {
  const [sensorData, setSensorData] = useState({
    chair1: 'No person detected',
    chair2: 'No person detected',
    chair3: 'No person detected',
    chair4: 'No person detected',
    chair5: 'No person detected',
    chair6: 'No person detected',
  });
  const [personDetectedCount, setPersonDetectedCount] = useState(0);
  const [noPersonDetectedCount, setNoPersonDetectedCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('ESP266_IP_ADDRESS/sensors');
      setSensorData(response.data);

      const detectedCount = Object.values(response.data).filter(value => value !== 'No person detected').length;
      const notDetectedCount = Object.values(response.data).filter(value => value === 'No person detected').length;

      setPersonDetectedCount(detectedCount);
      setNoPersonDetectedCount(notDetectedCount);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Vacant Seat Monitoring</Text>
      <View style={styles.tabContainer}>

      </View>
      <UltrasonicScreen sensorData={sensorData} />
      <View style={styles.countContainer}>
        <Text style={styles.countText}>USED: {personDetectedCount}</Text>
        <Text style={styles.countText}>VACANT: {noPersonDetectedCount}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  titleText: {
    fontSize: 30,
    color: 'white',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#40491B',

  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  sensorContainer: {
    marginBottom: 2,
  },
  sensorItem: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 5,
    backgroundColor: '#C8DAA0',
    borderRadius: 50,
    width: '100%',
    marginBottom: 2,
  },
  sensorLabel: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 60,
    width: '100%',
    marginBottom: 1,
    fontSize: 19,
    fontWeight: 'bold',
  },
  sensorValue: {
    fontSize: 20,

  },
  countContainer: {
    marginTop: 1,
  },
  countText: {
    fontSize: 20,
    fontWeight: 'bold',
  },

});

export default App;
