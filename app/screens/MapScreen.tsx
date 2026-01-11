import { selectDestination, selectIsSimulationMode, selectOrigin, setDestination, setOrigin, setSimulationMode } from "@/store/slice";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Keyboard, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, { Marker, Polygon } from "react-native-maps";
import { MapViewRoute } from 'react-native-maps-routes';
import Animated, { FadeIn, FadeInDown, FadeOut, SlideInDown, SlideInUp, SlideOutDown, SlideOutRight, SlideOutUp } from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import tw from 'twrnc';
import { Colors } from "../../constants/theme";

// Types
type RouteInfo = {
  distance: string;
  duration: string;
  distanceValue: number;
  durationValue: number;
};

type RideOption = {
  id: string;
  name: string;
  icon: string;
  time: string;
  capacity: string;
};

type RouteStep = {
  instruction: string;
  distance: string;
  duration: string;
  maneuver: string;
  endLocation: {
    latitude: number;
    longitude: number;
  };
};

// Costanti
const NAVIGATION_ZOOM = 18;
const NAVIGATION_PITCH = 60;
const STEP_ADVANCE_DISTANCE = 25; // metri

// Weather Alert Types
type WeatherAlert = {
  alertId: string;
  alertTitle: { text: string };
  eventType: string;
  description: string;
  severity: string;
  urgency: string;
  certainty: string;
  instruction?: string[];
  safetyRecommendations?: { directive: string; subtext?: string }[];
  polygon?: string; // JSON string
  areaName?: string;
  startTime?: string;
  expirationTime?: string;
};

// Helper to parse polygon
// Helper to parse polygon (supports Polygon and MultiPolygon)
const parsePolygon = (polygonString: string): { latitude: number; longitude: number }[][] => {
  try {
    const parsed = JSON.parse(polygonString);
    if (parsed.type === 'Polygon' && parsed.coordinates && parsed.coordinates.length > 0) {
      // Single Polygon: wrap in array
      return [parsed.coordinates[0].map((coord: number[]) => ({
        latitude: coord[1],
        longitude: coord[0],
      }))];
    } else if (parsed.type === 'MultiPolygon' && parsed.coordinates && parsed.coordinates.length > 0) {
      // MultiPolygon: map each polygon
      return parsed.coordinates.map((poly: any[]) =>
        poly[0].map((coord: number[]) => ({
          latitude: coord[1],
          longitude: coord[0],
        }))
      );
    }
  } catch (e) {
    console.error("Error parsing polygon", e);
  }
  return [];
};

// Calculate centroid for marker placement
// Calculate centroid for marker placement (uses the first/largest polygon)
const getPolygonCentroid = (polygons: { latitude: number; longitude: number }[][]) => {
  if (!polygons.length || !polygons[0].length) return null;

  // Use the first polygon for centroid (usually the main area)
  const coords = polygons[0];
  let latSum = 0;
  let lngSum = 0;
  coords.forEach(c => {
    latSum += c.latitude;
    lngSum += c.longitude;
  });
  return {
    latitude: latSum / coords.length,
    longitude: lngSum / coords.length,
  };
};

// Helper functions
const stripHtml = (html: string) => {
  return html.replace(/<[^>]*>?/gm, '');
};

const getManeuverIcon = (maneuver: string): any => {
  const m = maneuver?.toLowerCase();
  if (m?.includes('left')) return 'arrow-undo';
  if (m?.includes('right')) return 'arrow-redo';
  if (m?.includes('uturn')) return 'refresh';
  if (m?.includes('merge')) return 'git-merge';
  if (m?.includes('roundabout')) return 'sync';
  return 'arrow-up';
};

