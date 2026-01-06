import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FETCH_TASK_NAME = 'BACKGROUND_WEATHER_CHECK';
const WEATHER_API_KEY = '03cc585bb4c149c78a2130544260601';

// Configurazione notifiche (foreground)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Funzione principale di controllo meteo
const checkWeatherAndNotify = async (isTest = false): Promise<BackgroundFetch.BackgroundFetchResult> => {
  try {
    console.log(`[WeatherCheck] Inizio controllo (Test: ${isTest})`);

    // 1. Carica impostazioni
    const settingsStr = await AsyncStorage.getItem('settings');
    const settings = settingsStr ? JSON.parse(settingsStr) : {};

    // Default enabled
    const notificationsEnabled = settings.notificationsEnabled ?? true;

    if (!notificationsEnabled) {
      console.log('[WeatherCheck] Notifiche disabilitate nelle impostazioni');
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    // 2. Ottieni Posizione
    // Verifica permessi
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('[WeatherCheck] Permesso posizione mancante');
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }

    // Prova a ottenere l'ultima posizione nota per velocità
    let location = await Location.getLastKnownPositionAsync({});

    // Se non disponibile o se stiamo testando e vogliamo la posizione precisa
    if (!location) {
        try {
            location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        } catch (e) {
            console.log('[WeatherCheck] Errore posizione corrente:', e);
        }
    }

    if (!location) {
        console.log('[WeatherCheck] Posizione non disponibile');
        return BackgroundFetch.BackgroundFetchResult.Failed;
    }

    const { latitude, longitude } = location.coords;
    console.log(`[WeatherCheck] Posizione rilevata: ${latitude}, ${longitude}`);

    // 3. Chiama Weather API
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${latitude},${longitude}&days=1&aqi=no&alerts=yes`;

    const response = await fetch(url);
    if (!response.ok) {
        console.error(`[WeatherCheck] API Error: ${response.status}`);
        return BackgroundFetch.BackgroundFetchResult.Failed;
    }

    const data = await response.json();
    let alerts = data.alerts?.alert ?? [];

    // Test notifica
    if (isTest && alerts.length === 0) {
        alerts = [{
            event: 'Test Allerta Meteo',
            severity: 'Moderate',
            headline: `Test riuscito! Posizione: ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
            effective: new Date().toISOString()
        }];
    }

    if (!alerts || alerts.length === 0) {
      console.log('[WeatherCheck] Nessuna allerta trovata');
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    // 4. Invia Notifiche
    let notificationSent = false;
    const lastAlertId = await AsyncStorage.getItem('lastAlertId');

    for (const alert of alerts) {
      const alertId = `${alert.event}-${alert.effective}`;
      const alertType = alert.event ?? '';

      // Filtri (applicati solo se NON è un test)
      if (!isTest) {
          // Evita duplicati
          if (alertId === lastAlertId) continue;

          // Filtro globale meteo
          if (settings.weatherAlerts === false) continue;

          // Filtri specifici basati sul testo dell'evento
          if (settings.floodAlerts === false && alertType.toLowerCase().includes('flood')) continue;
          if (settings.fireAlerts === false && alertType.toLowerCase().includes('fire')) continue;
      }

      // Schedula la notifica
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `⚠️ ${alert.event || 'Allerta Meteo'}`,
          body: alert.headline || 'Allerta meteo rilevata nella tua zona.',
          data: { alert },
          sound: 'default',
        },
        trigger: null, // Invia immediatamente
      });

      console.log(`[WeatherCheck] Notifica inviata: ${alert.event}`);

      if (!isTest) {
          await AsyncStorage.setItem('lastAlertId', alertId);
      }

      notificationSent = true;
      break; // Invia solo la prima allerta rilevante per evitare spam
    }

    return notificationSent
      ? BackgroundFetch.BackgroundFetchResult.NewData
      : BackgroundFetch.BackgroundFetchResult.NoData;

  } catch (error) {
    console.error('[WeatherCheck] Errore:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
};

// Task Manager definition (Global scope)
TaskManager.defineTask(FETCH_TASK_NAME, async () => {
   return checkWeatherAndNotify(false);
});

export const NotificationService = {
  // Registra il task in background
  registerBackgroundTasks: async () => {
    try {
        const isRegistered = await TaskManager.isTaskRegisteredAsync(FETCH_TASK_NAME);
        if (!isRegistered) {
            await BackgroundFetch.registerTaskAsync(FETCH_TASK_NAME, {
                minimumInterval: 60 * 15, // 15 minuti
                stopOnTerminate: false, // Continua anche se l'app è chiusa (su Android richiede permessi background)
                startOnBoot: true,      // Riavvia al boot
            });
            console.log('[NotificationService] Background Task registrato');
        } else {
            console.log('[NotificationService] Background Task già attivo');
        }
    } catch (e) {
        console.error('[NotificationService] Errore registrazione task:', e);
    }
  },

  // Esegue un test immediato
  testNow: async () => {
      console.log('[NotificationService] Esecuzione test manuale...');
      await checkWeatherAndNotify(true);
  }
};
