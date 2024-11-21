import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { WebView } from 'react-native-webview';

interface ModeModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectMode: (mode: string) => void;
}

export default function ModeModal({
  isVisible,
  onClose,
  onSelectMode
}: ModeModalProps) {
  const [showTrafficMap, setShowTrafficMap] = React.useState(false);

  const handleTrafficMapView = () => {
    setShowTrafficMap(true);
  };

  if (showTrafficMap) {
    return (
      <Modal
        isVisible={isVisible}
        onBackdropPress={onClose}
        style={styles.fullScreenModal}
      >
        <WebView
          source={{ uri: 'https://uym.ibb.gov.tr/yharita6/Harita_tr.aspx' }}
          style={styles.webview}
        />
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            setShowTrafficMap(false);
            onClose();
          }}
        >
          <Text style={styles.closeButtonText}>Kapat</Text>
        </TouchableOpacity>
      </Modal>
    );
  }

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modal}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Mod Seçin</Text>

        <TouchableOpacity
          style={styles.modeButton}
          onPress={() => {
            onSelectMode('all');
            onClose();
          }}
        >
          <Text style={styles.modeButtonText}>Tüm Olaylar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.modeButton}
          onPress={handleTrafficMapView}
        >
          <Text style={styles.modeButtonText}>Trafik Haritası</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  fullScreenModal: {
    margin: 0,
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  webview: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modeButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  modeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});