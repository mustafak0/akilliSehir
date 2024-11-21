import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { parseString } from 'react-native-xml2js';

export default function WeatherComponent() {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          'https://api.openweathermap.org/data/2.5/find?q=Istanbul&units=metric&type=accurate&mode=xml&APPID=1464f9d9a77bb815cd7397cb50e72352'
        );

        if (!response.ok) {
          throw new Error('Weather data could not be fetched');
        }

        const xmlText = await response.text();

        parseString(xmlText, (err, result) => {
          if (err) {
            setError('XML parsing error');
            return;
          }

          try {
            // Directly access the temperature value from the first item in the list
            const temp = result.cities.list[0].item[0].temperature[0]['$'].value;

            if (temp) {
              setTemperature(Math.round(parseFloat(temp)));
            } else {
              setError('Temperature not found');
            }
          } catch (parseError) {
            setError('Failed to parse temperature');
          }
        });
      } catch (err) {
        setError('Weather data could not be loaded');
      }
    };

    fetchWeather();
  }, []);

  if (error) {
    return (
      <View style={styles.weatherContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.weatherContainer}>
      <Text style={styles.weatherText}>
        {temperature ? `${temperature}°C` : 'Loading...'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  weatherContainer: {
    position: 'absolute',
    top: 80,
    right: 20,
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    zIndex: 1,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  weatherText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
  },
});