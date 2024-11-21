import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import Index from './Index';
import AddEventModal from './AddEventModal';
import MapComponent from './MapComponent';
import WeatherComponent from './WeatherComponent';
import ModeModal from './ModeModal';

// Mock the dependencies
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

jest.mock('@/hooks/useEventManager', () => ({
  useEventManager: () => ({
    events: [],
    addEvent: jest.fn(),
    addEmergencyEvent: jest.fn(),
  }),
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

describe('AddEventModal Component', () => {
  const mockProps = {
    isVisible: true,
    onClose: jest.fn(),
    onAddEvent: jest.fn(),
    currentLocation: { latitude: 41.0082, longitude: 28.9784 },
    includeOtherOption: true,
  };

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<AddEventModal {...mockProps} />);

    expect(getByText('Yeni Olay Ekle')).toBeTruthy();
    expect(getByPlaceholderText('Olay Açıklaması')).toBeTruthy();
  });

  it('handles event submission correctly', () => {
    const { getByText, getByPlaceholderText } = render(<AddEventModal {...mockProps} />);

    const input = getByPlaceholderText('Olay Açıklaması');
    fireEvent.changeText(input, 'Test description');

    const submitButton = getByText('Ekle');
    fireEvent.press(submitButton);

    expect(mockProps.onAddEvent).toHaveBeenCalled();
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('handles emergency mode correctly', () => {
    const emergencyProps = {
      ...mockProps,
      isEmergency: true,
    };

    const { getByText, queryByText } = render(<AddEventModal {...emergencyProps} />);

    expect(getByText('Acil Durum Ekle')).toBeTruthy();
    expect(queryByText('Trafik Kazası')).toBeNull(); // Picker should not be visible in emergency mode
  });
});

describe('MapComponent', () => {
  const mockEvents = [
    {
      id: '1',
      type: 'trafik',
      latitude: 41.0082,
      longitude: 28.9784,
      description: 'Test event',
      radius: 100,
    },
  ];

  const mockProps = {
    events: mockEvents,
    onEventPress: jest.fn(),
    onMapPress: jest.fn(),
    selectedMode: 'all',
  };

  it('renders correctly with events', () => {
    const { UNSAFE_root } = render(<MapComponent {...mockProps} />);

    expect(UNSAFE_root.findByType('MapView')).toBeTruthy();
    expect(UNSAFE_root.findAllByType('Circle')).toHaveLength(1);
    expect(UNSAFE_root.findAllByType('Marker')).toHaveLength(1);
  });

  it('filters events based on selectedMode', () => {
    const { UNSAFE_root } = render(
      <MapComponent {...mockProps} selectedMode="sel" />
    );

    expect(UNSAFE_root.findAllByType('Circle')).toHaveLength(0);
    expect(UNSAFE_root.findAllByType('Marker')).toHaveLength(0);
  });
});

describe('WeatherComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    const { getByText } = render(<WeatherComponent />);
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('fetches and displays weather data', async () => {
    const { findByText } = render(<WeatherComponent />);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(await findByText('25°C')).toBeTruthy();
  });

  it('handles error state', async () => {
    global.fetch.mockImplementationOnce(() => Promise.reject('API error'));

    const { findByText } = render(<WeatherComponent />);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(await findByText('Weather data could not be loaded')).toBeTruthy();
  });
});

describe('ModeModal', () => {
  const mockProps = {
    isVisible: true,
    onClose: jest.fn(),
    onSelectMode: jest.fn(),
  };

  it('renders correctly', () => {
    const { getByText } = render(<ModeModal {...mockProps} />);

    expect(getByText('Mod Seçin')).toBeTruthy();
    expect(getByText('Tüm Olaylar')).toBeTruthy();
    expect(getByText('Trafik Haritası')).toBeTruthy();
  });

  it('handles mode selection correctly', () => {
    const { getByText } = render(<ModeModal {...mockProps} />);

    fireEvent.press(getByText('Tüm Olaylar'));

    expect(mockProps.onSelectMode).toHaveBeenCalledWith('all');
    expect(mockProps.onClose).toHaveBeenCalled();
  });
});

describe('Index (Main) Component', () => {
  it('renders login screen initially', () => {
    const { getByTestId } = render(<Index />);
    expect(getByTestId('login-screen')).toBeTruthy();
  });

  it('handles login correctly', () => {
    const { getByTestId, getByText } = render(<Index />);

    const loginButton = getByTestId('login-button-user');
    fireEvent.press(loginButton);

    expect(getByText('İstanbul')).toBeTruthy();
  });

  it('handles emergency mode for admin users', () => {
    const { getByTestId, getByText } = render(<Index />);

    // Login as admin
    const adminLoginButton = getByTestId('login-button-admin');
    fireEvent.press(adminLoginButton);

    // Check for emergency button
    const emergencyButton = getByText('Acil Durum');
    expect(emergencyButton).toBeTruthy();

    // Trigger emergency mode
    fireEvent.press(emergencyButton);
    expect(getByTestId('emergency-mode-indicator')).toBeTruthy();
  });
});