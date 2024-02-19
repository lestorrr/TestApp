import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';

const UltrasonicScreen = ({ sensorData, handleOpenDoor, handleCloseDoor }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.sensorContainer}>
        <SensorItem label="Chair 1" value={sensorData.chair1} />
        <SensorItem label="Chair 2" value={sensorData.chair2} />
        <SensorItem label="Chair 3" value={sensorData.chair3} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Open Door" onPress={handleOpenDoor} />
        <Button title="Close Door" onPress={handleCloseDoor} />
      </View>
    </ScrollView>
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
    chair3: 'No person detected', // Initialize chair3 sensor data
  });
  const [personDetectedCount, setPersonDetectedCount] = useState(0);
  const [noPersonDetectedCount, setNoPersonDetectedCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(fetchData, 500);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://192.168.1.102/sensors');
      setSensorData(response.data);

      const detectedCount = Object.values(response.data).filter(value => value === 'Person detected').length;
      const notDetectedCount = Object.values(response.data).filter(value => value === 'No person detected').length;

      setPersonDetectedCount(detectedCount);
      setNoPersonDetectedCount(notDetectedCount);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleOpenDoor = async () => {
    try {
      await axios.get('http://192.168.1.102/open');
      console.log('Door opened');
    } catch (error) {
      console.error('Error opening door:', error);
    }
  };

  const handleCloseDoor = async () => {
    try {
      await axios.get('http://192.168.1.102/close');
      console.log('Door closed');
    } catch (error) {
      console.error('Error closing door:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Vacant Seat Monitoring</Text>
      <UltrasonicScreen
        sensorData={sensorData}
        handleOpenDoor={handleOpenDoor}
        handleCloseDoor={handleCloseDoor}
      />
      <View style={styles.countContainer}>
        <Text style={styles.countText}>USED: {personDetectedCount}</Text>
        <Text style={styles.countText}>VACANT: {noPersonDetectedCount}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#40491B',
  },
  titleText: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  sensorContainer: {
    marginBottom: 10,
  },
  sensorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#C8DAA0',
    borderRadius: 10,
    marginBottom: 5,
  },
  sensorLabel: {
    flex: 1,
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sensorValue: {
    color: 'black',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  countContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  countText: {
    fontSize: 18,
    color: 'white',
  },
});

export default App;
