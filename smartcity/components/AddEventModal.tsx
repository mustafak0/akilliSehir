/*import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';

interface AddEventModalProps {
  isVisible: boolean;
  onClose: () => void;
  onAddEvent: (event: any) => void;
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  includeOtherOption?: boolean;
}

export default function AddEventModal({
  isVisible,
  onClose,
  onAddEvent,
  currentLocation,
  includeOtherOption = false
}: AddEventModalProps) {
  const [type, setType] = useState('trafik');
  const [description, setDescription] = useState('');
  const [customType, setCustomType] = useState('');

  const handleSubmit = () => {
    const finalType = type === 'diger' ? customType : type;

    onAddEvent({
      id: Date.now().toString(),
      type: finalType,
      description,
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      radius: 100, // metre cinsinden yarıçap
    });
    setDescription('');
    setCustomType('');
    onClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modal}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Yeni Olay Ekle</Text>

        <Picker
          selectedValue={type}
          onValueChange={setType}
          style={styles.picker}
        >
          <Picker.Item label="Trafik Kazası" value="trafik" />
          <Picker.Item label="Sel" value="sel" />
          <Picker.Item label="Yol Çalışması" value="yolCalismasi" />
          {includeOtherOption && (
            <Picker.Item label="Diğer" value="diger" />
          )}
        </Picker>

        {type === 'diger' && (
          <TextInput
            style={styles.input}
            placeholder="Özel Olay Türünü Yazın"
            value={customType}
            onChangeText={setCustomType}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Olay Açıklaması"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Ekle</Text>
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
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  picker: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

*/
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';

interface AddEventModalProps {
  isVisible: boolean;
  onClose: () => void;
  onAddEvent: (event: any) => void;
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  includeOtherOption?: boolean;
  isEmergency?: boolean;
}

export default function AddEventModal({
  isVisible,
  onClose,
  onAddEvent,
  currentLocation,
  includeOtherOption = false,
  isEmergency = false,
}: AddEventModalProps) {
  const [type, setType] = useState('trafik');
  const [description, setDescription] = useState('');
  const [customType, setCustomType] = useState('');

  const handleSubmit = () => {
    const finalType = isEmergency ? 'acilDurum' : type;
    const radius = isEmergency ? 500 : 100;

    onAddEvent({
      id: Date.now().toString(),
      type: finalType,
      description,
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      radius,
    });
    setDescription('');
    setCustomType('');
    onClose();
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal}>
      <View style={styles.container}>
        <Text style={styles.title}>
          {isEmergency ? 'Acil Durum Ekle' : 'Yeni Olay Ekle'}
        </Text>

        {!isEmergency && (
          <Picker selectedValue={type} onValueChange={setType} style={styles.picker}>
            <Picker.Item label="Trafik Kazası" value="trafik" />
            <Picker.Item label="Sel" value="sel" />
            <Picker.Item label="Yol Çalışması" value="yolCalismasi" />
            {includeOtherOption && <Picker.Item label="Diğer" value="diger" />}
          </Picker>
        )}

        {type === 'diger' && !isEmergency && (
          <TextInput
            style={styles.input}
            placeholder="Özel Olay Türünü Yazın"
            value={customType}
            onChangeText={setCustomType}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Olay Açıklaması"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Ekle</Text>
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
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  picker: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
