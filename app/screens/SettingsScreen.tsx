import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import { ArrowLeft, ScrollText } from 'lucide-react-native';
import React, { useEffect } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Colors } from '../../constants/theme';
import { NotificationService } from '../services/NotificationService';

import { useDispatch } from 'react-redux';
import { setOrigin, setSimulationMode } from '../../store/slice';

const SettingsScreen = () => {
  const dispatch = useDispatch();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [weatherAlerts, setWeatherAlerts] = React.useState(true);
  const [floodAlerts, setFloodAlerts] = React.useState(true);
  const [fireAlerts, setFireAlerts] = React.useState(false);
  const [alertRadius, setAlertRadius] = React.useState<number>(50);
  const router = useRouter();

  useEffect(() => {
    loadSettings();
  }, []);

  // ... (saveSettings and loadSettings remain unchanged) ...
  const saveSettings = async () => {
    try {
      const settings = JSON.stringify({
        notificationsEnabled,
        weatherAlerts,
        floodAlerts,
        fireAlerts,
        alertRadius,
      });
      await AsyncStorage.setItem('settings', settings);
    } catch (e) {
      console.error('Failed to save settings.', e);
    }
  };

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('settings');
      if (settings !== null) {
        const parsedSettings = JSON.parse(settings);
        setNotificationsEnabled(parsedSettings.notificationsEnabled);
        setWeatherAlerts(parsedSettings.weatherAlerts);
        setFloodAlerts(parsedSettings.floodAlerts);
        setFireAlerts(parsedSettings.fireAlerts);
        setAlertRadius(parsedSettings.alertRadius);
      }
    } catch (e) {
      console.error('Failed to load settings.', e);
    }
  };

  const [modalVisible, setModalVisible] = React.useState(false);
  const [simLat, setSimLat] = React.useState('44.4949'); // Default Bologna
  const [simLng, setSimLng] = React.useState('11.3426');

  // ... (useEffect and loadSettings remain unchanged)

  const handleSimulateAlert = () => {
    setModalVisible(true);
  };

  const handleTestNotification = async () => {
    await NotificationService.testNow();
    Alert.alert("Test Inviato", "Dovresti ricevere una notifica a breve. Se non arriva, controlla i log (Expo Go non supporta push remote, ma quelle locali dovrebbero funzionare).");
  };

  const confirmSimulation = () => {
    const lat = parseFloat(simLat);
    const lng = parseFloat(simLng);

    if (isNaN(lat) || isNaN(lng)) {
      Alert.alert("Errore", "Coordinate non valide");
      return;
    }

    dispatch(setSimulationMode(true));
    dispatch(setOrigin({
      location: { lat, lng },
      description: `Simulazione (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
    }));

    setModalVisible(false);

    Alert.alert(
      "Posizione Impostata",
      "La posizione manuale è attiva. Le allerte verranno caricate per questa area.",
      [
        { text: "Vai alla Mappa", onPress: () => router.push("/screens/MapScreen") },
        { text: "OK", style: "cancel" }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Simulation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Imposta Posizione Manuale</Text>

            <Text style={styles.inputLabel}>Latitudine</Text>
            <TextInput
              style={styles.input}
              value={simLat}
              onChangeText={setSimLat}
              keyboardType="numeric"
              placeholder="44.4949"
              placeholderTextColor="#999"
            />

            <Text style={styles.inputLabel}>Longitudine</Text>
            <TextInput
              style={styles.input}
              value={simLng}
              onChangeText={setSimLng}
              keyboardType="numeric"
              placeholder="11.3426"
              placeholderTextColor="#999"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Annulla</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmSimulation}
              >
                <Text style={styles.buttonText}>Imposta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.dark.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Impostazioni</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView style={styles.content}>
        {/* Notification Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Impostazioni Notifiche</Text>
          <View style={styles.card}>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabelBold}>Abilita Notifiche</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#767577', true: Colors.light.primary }}
                thumbColor={notificationsEnabled ? '#f4f3f4' : '#f4f3f4'}
              />
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Allerta Meteo</Text>
              <Switch
                value={weatherAlerts}
                onValueChange={setWeatherAlerts}
                trackColor={{ false: '#767577', true: Colors.light.primary }}
                thumbColor={weatherAlerts ? '#f4f3f4' : '#f4f3f4'}
              />
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Alluvioni</Text>
              <Switch
                value={floodAlerts}
                onValueChange={setFloodAlerts}
                trackColor={{ false: '#767577', true: Colors.light.primary }}
                thumbColor={floodAlerts ? '#f4f3f4' : '#f4f3f4'}
              />
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Incendi</Text>
              <Switch
                value={fireAlerts}
                onValueChange={setFireAlerts}
                trackColor={{ false: '#767577', true: Colors.light.primary }}
                thumbColor={fireAlerts ? '#f4f3f4' : '#f4f3f4'}
              />
            </View>
            {/* Alert Radius */}
            <View style={{ marginTop: 16 }}>
              <View style={{ alignItems: 'flex-end', width: '100%' }}>
                <View style={styles.row}>
                  <Text style={styles.switchLabel}>Raggio Allerta</Text>
                  <Text style={[styles.switchLabel, styles.alertValue]}>
                    {alertRadius} km
                  </Text>
                </View>
                <Slider
                  style={{ width: '100%', height: 40, }}
                  minimumValue={0}
                  maximumValue={250}
                  step={5}
                  value={alertRadius}
                  onValueChange={(value) => setAlertRadius(Math.round(value))}
                  minimumTrackTintColor={Colors.light.primary}
                  maximumTrackTintColor="#767577"
                  thumbTintColor="#f4f3f4"
                />
              </View>
            </View>
            <Text style={styles.sliderDescription}>
              Ricevi allerte per eventi nel raggio selezionato.
            </Text>

            {/* Manual Location Button */}
            <TouchableOpacity
              style={styles.testButton}
              onPress={handleSimulateAlert}>
              <Text style={styles.testButtonText}>🗺️ Imposta Posizione Manuale</Text>
            </TouchableOpacity>

            {/* Test Notification Button */}
            <TouchableOpacity
              style={[styles.testButton, { marginTop: 10, borderColor: 'rgba(100, 200, 100, 0.3)', backgroundColor: 'rgba(100, 200, 100, 0.1)' }]}
              onPress={handleTestNotification}>
              <Text style={[styles.testButtonText, { color: '#4ade80' }]}>🔔 Test Notifica Push</Text>
            </TouchableOpacity>

            {/* Slider would go here */}
          </View>
        </View>
        {/* Account & Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sicurezza</Text>
          <View style={styles.card}>
            <TouchableOpacity style={[styles.linkRow]}>
              <Text style={styles.linkLabel}>Impostazioni Privacy</Text>
              <ScrollText size={20} color={Colors.dark.placeholder} />
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.linkRow}>
              <Text style={[styles.linkLabel, { color: Colors.light['alert-high'] }]}>
                Log Out
              </Text>
              <TriangleAlert size={24} color={Colors.light['alert-high']} />
            </TouchableOpacity> */}
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => {
            saveSettings();
            router.back();
          }}
        >
          <Text style={styles.saveButtonText}>Salva Modifiche</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: Colors.dark.border,
  },
  backButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -12,
  },
  title: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 24,
    color: Colors.dark.text,
  },
  placeholder: {
    width: 48,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 18,
    color: Colors.dark.text,
    marginBottom: 8,
  },
  card: {
    backgroundColor: Colors.dark.inputBackground,
    borderRadius: BorderRadius.lg,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  alertValue: {
    color: Colors.light.primary,
    fontFamily: 'SpaceGrotesk-Medium',
    textAlign: 'right',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  switchLabel: {
    fontFamily: 'SpaceGrotesk-Medium',
    fontSize: 16,
    color: Colors.dark.text,
  },
  switchLabelBold: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 16,
    color: Colors.dark.text,
  },
  sliderDescription: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 14,
    color: Colors.dark.placeholder,
    marginTop: 4,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  linkRowWithBorder: {
    borderBottomWidth: 1,
    borderColor: Colors.dark.border,
  },
  linkLabel: {
    fontFamily: 'SpaceGrotesk-Medium',
    fontSize: 16,
    color: Colors.dark.text,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: Colors.dark.border,
  },
  saveButton: {
    backgroundColor: Colors.light.primary,
    height: 56,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 16,
    color: 'white',
  },
  testButton: {
    marginTop: 20,
    backgroundColor: 'rgba(255, 100, 100, 0.1)',
    padding: 12,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 100, 100, 0.3)',
  },
  testButtonText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 14,
    color: Colors.light['alert-high'],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.dark.inputBackground,
    padding: 24,
    borderRadius: 20,
    width: '85%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    color: '#ccc',
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: '#333',
    color: 'white',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#444',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#444',
  },
  confirmButton: {
    backgroundColor: Colors.light.primary,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
