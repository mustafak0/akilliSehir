import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import Index from './Index';
import { useEventManager } from '@/hooks/useEventManager';

// Mock all necessary dependencies
jest.mock('react-native-maps', () => ({
  __esModule: true,
  default: 'MapView',
  Marker: 'Marker',
  Circle: 'Circle',
}));

jest.mock('react-native-modal', () => 'Modal');
jest.mock('@react-native-picker/picker', () => ({
  Picker: 'Picker',
}));

jest.mock('react-native-webview', () => ({
  WebView: 'WebView',
}));

// Mock fetch for WeatherComponent
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    text: () => Promise.resolve(`
      <?xml version="1.0" encoding="UTF-8"?>
      <cities>
        <list>
          <item>
            <temperature value="25"/>
          </item>
        </list>
      </cities>
    `),
  })
);

describe('Application Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('User Flow Tests', () => {
    it('should handle complete user login and event addition flow', async () => {
      const { getByTestId, getByText, getByPlaceholderText, queryByText } = render(<Index />);

      // 1. Login as regular user
      const userLoginButton = getByTestId('login-button-user');
      fireEvent.press(userLoginButton);

      // Verify main screen components are rendered
      expect(getByText('İstanbul')).toBeTruthy();
      expect(queryByText('Acil Durum')).toBeNull(); // Regular user shouldn't see emergency button

      // 2. Add new event
      const addEventButton = getByText('Olay Ekle');
      fireEvent.press(addEventButton);

      // Verify modal appears and fill event details
      const descriptionInput = getByPlaceholderText('Olay Açıklaması');
      fireEvent.changeText(descriptionInput, 'Test trafik kazası');

      // Submit event
      const submitButton = getByText('Ekle');
      fireEvent.press(submitButton);

      // Verify event appears on map
      await waitFor(() => {
        expect(getByTestId('map-marker-trafik')).toBeTruthy();
      });
    });

    it('should handle mode switching and filtering', async () => {
      const { getByTestId, getByText, queryByTestId } = render(<Index />);

      // 1. Login
      fireEvent.press(getByTestId('login-button-user'));

      // 2. Add multiple events
      const addEventButton = getByText('Olay Ekle');

      // Add traffic event
      fireEvent.press(addEventButton);
      fireEvent.changeText(getByPlaceholderText('Olay Açıklaması'), 'Trafik kazası');
      fireEvent.press(getByText('Ekle'));

      // Add flood event
      fireEvent.press(addEventButton);
      const picker = getByTestId('event-type-picker');
      fireEvent.changeText(picker, 'sel');
      fireEvent.changeText(getByPlaceholderText('Olay Açıklaması'), 'Sel durumu');
      fireEvent.press(getByText('Ekle'));

      // 3. Switch modes and verify filtering
      const modeButton = getByText('Mod Değiştir');
      fireEvent.press(modeButton);

      // Select traffic filter
      fireEvent.press(getByText('Trafik'));

      // Verify only traffic event is visible
      await waitFor(() => {
        expect(getByTestId('map-marker-trafik')).toBeTruthy();
        expect(queryByTestId('map-marker-sel')).toBeNull();
      });
    });
  });

  describe('Admin Flow Tests', () => {
    it('should handle complete admin emergency flow', async () => {
      const { getByTestId, getByText, getByPlaceholderText } = render(<Index />);

      // 1. Login as admin
      fireEvent.press(getByTestId('login-button-admin'));

      // Verify admin has access to emergency button
      const emergencyButton = getByText('Acil Durum');
      expect(emergencyButton).toBeTruthy();

      // 2. Trigger emergency mode
      fireEvent.press(emergencyButton);
      expect(getByTestId('emergency-mode-indicator')).toBeTruthy();

      // 3. Add emergency event
      const mapView = getByTestId('map-view');
      fireEvent(mapView, 'press', {
        nativeEvent: {
          coordinate: {
            latitude: 41.0082,
            longitude: 28.9784,
          },
        },
      });

      // Fill emergency details
      fireEvent.changeText(
        getByPlaceholderText('Olay Açıklaması'),
        'Acil durum test'
      );
      fireEvent.press(getByText('Ekle'));

      // Verify emergency event appears with correct styling
      await waitFor(() => {
        const emergencyMarker = getByTestId('map-marker-emergency');
        expect(emergencyMarker).toBeTruthy();
        expect(emergencyMarker.props.style).toHaveProperty('backgroundColor', '#660099');
      });
    });
  });

  describe('Weather Integration Tests', () => {
    it('should integrate weather data with map view', async () => {
      const { getByTestId, findByText } = render(<Index />);

      // Login
      fireEvent.press(getByTestId('login-button-user'));

      // Wait for weather data to load
      await waitFor(async () => {
        expect(await findByText('25°C')).toBeTruthy();
      });

      // Verify weather affects map display (if applicable)
      const mapView = getByTestId('map-view');
      expect(mapView.props.customMapStyle).toBeTruthy();
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle API errors gracefully', async () => {
      // Mock failed weather API call
      global.fetch.mockImplementationOnce(() => Promise.reject('API error'));

      const { getByTestId, findByText } = render(<Index />);

      // Login
      fireEvent.press(getByTestId('login-button-user'));

      // Verify error state is handled properly
      await waitFor(async () => {
        expect(await findByText('Weather data could not be loaded')).toBeTruthy();
      });

      // Verify app continues to function despite weather API error
      expect(getByTestId('map-view')).toBeTruthy();
      expect(getByText('Olay Ekle')).toBeTruthy();
    });

    it('should handle event addition errors', async () => {
      // Mock event addition error
      const mockAddEvent = jest.fn().mockRejectedValue(new Error('Failed to add event'));
      jest.spyOn(useEventManager(), 'addEvent').mockImplementation(mockAddEvent);

      const { getByTestId, getByText, getByPlaceholderText } = render(<Index />);

      // Login and attempt to add event
      fireEvent.press(getByTestId('login-button-user'));
      fireEvent.press(getByText('Olay Ekle'));
      fireEvent.changeText(getByPlaceholderText('Olay Açıklaması'), 'Test event');
      fireEvent.press(getByText('Ekle'));

      // Verify error handling
      await waitFor(() => {
        expect(getByText('Olay eklenirken bir hata oluştu')).toBeTruthy();
      });
    });
  });

  describe('Performance Integration Tests', () => {
    it('should handle multiple rapid events addition', async () => {
      const { getByTestId, getByText, getByPlaceholderText } = render(<Index />);

      // Login
      fireEvent.press(getByTestId('login-button-user'));

      // Add multiple events rapidly
      for (let i = 0; i < 10; i++) {
        fireEvent.press(getByText('Olay Ekle'));
        fireEvent.changeText(
          getByPlaceholderText('Olay Açıklaması'),
          `Test event ${i}`
        );
        fireEvent.press(getByText('Ekle'));
      }

      // Verify all events are rendered without performance issues
      await waitFor(() => {
        const markers = getAllByTestId(/map-marker/);
        expect(markers).toHaveLength(10);
      });

      // Verify map still responds to interaction
      const mapView = getByTestId('map-view');
      fireEvent(mapView, 'press');
      expect(getByText('Olay Ekle')).toBeTruthy();
    });
  });
});