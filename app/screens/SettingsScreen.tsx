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
  const [privacyModalVisible, setPrivacyModalVisible] = React.useState(false);
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

      {/* Privacy Policy Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={privacyModalVisible}
        onRequestClose={() => setPrivacyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '80%' }]}>
            <Text style={styles.modalTitle}>Informativa sulla Privacy</Text>
            <ScrollView style={{ marginBottom: 20 }}>
              <Text style={styles.privacyText}>
                Privacy Policy
                {"\n\n"}
                Informativa privacy e cookie policy, ai sensi dell&apos;art 13 del Regolamento Generale per la Protezione dei Dati UE 2016/679 (GDPR), in materia di protezione dei dati personali.
                {"\n\n"}
                1 Titolare del trattamento, Gruppo: Stevanato- Campagnolo -Agnoletto- Boldisor  è titolare del trattamento dei dati personali acquisiti attraverso la propria APP ed è costantemente impegnata a proteggere le informazioni personali dei propri utenti. In questa pagina si descrivono le modalità generali del trattamento dei dati personali degli utenti dell&apos;applicazione. L&apos;informativa è resa solo per questo sito e non anche per altre applicazioni o siti web eventualmente consultati dall&apos;utente tramite link. Il Titolare del Trattamento (di seguito Titolare) e/o il Responsabile della Protezione dei Dati possono essere contattati scrivendo un&apos;email all&apos;indirizzo 902639@stud.unive.it
                {"\n\n"}
                2 Modalità del trattamento. Questo documento è stato redatto ai sensi dell&apos;art. 13 del Regolamento UE 2016/679 (di seguito GDPR), e riepiloga le modalità generali del trattamento dei tuoi dati personali e come le relative informazioni (e.g. Posizione gps) vengono raccolte e gestite quando si utilizza l&apos;App. Le informazioni ed i dati forniti o altrimenti acquisiti nell&apos;ambito dell&apos;utilizzo dei servizi, saranno oggetto di trattamento nel rispetto delle disposizioni del predetto GDPR e degli obblighi di riservatezza. Secondo le norme del GDPR, i trattamenti effettuati dal gruppo, saranno improntati ai principi di liceità, correttezza, trasparenza, limitazione delle finalità e della conservazione, minimizzazione dei dati acquisiti, esattezza, integrità e riservatezza. Ti raccomandiamo di comunicare solo dati aggiornati, pertinenti e non eccedenti le specifiche finalità del trattamento. Eventuali dati non necessari saranno immediatamente cancellati o anonimizzati. Per quanto attiene ai dati di navigazione, i sistemi informatici e le procedure software che governano il funzionamento di quest&apos; applicazione acquisiscono automaticamente, nel corso del loro normale esercizio, alcuni dati relativi ai protocolli di comunicazione di Internet ,ai fini del corretto funzionamento dei servizi offerti, della risoluzione di eventuali problemi tecnici e della sicurezza informatica. In questa categoria rientrano i seguenti dati:
                • indirizzi IP; • data e ora in cui sono state ricevute le richieste al server; • il codice numerico indicante lo stato della risposta data dal server (buon fine, errore, ecc.); • indirizzo URI/URL della pagina di provenienza (referrer); • stringa di riconoscimento del dispositivo che accede al sito (user agent);
                {"\n\n"}
                3 Finalità del trattamento. Oltre ai dati di navigazione, qualora l&apos;utente lo consenta espressamente, l&apos;applicazione può trattare dati relativi alla posizione geografica del dispositivo, al fine di fornire funzionalità basate sulla localizzazione mediante l&apos;utilizzo delle Google Maps API.
                Il trattamento di tali dati avviene esclusivamente previo consenso dell&apos;interessato ed è limitato al tempo strettamente necessario all&apos;erogazione delle funzionalità richieste. Inoltre l&apos;invio facoltativo, esplicito e volontario di dati forniti dall&apos;utente, mediante moduli e form sull&apos;applicazione ovvero mediante posta elettronica agli indirizzi indicati su quest&apos; App, comporta la successiva acquisizione dell&apos;indirizzo del mittente, necessario per rispondere alle richieste, nonché degli eventuali altri dati personali volontariamente comunicati. In tal caso i dati personali dei clienti verranno trattati per le seguenti finalità: a. studio delle tue scelte di consumo (profilazione). I dati qualitativi e quantitativi degli acquisti effettuati e delle aree di interesse, qualora tu ci abbia fornito espressamente il consenso, potranno essere trattati dal Titolare per l&apos;analisi degli acquisti nonché per adattare il più possibile la nostra offerta commerciale al tuo profilo ed alle tue necessità; b. marketing diretto (promozione). Utilizziamo i dati raccolti, qualora tu ci abbia fornito espressamente il consenso, per informarti riguardo ad attività promozionali, commerciali e pubblicitarie che potrebbero interessarti; c. protezione del sito (sicurezza informatica). I dati di navigazione serviranno anche per evitare possibili azioni o minacce da parte di utenti malevoli (hacker, bot, spam, ecc.) nonché per l&apos;accertamento di responsabilità in caso di ipotetici reati informatici ai danni del sito.
                {"\n\n"}
                4. Base giuridica del trattamento. I dati personali raccolti sono trattati esclusivamente per le seguenti finalità:
                a) consentire il corretto funzionamento dell&apos;applicazione e l&apos;erogazione delle funzionalità previste dal progetto;
                b) permettere la visualizzazione di mappe interattive e l&apos;utilizzo di servizi di geolocalizzazione tramite le Google Maps API;
                c) migliorare l&apos;esperienza di utilizzo dell&apos;applicazione e garantire la sicurezza tecnica del sistema;
                d) adempiere ad eventuali obblighi di legge o richieste delle autorità competenti.
                Il trattamento dei dati personali è limitato a quanto strettamente necessario al perseguimento delle finalità sopra indicate e avviene nel rispetto del principio di minimizzazione dei dati, ai sensi dell&apos;art. 5, par. 1, lett. c) del GDPR.
                {"\n\n"}
                5  Base giuridica del trattamento. Il trattamento dei dati personali è effettuato ai sensi dell&apos;art. 6 del Regolamento (UE) 2016/679 ed è fondato sulle seguenti basi giuridiche:
                a) il consenso dell&apos;interessato (art. 6, par. 1, lett. a GDPR), espresso liberamente e in modo esplicito, con riferimento al trattamento dei dati di localizzazione e all&apos;utilizzo delle funzionalità basate sulla posizione geografica;
                b) il legittimo interesse del Titolare del trattamento (art. 6, par. 1, lett. f GDPR), limitatamente ai dati di navigazione e alle informazioni tecniche necessarie a garantire il corretto funzionamento, la sicurezza e la stabilità dell&apos;applicazione.
                Il conferimento dei dati personali per le finalità sopra indicate è facoltativo; tuttavia, il mancato conferimento di alcuni dati può comportare l&apos;impossibilità di utilizzare determinate funzionalità dell&apos;applicazione.
                Il consenso eventualmente prestato può essere revocato in qualsiasi momento, senza pregiudicare la liceità del trattamento basata sul consenso prima della revoca.
                {"\n\n"}
                6  Destinatari dei dati personali. I dati personali trattati nell&apos;ambito del presente progetto possono essere comunicati a soggetti terzi, esclusivamente per il perseguimento delle finalità indicate nella presente informativa.
                In particolare, per l&apos;erogazione dei servizi di mappe e geolocalizzazione, l&apos;applicazione utilizza le Google Maps API, fornite da Google LLC, che opera in qualità di titolare autonomo del trattamento, in conformità alle proprie informative privacy.
                I dati personali non sono oggetto di diffusione.
                L&apos;elenco aggiornato dei soggetti destinatari dei dati può essere richiesto al Titolare del trattamento.
                {"\n\n"}
                7 Trasferimento dei dati verso Paesi extra UE.  Nell&apos;ambito dell&apos;utilizzo delle Google Maps API, alcuni dati personali possono essere trasferiti verso Paesi situati al di fuori dell&apos;Unione Europea, in particolare verso gli Stati Uniti d&apos;America.
                Tali trasferimenti sono effettuati da Google LLC, che opera in qualità di titolare autonomo del trattamento, nel rispetto delle disposizioni di cui agli artt. 44 e seguenti del Regolamento (UE) 2016/679.
                Il trasferimento dei dati avviene sulla base di garanzie adeguate, quali le Clausole Contrattuali Standard approvate dalla Commissione Europea, ovvero altri strumenti di trasferimento conformi alla normativa vigente.
                Ulteriori informazioni sulle modalità di trattamento e trasferimento dei dati da parte di Google sono disponibili nelle rispettive informative privacy.
              </Text>
            </ScrollView>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() => setPrivacyModalVisible(false)}
              >
                <Text style={styles.buttonText}>Chiudi</Text>
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
            <TouchableOpacity
              style={[styles.linkRow]}
              onPress={() => setPrivacyModalVisible(true)}
            >
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
  privacyText: {
    color: '#ccc',
    lineHeight: 22,
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 15,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
