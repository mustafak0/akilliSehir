import React, { useState, useEffect } from 'react';
import { firebaseService } from '@/services/firebase';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import MapView from 'react-native-maps';
import Modal from 'react-native-modal';

import AddEventModal from '@/components/AddEventModal';
import ModeModal from '@/components/ModeModal';
import MapComponent from '@/components/MapComponent';
import LoginScreen from '@/components/LoginScreen';
import WeatherComponent from '@/components/WeatherComponent';
import { useEventManager } from '@/hooks/useEventManager';

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'user' | 'admin' | 'visitor'>('visitor');
  const [isEventModalVisible, setEventModalVisible] = useState(false);
  const [isModeModalVisible, setModeModalVisible] = useState(false);
  const [selectedMode, setSelectedMode] = useState('all');
  const { events, addEvent, addEmergencyEvent } = useEventManager();
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 41.0082,
    longitude: 28.9784,
  });
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [isOptionsVisible, setOptionsVisible] = useState(false);

  const handleLogin = (type: 'user' | 'admin' | 'visitor') => {
    setUserType(type);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType('visitor');
    setOptionsVisible(false);
    setIsEmergencyMode(false);
    setEventModalVisible(false);
    setModeModalVisible(false);
  };

  const handleMapPress = (event) => {
    if (userType !== 'visitor' && !isEmergencyMode) {
      setCurrentLocation(event.nativeEvent.coordinate);
      setEventModalVisible(true);
    } else if (userType === 'admin' && isEmergencyMode) {
      setCurrentLocation(event.nativeEvent.coordinate);
      setEventModalVisible(true);
    }
  };

  const handleAddEvent = (newEvent) => {
    addEvent(newEvent);
  };

  const handleAddEmergencyEvent = (eventDetails) => {
    addEmergencyEvent({
      id: Date.now().toString(),
      type: 'acilDurum',
      description: eventDetails.description,
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      radius: 500,
      color: '#660099',
    });
    setIsEmergencyMode(false);
  };

  const handleEmergencyMode = () => {
    setIsEmergencyMode(true);
  };

  const handleEventPress = (event) => {
    alert(`Olay Türü: ${event.type}\nAçıklama: ${event.description}`);
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.optionsButton}
        onPress={() => setOptionsVisible(!isOptionsVisible)}
      >
        <Text style={styles.optionsButtonText}>⋮</Text>
      </TouchableOpacity>

      {isOptionsVisible && (
        <View style={styles.optionsMenu}>
          <TouchableOpacity
            style={styles.optionItem}
            onPress={handleLogout}
          >
            <Text style={styles.optionText}>Çıkış Yap</Text>
          </TouchableOpacity>
        </View>
      )}

      <WeatherComponent
        latitude={currentLocation.latitude}
        longitude={currentLocation.longitude}
      />

      <View style={styles.cityBadge}>
        <Text style={styles.cityText}>İstanbul</Text>
      </View>

      <MapComponent
        events={events}
        onEventPress={handleEventPress}
        onMapPress={handleMapPress}
        selectedMode={selectedMode}
      />

      <View style={styles.buttonContainer}>
        {userType !== 'visitor' && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => setEventModalVisible(true)}
          >
            <Text style={styles.buttonText}>Olay Ekle</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => setModeModalVisible(true)}
        >
          <Text style={styles.buttonText}>Mod Değiştir</Text>
        </TouchableOpacity>

        {userType === 'admin' && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: 'purple' }]}
            onPress={handleEmergencyMode}
          >
            <Text style={styles.buttonText}>Acil Durum</Text>
          </TouchableOpacity>
        )}
      </View>

      <AddEventModal
        isVisible={isEventModalVisible}
        onClose={() => setEventModalVisible(false)}
        onAddEvent={isEmergencyMode ? handleAddEmergencyEvent : handleAddEvent}
        currentLocation={currentLocation}
        includeOtherOption={!isEmergencyMode}
        isEmergency={isEmergencyMode}
      />

      <ModeModal
        isVisible={isModeModalVisible}
        onClose={() => setModeModalVisible(false)}
        onSelectMode={setSelectedMode}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cityBadge: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    zIndex: 1,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  optionsButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 2,
  },
  optionsButtonText: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
  },
  optionsMenu: {
    position: 'absolute',
    top: 90,
    left: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 2,
  },
  optionItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});