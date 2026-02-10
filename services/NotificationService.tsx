import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundTask from 'expo-background-task';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tentativo di caricamento sicuro di expo-notifications per evitare crash su Expo Go Android SDK 54+
let Notifications: any = null;
try {
  // Usiamo require invece di import per gestire l'errore a runtime ed evitare il blocco all'avvio su Expo Go
  Notifications = require('expo-notifications');
} catch (e) {
  console.warn('[NotificationService] Impossibile caricare expo-notifications:', e);
}

const FETCH_TASK_NAME = 'BACKGROUND_WEATHER_CHECK';
const WEATHER_API_KEY = '03cc585bb4c149c78a2130544260601';

// Configurazione notifiche (foreground) - solo se il modulo è caricato correttamente
if (Notifications && typeof Notifications.setNotificationHandler === 'function') {
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  } catch (e) {
    console.warn('[NotificationService] Errore configurazione handler notifiche:', e);
  }
}

// Funzione principale di controllo meteo
const checkWeatherAndNotify = async (isTest = false): Promise<BackgroundTask.BackgroundTaskResult> => {
  try {
    console.log(`[WeatherCheck] Inizio controllo (Test: ${isTest})`);

    // 1. Carica impostazioni
    const settingsStr = await AsyncStorage.getItem('settings');
    const settings = settingsStr ? JSON.parse(settingsStr) : {};

    // Default enabled
    const notificationsEnabled = settings.notificationsEnabled ?? true;

    if (!notificationsEnabled) {
      console.log('[WeatherCheck] Notifiche disabilitate nelle impostazioni');
      return BackgroundTask.BackgroundTaskResult.Success;
    }

    // 2. Ottieni Posizione
    // Verifica permessi
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('[WeatherCheck] Permesso posizione mancante');
      return BackgroundTask.BackgroundTaskResult.Failed;
    }

    // Prova a ottenere l'ultima posizione nota per velocità
    let location = await Location.getLastKnownPositionAsync({});

    if (!location) {
        try {
            location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        } catch (e) {
            console.log('[WeatherCheck] Errore posizione corrente:', e);
        }
    }

    if (!location) {
        console.log('[WeatherCheck] Posizione non disponibile');
        return BackgroundTask.BackgroundTaskResult.Failed;
    }

    const { latitude, longitude } = location.coords;
    console.log(`[WeatherCheck] Posizione rilevata: ${latitude}, ${longitude}`);

    // 3. Chiama Weather API
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${latitude},${longitude}&days=1&aqi=no&alerts=yes`;

    const response = await fetch(url);
    if (!response.ok) {
        console.error(`[WeatherCheck] API Error: ${response.status}`);
        return BackgroundTask.BackgroundTaskResult.Failed;
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
      return BackgroundTask.BackgroundTaskResult.Success;
    }

    // 4. Invia Notifiche
    let notificationSent = false;
    const lastAlertId = await AsyncStorage.getItem('lastAlertId');

    for (const alert of alerts) {
      const alertId = `${alert.event}-${alert.effective}`;
      const alertType = alert.event ?? '';

      // Filtri
      if (!isTest) {
          if (alertId === lastAlertId) continue;
          if (settings.weatherAlerts === false) continue;
          if (settings.floodAlerts === false && alertType.toLowerCase().includes('flood')) continue;
          if (settings.fireAlerts === false && alertType.toLowerCase().includes('fire')) continue;
      }

      // Schedula la notifica se possibile
      if (Notifications && typeof Notifications.scheduleNotificationAsync === 'function') {
          try {
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
              notificationSent = true;
          } catch (e) {
              console.error('[WeatherCheck] Errore invio notifica:', e);
          }
      } else {
          console.warn('[WeatherCheck] Modulo notifiche non disponibile. Allerta:', alert.event);
      }

      if (!isTest && notificationSent) {
          await AsyncStorage.setItem('lastAlertId', alertId);
      }

      if (notificationSent) break;
    }

    return BackgroundTask.BackgroundTaskResult.Success;

  } catch (error) {
    console.error('[WeatherCheck] Errore:', error);
    return BackgroundTask.BackgroundTaskResult.Failed;
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
            // Migrazione a expo-background-task
            // In Expo Go su Android, questo utilizzerà WorkManager
            await BackgroundTask.registerTaskAsync(FETCH_TASK_NAME, {
                minimumInterval: 15, // 15 minuti (minimo consentito)
            });
            console.log('[NotificationService] Background Task registrato con successo');
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
