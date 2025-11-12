import { useRouter } from 'expo-router';
import { ArrowLeft, ScrollText } from 'lucide-react-native';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Colors } from '../../constants/theme';

const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [weatherAlerts, setWeatherAlerts] = React.useState(true);
  const [floodAlerts, setFloodAlerts] = React.useState(true);
  const [fireAlerts, setFireAlerts] = React.useState(false);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
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
              <View style={styles.row}>
                <Text style={styles.switchLabel}>Raggio di allerta</Text>
                <Text style={{ color: Colors.light.primary, fontFamily: 'SpaceGrotesk-Medium' }}>
                  50 km
                </Text>
              </View>
              <Text style={styles.sliderDescription}>
                Ricevi allerte per eventi nel raggio selezionato.
              </Text>
              {/* Slider would go here */}
            </View>
          </View>
        </View>

        {/* Account & Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account e Sicurezza</Text>
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
        <TouchableOpacity style={styles.saveButton}>
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
    textAlign: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
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
});

export default SettingsScreen;