const GoogleBar = () => {
  const dispatch = useDispatch();
  const autocompleteRef = useRef<any>(null);

  return (
    <Animated.View
      style={styles.searchBarContainer}
      entering={SlideInUp.duration(400)}
      exiting={SlideOutUp.duration(400)}
    >
      <GooglePlacesAutocomplete
        ref={autocompleteRef}
        enablePoweredByContainer={false}
        isRowScrollable={false}
        nearbyPlacesAPI="GooglePlacesSearch"
        placeholder=""
        // textInputProps={{
        //   placeholderTextColor: 'rgba(255, 255, 255, 0.44)',
        //   clearButtonMode: 'while-editing',
        // }}
        // query={{
        //   key: 'AIzaSyD5qIn4B8mSjwIAX8aq9_eGAVTbey3q7gg',
        // }}
        renderLeftButton={() => (
          <View style={styles.searchIconContainer}>
            <MaterialIcons name="search" size={24} color="rgba(255, 255, 255, 0.6)" />
          </View>
        )}
        renderRightButton={() => (
          <View style={styles.searchIconContainer}>
            <MaterialIcons name="menu" size={24} color="rgba(255, 255, 255, 0.6)" onPress={() => router.navigate("/screens/SettingsScreen")} />
          </View>
        )}
        textInputProps={{
          placeholderTextColor: 'rgba(255, 255, 255, 0.44)',
          clearButtonMode: 'while-editing',
          selectionColor: Colors.dark.primary,
        }}
        query={{
          key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
        }}
        styles={{
          container: {
            flex: 1,
          },
          textInputContainer: {
            backgroundColor: Colors.dark.background,
            borderRadius: 16,
            paddingHorizontal: 12,
            height: 56,
            elevation: 5,
          },
          textInput: {
            backgroundColor: 'transparent',
            color: "white",
            fontSize: 16,
            fontWeight: '500',
            height: '100%',
            marginLeft: 8,
            paddingRight: 8,
          },
          listView: {
            backgroundColor: Colors.dark.background,
            borderRadius: 16,
            marginTop: 8,
            elevation: 8,
            overflow: 'hidden',
          },
          row: {
            backgroundColor: Colors.dark.background,
            paddingVertical: 16,
            paddingHorizontal: 16,
            minHeight: 56,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(255, 255, 255, 0.05)',
          },
          separator: {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
          description: {
            color: 'white',
            fontSize: 15,
            fontWeight: '500',
          },
          predefinedPlacesDescription: {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          loader: {
            flexDirection: 'row',
            justifyContent: 'center',
            height: 20,
            alignItems: 'center',
          },
        }}
        fetchDetails={true}
        debounce={400}
        onPress={(data, details = null) => {
          Keyboard.dismiss();
          dispatch(setDestination({
            location: details?.geometry?.location,
            description: data.description,
          }));
        }}
      />
    </Animated.View>
  );
};

const DestinationModal = ({
  visible,
  onClose,
  onConfirm,
  destination,
  origin,
  routeInfo,
  isLoadingRoute
}: any) => {
  // Rimuoviamo il check 'if (!visible) return null' qui e lo gestiamo nel genitore
  // per permettere a Reanimated di gestire l'uscita (exiting).

  return (
    <Animated.View
      style={styles.modalContent}
      entering={SlideInDown.duration(300)} // Spring per un effetto più fluido
      exiting={SlideOutDown.duration(300)}
    >
      <View style={styles.modalCard}>
        <View style={styles.modalHeader}>
          <Ionicons name="location-sharp" size={28} color={Colors.dark.primary} />
          <Text style={styles.modalTitle}>Trip Details</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Ionicons name="close" size={24} color="rgba(255,255,255,0.6)" />
          </TouchableOpacity>
        </View>

        <View style={styles.modalBody}>
          {/* ... contenuto invariato ... */}
          <View style={styles.locationItem}>
            <Ionicons name="radio-button-on" size={20} color="#4CAF50" />
            <View style={styles.locationText}>
              <Text style={styles.locationLabel}>From</Text>
              <Text style={styles.locationAddress} numberOfLines={1}>
                {origin?.description || 'Current Location'}
              </Text>
            </View>
          </View>

          <View style={styles.locationDivider} />

          <View style={styles.locationItem}>
            <Ionicons name="location-sharp" size={20} color={Colors.dark.primary} />
            <View style={styles.locationText}>
              <Text style={styles.locationLabel}>To</Text>
              <Text style={styles.locationAddress} numberOfLines={1}>
                {destination?.description}
              </Text>
            </View>
          </View>

          {/* Altezza fissa per il contenitore info per evitare salti durante il caricamento */}
          <View style={styles.routeInfoWrapper}>
            {isLoadingRoute ? (
              <View style={styles.routeInfoLoading}>
                <ActivityIndicator color={Colors.dark.primary} />
                <Text style={styles.routeInfoLoadingText}>Calculating route...</Text>
              </View>
            ) : routeInfo ? (
              <Animated.View
                style={styles.routeInfo}
                entering={FadeInDown}
              >
                <View style={styles.routeInfoItem}>
                  <Ionicons name="time-outline" size={18} color={Colors.dark.primary} />
                  <Text style={styles.routeInfoText}>{routeInfo.duration}</Text>
                </View>
                <View style={styles.routeInfoDivider} />
                <View style={styles.routeInfoItem}>
                  <Ionicons name="navigate-outline" size={18} color={Colors.dark.primary} />
                  <Text style={styles.routeInfoText}>{routeInfo.distance}</Text>
                </View>
              </Animated.View>
            ) : null}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.confirmButton, isLoadingRoute && styles.confirmButtonDisabled]}
          activeOpacity={0.8}
          onPress={onConfirm}
          disabled={isLoadingRoute}
        >
          <Text style={styles.confirmButtonText}>View Ride Options</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const RideOptionsModal = ({
  visible,
  onClose,
  onStartTrip,
  destination,
  origin,
  routeInfo
}: any) => {
  const [selectedRide, setSelectedRide] = useState<string>('car');

  const rideOptions: RideOption[] = [
    {
      id: 'truck',
      name: 'Truck',
      icon: 'bus-outline',
      time: routeInfo?.duration || 'N/A',
      capacity: '1-3 passengers'
    },
    {
      id: 'car',
      name: 'Car',
      icon: 'car-outline',
      time: routeInfo?.duration || 'N/A',
      capacity: '1-4 passengers'
    },
    {
      id: 'bicycle',
      name: 'Bicycle',
      icon: 'bicycle-outline',
      time: routeInfo?.duration || 'N/A',
      capacity: '1-2 passengers'
    },
  ];

  if (!visible) return null;

  return (
    <Animated.View
      style={styles.modalContent}
      entering={SlideInDown.duration(300)}
      exiting={SlideOutDown.duration(300)}
    >
      <View style={styles.modalCard}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { marginLeft: 16 }]}>Choose a ride</Text>
        </View>

        <ScrollView
          style={styles.rideOptionsContainer}
          showsVerticalScrollIndicator={false}
        >
          {rideOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.rideOption,
                selectedRide === option.id && styles.rideOptionSelected
              ]}
              onPress={() => setSelectedRide(option.id)}
              activeOpacity={0.7}
            >
              <View style={styles.rideOptionLeft}>
                <View style={[
                  styles.rideIconContainer,
                  selectedRide === option.id && styles.rideIconContainerSelected
                ]}>
                  <Ionicons
                    name={option.icon as any}
                    size={24}
                    color={selectedRide === option.id ? Colors.dark.primary : 'white'}
                  />
                </View>
                <View style={styles.rideDetails}>
                  <Text style={styles.rideName}>{option.name}</Text>
                  <Text style={styles.rideTime}>{option.time} away</Text>
                  <Text style={styles.rideCapacity}>{option.capacity}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.startTripButton}
          activeOpacity={0.8}
          onPress={() => onStartTrip(selectedRide)}
        >
          <Text style={styles.startTripButtonText}>
            Start with {rideOptions.find(r => r.id === selectedRide)?.name}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const NavigationModal = ({
  visible,
  onClose,
  onEndTrip,
  routeInfo,
  routeSteps = [],
  currentStepIndex,
}: any) => {
  if (!visible) return null;

  const currentStep = routeSteps[currentStepIndex];
  const nextStep = routeSteps[currentStepIndex + 1];

  return (
    <Animated.View
      style={styles.navigationOverlay}
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
    >
      <Animated.View
        style={styles.navigationCard}
        entering={SlideInDown.duration(300)}
      >
        <View style={styles.navigationHeader}>
          <View style={styles.navigationTimeContainer}>
            <Text style={styles.navigationTime}>{routeInfo?.duration || '--'}</Text>
            <Text style={styles.navigationDistance}>({routeInfo?.distance || '--'})</Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            style={styles.navigationCloseButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.navigationInstruction}>
          <View style={styles.navigationIconContainer}>
            <Ionicons
              name={currentStep ? getManeuverIcon(currentStep.maneuver) : 'navigate'}
              size={32}
              color={Colors.dark.primary}
            />
          </View>
          <View style={styles.navigationTextContainer}>
            <Text style={styles.navigationStep} numberOfLines={2}>
              {currentStep ? stripHtml(currentStep.instruction) : "Proceed to route"}
            </Text>
            {nextStep && (
              <Text style={styles.navigationSubtext} numberOfLines={1}>
                Then: {stripHtml(nextStep.instruction)}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.navigationProgress}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((currentStepIndex + 1) / Math.max(routeSteps.length, 1)) * 100}%` }
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            Step {currentStepIndex + 1} of {routeSteps.length}
          </Text>
        </View>
      </Animated.View>

      <Animated.View
        style={styles.navigationBottomPanel}
        entering={SlideInDown.delay(100).duration(300)}
      >
        {/* <View style={styles.navigationControls}>
          <TouchableOpacity style={styles.navigationControlButton}>
            <Ionicons name="volume-high" size={24} color="white" />
            <Text style={styles.navigationControlText}>Mute</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navigationControlButton}>
            <Ionicons name="call-outline" size={24} color="white" />
            <Text style={styles.navigationControlText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navigationControlButton}>
            <Ionicons name="share-outline" size={24} color="white" />
            <Text style={styles.navigationControlText}>Share</Text>
          </TouchableOpacity>
        </View> */}

        <TouchableOpacity
          style={styles.endTripButton}
          onPress={onEndTrip}
          activeOpacity={0.8}
        >
          <Ionicons name="stop-circle" size={20} color="white" style={{ marginRight: 8 }} />
          <Text style={styles.endTripButtonText}>End Trip</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

const WeatherOverlay = React.memo(({ weatherAlerts, origin, onMarkerPress, isSimulationMode }: { weatherAlerts: WeatherAlert[], origin: any, onMarkerPress: (alerts: WeatherAlert[]) => void, isSimulationMode?: boolean }) => {

  // Group alerts by coordinate
  const groupedAlerts = React.useMemo(() => {
    const groups: { [key: string]: { coordinate: any, alerts: WeatherAlert[] } } = {};
    weatherAlerts.forEach(alert => {
      const polygons = alert.polygon ? parsePolygon(alert.polygon) : [];
      let markerCoord;
      if (polygons.length > 0) {
        markerCoord = getPolygonCentroid(polygons); // Now handles Coordinate[][]
      } else if (origin?.location) {
        markerCoord = { latitude: origin.location.lat, longitude: origin.location.lng };
      }
      if (markerCoord) {
        const key = `${markerCoord.latitude.toFixed(4)},${markerCoord.longitude.toFixed(4)}`;
        if (!groups[key]) {
          groups[key] = { coordinate: markerCoord, alerts: [] };
        }
        groups[key].alerts.push(alert);
      }
    });
    return Object.values(groups);
  }, [weatherAlerts, origin]);

  return (
    <>
      {/* Polygons Layer */}
      {weatherAlerts.map((alert) => {
        const polygons = alert.polygon ? parsePolygon(alert.polygon) : [];
        if (polygons.length === 0) return null;

        return polygons.map((polyCoords, index) => (
          <Polygon
            key={`poly-${alert.alertId}-${index}`}
            coordinates={polyCoords}
            fillColor="rgba(255, 59, 48, 0.3)"
            strokeColor="rgba(255, 59, 48, 0.8)"
            strokeWidth={2}
          />
        ));
      })}

      {/* Markers Layer - Render grouped markers */}
      {groupedAlerts.map((group, index) => (
        <Marker
          key={`group-${index}`}
          coordinate={group.coordinate}
          onPress={() => onMarkerPress(group.alerts)}
        >
          <View style={{
            backgroundColor: '#FF3B30',
            borderRadius: 20,
            padding: 8,
            borderWidth: 2,
            borderColor: 'white',
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4
          }}>
            <Ionicons name="warning" size={20} color="white" />
            {group.alerts.length > 1 && (
              <View style={{
                backgroundColor: 'white',
                borderRadius: 10,
                width: 20,
                height: 20,
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Text style={{ color: '#FF3B30', fontSize: 12, fontWeight: 'bold' }}>
                  {group.alerts.length}
                </Text>
              </View>
            )}
          </View>
        </Marker>
      ))}

      {/* Safe Area Marker (Simulation Mode Only) */}
      {isSimulationMode && weatherAlerts.length === 0 && origin?.location && (
        <Marker
          key="safe-area-marker"
          coordinate={{ latitude: origin.location.lat, longitude: origin.location.lng }}
          title="Safe Area"
          onPress={() => onMarkerPress([{
            alertId: 'safe-001',
            alertTitle: { text: "No Alerts Detected" },
            startTime: new Date().toISOString(),
            expirationTime: new Date().toISOString(),
            eventType: "Safe",
            severity: "Safe",
            urgency: "Safe",
            certainty: "Verified",
            areaName: origin.description || "Selected Location",
            polygon: "", // No polygon
            description: "No weather or security alerts detected in this area. Conditions are normal.",
            instruction: ["Enjoy your day! No risks reported."],
            safetyRecommendations: [{ directive: "No special precautions needed." }]
          }])}
        >
          <View style={{
            backgroundColor: '#34C759', // System Green
            borderRadius: 20,
            padding: 8,
            borderWidth: 2,
            borderColor: 'white',
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}>
            <Ionicons name="checkmark-circle" size={20} color="white" />
          </View>
        </Marker>
      )}
    </>
  );
});

const MapContent = ({
  mapPaddingBottom = 120,
  isNavigating = false,
  routeSteps = [],
  currentStepIndex = 0,
  onStepAdvance,
}: {
  mapPaddingBottom?: number,
  isNavigating?: boolean,
  routeSteps?: RouteStep[],
  currentStepIndex?: number,
  onStepAdvance?: () => void,
}) => {
  const dispatch = useDispatch();
  const destination = useSelector(selectDestination);
  const origin = useSelector(selectOrigin);
  const mapViewRef = useRef<MapView>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [userHeading, setUserHeading] = useState(0);

  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

  const isSimulationMode = useSelector(selectIsSimulationMode);

  // Effect per il tracking della posizione
  useEffect(() => {
    let isMounted = true;

    const startTracking = async () => {
      // Se in modalità simulazione, non tracciamo la posizione GPS reale
      if (isSimulationMode) return;

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (!isMounted || status !== 'granted') return;

      if (locationSubscription.current) {
        locationSubscription.current.remove();
        locationSubscription.current = null;
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 5,
        },
        (location) => {
          if (!isMounted || isSimulationMode) return; // Doppio controllo
          const { latitude, longitude, heading } = location.coords;

          setUserHeading(heading || 0);

          // Aggiorna Redux solo se la posizione è cambiata significativamente
          dispatch(setOrigin({
            location: { lat: latitude, lng: longitude },
            description: 'Current Location',
          }));

          // ... animation logic ...
          if (isMapReady && mapViewRef.current) {
            // ... (keep existing animation logic) ...
            if (isNavigating) {
              // Modalità navigazione con camera 3D
              mapViewRef.current.animateCamera({
                center: { latitude, longitude },
                pitch: NAVIGATION_PITCH,
                heading: heading || 0,
                altitude: 50,
                zoom: NAVIGATION_ZOOM,
              }, { duration: 1000 });

              // Controllo avanzamento step
              if (routeSteps.length > 0 && currentStepIndex < routeSteps.length) {
                const currentStep = routeSteps[currentStepIndex];

                if (currentStep?.endLocation) {
                  const distance = getDistance(
                    { latitude, longitude },
                    currentStep.endLocation
                  );

                  if (distance < STEP_ADVANCE_DISTANCE && onStepAdvance) {
                    onStepAdvance();
                  }
                }
              }
            } else if (!destination) {
              // Modalità standard (non in navigazione) - solo se non c'è destinazione
              mapViewRef.current.animateToRegion({
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }, 1000);
            }
          }
        }
      );

      if (isMounted) {
        locationSubscription.current = subscription;
      } else {
        subscription.remove();
      }
    };

    if (isMapReady) {
      startTracking();
    }

    return () => {
      isMounted = false;
      if (locationSubscription.current) {
        locationSubscription.current.remove();
        locationSubscription.current = null;
      }
    };
  }, [dispatch, isMapReady, isNavigating, isSimulationMode]); // Added isSimulationMode

  // Effetto separato per step advancement (evita ri-creazione del subscription)
  useEffect(() => {
    // Questo effect serve solo per logging o azioni collaterali
    // La logica di avanzamento è già nel watchPositionAsync
  }, [currentStepIndex]);

  // Effetto per fit to coordinates quando si imposta la destinazione
  useEffect(() => {
    if (!isMapReady || !origin || !destination || !mapViewRef.current || isNavigating) return;

    const timer = setTimeout(() => {
      mapViewRef.current?.fitToSuppliedMarkers(
        ['Origin', 'Destination'],
        {
          edgePadding: { top: 150, right: 80, bottom: mapPaddingBottom + 50, left: 80 },
          animated: true,
        }
      );
    }, 500); // Aumentato a 500ms per evitare conflitti

    return () => clearTimeout(timer);
  }, [destination, origin, isMapReady, mapPaddingBottom, isNavigating]);

  // Effect to move camera when in simulation mode and origin changes
  useEffect(() => {
    if (isSimulationMode && origin?.location && isMapReady && mapViewRef.current) {
      mapViewRef.current.animateToRegion({
        latitude: origin.location.lat,
        longitude: origin.location.lng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }, 1000);
    }
  }, [origin, isSimulationMode, isMapReady]);

  // Inside MapContent
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);
  const lastFetchLocation = useRef<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      if (!origin?.location) return;

      // Note: In simulation mode we DO want to fetch real data now (per user request),
      // so we removed the mock injection block. We just treat the simulated origin as the real one.

      // Simple distance check to avoid refetching too often (e.g., 5km)
      // We skip this check if we just switched to simulation mode (to ensure immediate fetch for new location)
      if (lastFetchLocation.current && !isSimulationMode) {
        const dist = getDistance(
          { latitude: lastFetchLocation.current.lat, longitude: lastFetchLocation.current.lng },
          { latitude: origin.location.lat, longitude: origin.location.lng }
        );
        if (dist < 5000) return; // Skip if moved less than 5km
      }

      try {
        const lat = origin.location.lat;
        const lng = origin.location.lng;
        // We'll use the user's current location to lookup alerts.
        const response = await fetch(
          `https://weather.googleapis.com/v1/publicAlerts:lookup?key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}&location.latitude=${lat}&location.longitude=${lng}&languageCode=en`
        );
        const data = await response.json();

        if (data.weatherAlerts) {
          setWeatherAlerts(data.weatherAlerts);
        } else {
          setWeatherAlerts([]); // Clear alerts if none found
        }
        lastFetchLocation.current = { lat, lng };

      } catch (error) {
        console.error("Failed to fetch weather alerts", error);
      }
    };

    if (origin?.location) {
      fetchAlerts();
    }
  }, [origin?.location, isSimulationMode]);


  return (
    <>
      <MapView
        ref={mapViewRef}
        mapPadding={{ top: isNavigating ? 160 : 140, left: 16, right: 16, bottom: mapPaddingBottom }}
        style={tw`flex-1 w-full`}
        showsUserLocation={!isNavigating}
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={false}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onMapReady={() => setIsMapReady(true)}
      >
        {/* Marker personalizzato "Freccia Navigazione" */}
        {isNavigating && origin?.location && (
          <Marker
            key="nav-arrow"
            coordinate={{
              latitude: origin.location.lat,
              longitude: origin.location.lng,
            }}
            anchor={{ x: 0.5, y: 0.5 }}
            flat={true}
            rotation={userHeading}
          >
            <View style={{
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <View style={{
                backgroundColor: 'white',
                borderRadius: 20,
                padding: 5,
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
              }}>
                <Ionicons name="navigate" size={24} color={Colors.dark.primary} />
              </View>
            </View>
          </Marker>
        )}

        {destination?.location && (
          <Marker
            key="dest-marker"
            coordinate={{
              latitude: destination.location.lat,
              longitude: destination.location.lng,
            }}
            title="Destination"
            description={destination.description}
            identifier="Destination"
            pinColor="red"
          />
        )}

        {!isNavigating && origin?.location && (
          <Marker
            key="origin-marker"
            coordinate={{
              latitude: origin.location.lat,
              longitude: origin.location.lng,
            }}
            title="Origin"
            description={origin.description}
            identifier="Origin"
            opacity={0}
          />
        )}

        {origin && destination && (
          <MapViewRoute
            origin={{
              latitude: origin.location.lat,
              longitude: origin.location.lng,
            }}
            destination={{
              latitude: destination.location.lat,
              longitude: destination.location.lng,
            }}
            apiKey={process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY!}
            strokeWidth={5}
            strokeColor={Colors.dark.primary}
            onError={(e) => console.log('Route error:', e)}
          />
        )}

        {/* Weather Alerts Layer - Stabilized with Memoized Component */}
        <WeatherOverlay
          weatherAlerts={weatherAlerts}
          origin={origin}
          isSimulationMode={isSimulationMode}
          onMarkerPress={(alert) => router.push({
            pathname: '/screens/AlertDetailsScreen',
            params: { alertData: JSON.stringify(alert) }
          })}
        />

      </MapView>

      {/* Exit Simulation Button - MOVED OUTSIDE MAPVIEW */}
      {
        isSimulationMode && (
          <View style={{
            position: 'absolute',
            top: 60,
            left: 0,
            right: 0,
            alignItems: 'center',
            zIndex: 999,
          }}>
            <TouchableOpacity
              onPress={() => {
                dispatch(setSimulationMode(false));
                // Manually restart tracking will happen via effect dependency
                setWeatherAlerts([]);
                alert("Simulazione terminata. Ritorno alla posizione GPS.");
              }}
              style={{
                backgroundColor: '#FF3B30',
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 20,
                flexDirection: 'row',
                alignItems: 'center',
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
              }}
            >
              <Ionicons name="warning" size={20} color="white" style={{ marginRight: 8 }} />
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Esci dalla Simulazione</Text>
            </TouchableOpacity>
          </View>
        )
      }
    </>
  );
};

// Helper function per calcolare la distanza
const getDistance = (
  coord1: { latitude: number; longitude: number },
  coord2: { latitude: number; longitude: number }
): number => {
  const R = 6371e3; // Raggio della Terra in metri
  const φ1 = (coord1.latitude * Math.PI) / 180;
  const φ2 = (coord2.latitude * Math.PI) / 180;
  const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distanza in metri
};

const MapScreen = () => {
  const destination = useSelector(selectDestination);
  const origin = useSelector(selectOrigin);
  const dispatch = useDispatch();

  const [showRideOptions, setShowRideOptions] = useState(false);
  const [showNavigation, setShowNavigation] = useState(false);
  const [selectedRideType, setSelectedRideType] = useState<string>('');
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [routeSteps, setRouteSteps] = useState<RouteStep[]>([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Ref per evitare chiamate multiple
  const isFetchingRoute = useRef(false);
  const lastDestinationRef = useRef<any>(null);

  // Effect per calcolare il percorso
  useEffect(() => {
    if (!origin || !destination || isFetchingRoute.current) return;

    // Reset route info se la destinazione è cambiata
    if (lastDestinationRef.current !== destination?.description) {
      setRouteInfo(null);
      setRouteSteps([]);
      setCurrentStepIndex(0);
      setIsLoadingRoute(true);
    }

    lastDestinationRef.current = destination?.description;

    const fetchRoute = async () => {
      try {
        isFetchingRoute.current = true;

        const response = await fetch(
          "https://routes.googleapis.com/directions/v2:computeRoutes",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY!,
              "X-Goog-FieldMask":
                "routes.distanceMeters,routes.duration,routes.legs.steps.navigationInstruction,routes.legs.steps.distanceMeters,routes.legs.steps.staticDuration,routes.legs.steps.endLocation",
            },
            body: JSON.stringify({
              origin: {
                location: {
                  latLng: {
                    latitude: origin.location.lat,
                    longitude: origin.location.lng,
                  },
                },
              },
              destination: {
                location: {
                  latLng: {
                    latitude: destination.location.lat,
                    longitude: destination.location.lng,
                  },
                },
              },
              travelMode: "DRIVE",
              routingPreference: "TRAFFIC_AWARE",
              units: "METRIC",
            }),
          }
        );

        const data = await response.json();
        const route = data.routes?.[0];

        if (!route) return;

        const distanceKm = route.distanceMeters / 1000;
        const durationMinutes = Math.round(
          parseInt(route.duration.replace("s", "")) / 60
        );

        setRouteInfo({
          distance: `${distanceKm.toFixed(1)} km`,
          duration: `${durationMinutes} min`,
          distanceValue: distanceKm,
          durationValue: durationMinutes,
        });

        if (route.legs && route.legs[0]?.steps) {
          const steps: RouteStep[] = route.legs[0].steps.map((step: any) => ({
            instruction: step.navigationInstruction?.instructions || "Continue",
            maneuver: step.navigationInstruction?.maneuver || "STRAIGHT",
            distance: `${(step.distanceMeters / 1000).toFixed(1)} km`,
            duration: step.staticDuration,
            endLocation: {
              latitude: step.endLocation.latLng.latitude,
              longitude: step.endLocation.latLng.longitude,
            },
          }));

          setRouteSteps(steps);
        }

      } catch (error) {
        console.error("Route calculation failed:", error);
      } finally {
        setIsLoadingRoute(false);
        isFetchingRoute.current = false;
      }
    };

    fetchRoute();
  }, [destination, origin]);

  const handleCloseDestinationModal = () => {
    dispatch(setDestination(null));
    setRouteInfo(null);
    setRouteSteps([]);
    setShowRideOptions(false);
    setShowNavigation(false);
    setCurrentStepIndex(0);
    setIsLoadingRoute(false);
    setSelectedRideType('');
    isFetchingRoute.current = false;
    lastDestinationRef.current = null;
  };

  const handleConfirmDestination = () => {
    setShowRideOptions(true);
  };

  const handleBackToDestination = () => {
    setShowRideOptions(false);
  };

  const handleStartTrip = (rideType: string) => {
    setSelectedRideType(rideType);
    setShowRideOptions(false);
    setShowNavigation(true);
    setCurrentStepIndex(0);
  };

  const handleEndTrip = () => {
    setShowNavigation(false);
    setCurrentStepIndex(0);
    handleCloseDestinationModal();
  };

  const handleStepAdvance = () => {
    setCurrentStepIndex(prev => {
      const nextIndex = Math.min(prev + 1, routeSteps.length - 1);
      console.log(`Advanced to step ${nextIndex + 1}/${routeSteps.length}`);
      return nextIndex;
    });
  };

  const getMapPadding = () => {
    if (showNavigation) return 250;
    if (showRideOptions) return 400;
    if (destination) return 320;
    return 120;
  };

  return (
    <Animated.View
      style={styles.container}
      entering={FadeIn.duration(250)}
      exiting={SlideOutRight.duration(300)}
    >
      {!destination && <GoogleBar />}

      <MapContent
        mapPaddingBottom={getMapPadding()}
        isNavigating={showNavigation}
        routeSteps={routeSteps}
        currentStepIndex={currentStepIndex}
        onStepAdvance={handleStepAdvance}
      />

      {/* Usa una chiave unica basata sulla destinazione per forzare il re-mount */}
      {!showRideOptions && !showNavigation && destination && (
        <DestinationModal
          key={`destination-modal-${destination?.description || 'none'}`}
          visible={true}
          onClose={handleCloseDestinationModal}
          onConfirm={handleConfirmDestination}
          destination={destination}
          origin={origin}
          routeInfo={routeInfo}
          isLoadingRoute={isLoadingRoute}
        />
      )}

      {showRideOptions && !showNavigation && (
        <RideOptionsModal
          key={`ride-options-${showRideOptions}`}
          visible={showRideOptions}
          onClose={handleBackToDestination}
          onStartTrip={handleStartTrip}
          destination={destination}
          origin={origin}
          routeInfo={routeInfo}
        />
      )}

      {showNavigation && (
        <NavigationModal
          key={`navigation-${showNavigation}`}
          visible={showNavigation}
          onClose={() => setShowNavigation(false)}
          onEndTrip={handleEndTrip}
          destination={destination}
          routeInfo={routeInfo}
          rideType={selectedRideType}
          routeSteps={routeSteps}
          currentStepIndex={currentStepIndex}
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  searchBarContainer: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    zIndex: 10,
    elevation: 8,
  },
  searchIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: 32,
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  modalCard: {
    backgroundColor: Colors.dark.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 24,
    elevation: 10,
  },
  routeInfoWrapper: {
    height: 60, // Altezza fissa per contenere il caricamento o i dati
    justifyContent: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginLeft: 12,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    marginBottom: 24,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  locationText: {
    marginLeft: 12,
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  locationDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginLeft: 32,
  },
  routeInfo: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeInfoText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  routeInfoDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 20,
  },
  routeInfoLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 12,
  },
  routeInfoLoadingText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
  confirmButton: {
    backgroundColor: Colors.dark.primary,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  rideOptionsContainer: {
    maxHeight: 280,
    marginBottom: 16,
  },
  rideOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  rideOptionSelected: {
    borderColor: Colors.dark.primary,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  rideOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rideIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  rideIconContainerSelected: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  rideDetails: {
    flex: 1,
  },
  rideName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  rideTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginBottom: 2,
  },
  rideCapacity: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
  },
  startTripButton: {
    backgroundColor: Colors.dark.primary,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startTripButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  navigationOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 3,
  },
  navigationCard: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    backgroundColor: Colors.dark.background,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  navigationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navigationTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navigationTime: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
  },
  navigationDistance: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
    marginLeft: 8,
  },
  navigationCloseButton: {
    padding: 4,
  },
  navigationInstruction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navigationIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  navigationTextContainer: {
    flex: 1,
  },
  navigationStep: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  navigationSubtext: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
  navigationProgress: {
    marginTop: 20,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.dark.primary,
  },
  progressText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginTop: 8,
  },
  navigationBottomPanel: {
    position: 'absolute',
    bottom: 30,
    left: 16,
    right: 16,
    backgroundColor: Colors.dark.background,
    borderRadius: 20,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  navigationControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  navigationControlButton: {
    alignItems: 'center',
  },
  navigationControlText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
  endTripButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.9)',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  endTripButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default MapScreen;

