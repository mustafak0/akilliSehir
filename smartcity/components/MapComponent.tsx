import React from 'react';
import MapView, { Circle, Marker, MapPressEvent } from 'react-native-maps';
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

interface MapComponentProps {
  events: Array<{
    id: string;
    type: string;
    latitude: number;
    longitude: number;
    description: string;
    radius: number;
    isEmergency?: boolean; // Acil durum olup olmadığını belirten opsiyonel özellik
  }>;
  onEventPress: (event: any) => void;
  onMapPress?: (event: MapPressEvent) => void;
  selectedMode: string;
}

export default function MapComponent({
  events,
  onEventPress,
  onMapPress,
  selectedMode,
}: MapComponentProps) {
  const filteredEvents =
    selectedMode === 'all'
      ? events
      : events.filter((event) => event.type === selectedMode);

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: 41.0082,
        longitude: 28.9784,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      onPress={onMapPress}
    >
      {filteredEvents.map((event) => (
        <React.Fragment key={event.id}>
          <Circle
            center={{
              latitude: event.latitude,
              longitude: event.longitude,
            }}
            radius={event.radius}
            fillColor={
              event.isEmergency ? 'rgba(128, 0, 128, 0.3)' : 'rgba(255, 0, 0, 0.2)'
            } // Acil durum mor, normal olay kırmızı
            strokeColor={
              event.isEmergency ? 'purple' : 'rgba(255, 0, 0, 0.5)'
            } // Çerçeve rengi
          />
          <Marker
            coordinate={{
              latitude: event.latitude,
              longitude: event.longitude,
            }}
            onPress={() => onEventPress(event)}
          />
        </React.Fragment>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width,
    height: height * 0.95,
  },
});
