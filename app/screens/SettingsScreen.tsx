import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Switch,
  TextInput,
} from 'react-native';
import { Colors, Fonts, BorderRadius } from '../../constants/theme';
import { SymbolView } from 'expo-symbols';
import { useRouter } from 'expo-router';

const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [weatherAlerts, setWeatherAlerts] = React.useState(true);
  const [floodAlerts, setFloodAlerts] = React.useState(true);
  const [fireAlerts, setFireAlerts] = React.useState(false);
  const [is4x4, setIs4x4] = React.useState(false);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <SymbolView name="arrow_back" size={24} tintColor={Colors.dark.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Impostazioni</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView style={styles.content}>
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profilo Utente</Text>
          <View style={styles.profileCard}>
            <Image
              source={require('../../assets/images/user-avatar.png')}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Mario Rossi</Text>
              <Text style={styles.profileEmail}>mario.rossi@email.com</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Modifica</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Vehicle Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informazioni Veicolo</Text>
          <View style={styles.card}>
            {/* Vehicle Type Picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tipo di veicolo</Text>
              {/* This would be a picker */}
              <View style={styles.picker}>
                <Text style={styles.pickerText}>Automobile</Text>
                <SymbolView name="unfold_more" size={24} tintColor={Colors.dark.placeholder} />
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Modello</Text>
                <TextInput style={styles.input} placeholder="es. Fiat Panda" />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Targa</Text>
                <TextInput style={styles.input} placeholder="es. AA123BB" />
              </View>
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Veicolo 4x4</Text>
              <Switch
                value={is4x4}
                onValueChange={setIs4x4}
                trackColor={{ false: '#767577', true: Colors.light.primary }}
                thumbColor={is4x4 ? '#f4f3f4' : '#f4f3f4'}
              />
            </View>
          </View>
        </View>

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
            <TouchableOpacity style={styles.linkRow}>
              <Text style={styles.linkLabel}>Modifica Password</Text>
              <SymbolView name="chevron_right" size={24} tintColor={Colors.dark.placeholder} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkRow}>
              <Text style={styles.linkLabel}>Impostazioni Privacy</Text>
              <SymbolView name="chevron_right" size={24} tintColor={Colors.dark.placeholder} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkRow}>
              <Text style={[styles.linkLabel, { color: Colors.light['alert-high'] }]}>
                Log Out
              </Text>
            </TouchableOpacity>
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
    fontSize: 20,
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
    borderRadius: BorderRadius.xl,
    padding: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.inputBackground,
    borderRadius: BorderRadius.xl,
    padding: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontFamily: 'SpaceGrotesk-Medium',
    fontSize: 16,
    color: Colors.dark.text,
  },
  profileEmail: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 14,
    color: Colors.dark.placeholder,
  },
  editButton: {
    backgroundColor: 'rgba(96, 122, 251, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.lg,
  },
  editButtonText: {
    color: Colors.light.primary,
    fontFamily: 'SpaceGrotesk-Medium',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'SpaceGrotesk-Medium',
    fontSize: 16,
    color: Colors.dark.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#101922',
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: BorderRadius.lg,
    height: 56,
    paddingHorizontal: 16,
    color: Colors.dark.text,
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 16,
  },
  picker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#101922',
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: BorderRadius.lg,
    height: 56,
    paddingHorizontal: 16,
  },
  pickerText: {
    color: Colors.dark.text,
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
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
    paddingVertical: 16,
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
