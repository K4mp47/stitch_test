# Classi e Metodi dell'Applicazione

Questo documento elenca tutte le classi, componenti e servizi utilizzati nell'applicazione, insieme ai loro metodi.

## Indice
1. [Schermate (Screens)](#schermate-screens)
2. [Servizi (Services)](#servizi-services)
3. [Componenti UI](#componenti-ui)
4. [Gestione dello Stato (Redux Store)](#gestione-dello-stato-redux-store)
5. [Hooks Personalizzati](#hooks-personalizzati)
6. [Costanti e Tipi](#costanti-e-tipi)

---

## Schermate (Screens)

### 1. **AlertDetailsScreen** (`app/screens/AlertDetailsScreen.tsx`)
**Descrizione**: Schermata dei dettagli degli avvisi meteorologici

**Funzioni Helper**:
- `parsePolygon(polygonString: string)`: Converte una stringa di coordinate in un array di punti

**Metodi del Componente**:
- `handleNext()`: Naviga all'avviso successivo
- `handlePrev()`: Naviga all'avviso precedente

---

### 2. **MapScreen** (`app/screens/MapScreen.tsx`)
**Descrizione**: Schermata principale della mappa con funzionalità di navigazione

**Funzioni Helper**:
- `parsePolygon(polygonString: string)`: Converte una stringa di coordinate in array
- `getPolygonCentroid(coordinates: Array)`: Calcola il centroide di un poligono
- `stripHtml(html: string)`: Rimuove i tag HTML da una stringa
- `getManeuverIcon(maneuver: string)`: Restituisce l'icona appropriata per una manovra

**Componenti Interni**:
- **GoogleBar**: Componente della barra di ricerca con autocompletamento
- **DestinationModal**: Modale con i dettagli del viaggio
- **RideOptionsModal**: Modale per la selezione delle opzioni di viaggio
- **NavigationModal**: Modale con le istruzioni di navigazione

---

### 3. **OnboardingScreen** (`app/screens/OnboardingScreen.tsx`)
**Descrizione**: Schermata di benvenuto con carosello di funzionalità

**Metodi del Componente**:
- `onViewableItemsChanged`: Callback per tracciare gli elementi visibili nel carosello

---

### 4. **SettingsScreen** (`app/screens/SettingsScreen.tsx`)
**Descrizione**: Schermata delle impostazioni dell'applicazione

**Metodi del Componente**:
- `saveSettings()`: Salva le impostazioni dell'utente in AsyncStorage
- `loadSettings()`: Carica le impostazioni da AsyncStorage
- `handleSimulateAlert()`: Mostra il modale di simulazione posizione
- `handleTestNotification()`: Invia una notifica di test
- `confirmSimulation()`: Conferma la posizione per la simulazione

---

## Servizi (Services)

### 5. **NotificationService** (`app/services/NotificationService.tsx`)
**Descrizione**: Servizio per la gestione delle notifiche e controlli meteo in background

**Funzioni**:
- `checkWeatherAndNotify()`: Controlla le condizioni meteorologiche e invia notifiche quando necessario

**Metodi dell'Oggetto NotificationService**:
- `registerBackgroundTasks()`: Registra i task in background per il fetch periodico
- `testNow()`: Esegue immediatamente un test di notifica

---

## Componenti UI

### 6. **CategoryChips** (`components/CategoryChips.tsx`)
**Descrizione**: Componente per visualizzare chip di categoria in una lista orizzontale scrollabile

---

### 7. **MapSearchBar** (`components/MapSearchBar.tsx`)
**Descrizione**: Barra di ricerca per la mappa (versione mobile)

---

### 8. **MapSearchBar.web** (`components/MapSearchBar.web.tsx`)
**Descrizione**: Barra di ricerca per la mappa (versione web)

---

### 9. **RouteCalculationButton** (`components/RouteCalculationButton.tsx`)
**Descrizione**: Pulsante per calcolare il percorso

**Metodi del Componente**:
- `handlePress()`: Gestisce il tocco del pulsante con animazione

---

### 10. **ThemedText** (`components/themed-text.tsx`)
**Descrizione**: Componente di testo con supporto per temi chiari/scuri

---

### 11. **ThemedView** (`components/themed-view.tsx`)
**Descrizione**: Componente contenitore con supporto per temi chiari/scuri

---

### 12. **HelloWave** (`components/hello-wave.tsx`)
**Descrizione**: Componente animato con emoji che saluta

---

### 13. **ExternalLink** (`components/external-link.tsx`)
**Descrizione**: Componente per link esterni

---

### 14. **HapticTab** (`components/haptic-tab.tsx`)
**Descrizione**: Pulsante tab con feedback aptico

---

### 15. **ParallaxScrollView** (`components/parallax-scroll-view.tsx`)
**Descrizione**: Componente di scroll con effetto parallasse

**Metodi del Componente**:
- `headerAnimatedStyle`: Calcola lo stile animato per l'header

---

### 16. **BottomSheet** (`components/ui/BottomSheet.tsx`)
**Descrizione**: Componente bottom sheet trascinabile

**Metodi del Componente**:
- `gestureHandler`: Gestisce i gesti di trascinamento pan
- `animatedStyle`: Calcola lo stile animato del componente

---

### 17. **Collapsible** (`components/ui/collapsible.tsx`)
**Descrizione**: Componente per contenuti collassabili

---

### 18. **IconSymbol** (`components/ui/icon-symbol.tsx`)
**Descrizione**: Componente per icone simboliche

---

## Gestione dello Stato (Redux Store)

### 19. **store** (`store/store.ts`)
**Descrizione**: Store Redux configurato per la gestione dello stato globale dell'applicazione

---

### 20. **navSlice** (`store/slice.ts`)
**Descrizione**: Slice Redux per la gestione dello stato di navigazione

**Reducers**:
- `setOrigin(state, action)`: Imposta il punto di origine
- `setDestination(state, action)`: Imposta la destinazione
- `setTravelTimeInformation(state, action)`: Imposta le informazioni sul tempo di viaggio
- `setSimulationMode(state, action)`: Attiva/disattiva la modalità simulazione

**Selettori**:
- `selectOrigin(state)`: Seleziona il punto di origine
- `selectDestination(state)`: Seleziona la destinazione
- `selectTravelTimeInformation(state)`: Seleziona le informazioni sul tempo di viaggio
- `selectIsSimulationMode(state)`: Seleziona lo stato della modalità simulazione

---

## Hooks Personalizzati

### 21. **useColorScheme** (`hooks/use-color-scheme.ts`)
**Descrizione**: Hook per determinare il tema corrente (chiaro/scuro)

---

### 22. **useThemeColor** (`hooks/use-theme-color.ts`)
**Descrizione**: Hook per ottenere i colori del tema corrente

**Metodi**:
- `useThemeColor(props, colorName)`: Restituisce il colore appropriato in base al tema attivo

---

## Costanti e Tipi

### 23. **Colors** (`constants/theme.ts`)
**Descrizione**: Oggetto contenente i colori per i temi chiaro e scuro

**Proprietà**:
- `light`: Colori per il tema chiaro
- `dark`: Colori per il tema scuro

---

### 24. **Fonts** (`constants/theme.ts`)
**Descrizione**: Oggetto contenente le configurazioni dei font

**Proprietà**:
- `display`: Font principale per display

---

### 25. **BorderRadius** (`constants/theme.ts`)
**Descrizione**: Oggetto contenente le costanti per i bordi arrotondati

---

### 26. **FakeUser** (`constants/theme.ts`)
**Descrizione**: Oggetto contenente dati utente mock per test e sviluppo

---

### 27. **navState** (`type.ts`)
**Descrizione**: Definizione del tipo TypeScript per lo stato di navigazione

**Proprietà**:
- `origin`: Punto di partenza
- `destination`: Punto di arrivo
- `travelTimeInformation`: Informazioni sul tempo di viaggio
- `isSimulationMode`: Flag per modalità simulazione

---

## Layout e Router

### 28. **RootLayout** (`app/_layout.tsx`)
**Descrizione**: Layout radice dell'applicazione con configurazione di navigazione e font

**Metodi del Componente**:
- `useEffect()`: Registra i task in background all'avvio dell'app

---

### 29. **Home** (`app/index.tsx`)
**Descrizione**: Schermata home che gestisce il routing iniziale

**Metodi del Componente**:
- `useEffect()`: Controlla lo stato di onboarding e reindirizza di conseguenza

---

### 30. **ModalScreen** (`app/modal.tsx`)
**Descrizione**: Schermata modale generica

---

## Riepilogo

L'applicazione è composta da:
- **30+ componenti React** organizzati in schermate, componenti UI e layout
- **1 servizio di notifiche** con supporto per task in background
- **1 store Redux** con 4 reducer e 4 selettori
- **2 hook personalizzati** per la gestione dei temi
- **Funzioni helper** per parsing, calcoli geometrici e formattazione
- **Definizioni di tipi TypeScript** per type safety

Tutte le classi e i metodi sono progettati per creare un'applicazione di allerta meteorologica con funzionalità di navigazione, notifiche push e modalità di simulazione.
