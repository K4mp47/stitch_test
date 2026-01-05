import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import MapView from 'react-native-maps';

export interface LatLng {
  latitude: number;
  longitude: number;
}

export const useMapLogic = () => {
  const [googleApiKey] = useState<string | undefined>(
    Platform.OS === 'ios'
      ? Constants.expoConfig?.ios?.config?.googleMapsApiKey
      : Constants.expoConfig?.android?.config?.googleMaps?.apiKey
  );
  const [myLocation, setMyLocation] = useState<LatLng | null>(null);
  const [destination, setDestination] = useState<LatLng | null>(null);
  const [snappedPath, setSnappedPath] = useState<LatLng[]>([]);
  const [pathBuffer, setPathBuffer] = useState<LatLng[]>([]);
  const [isRouteVisible, setIsRouteVisible] = useState(false);
  const mapViewRef = useRef<MapView>(null);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const startTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const initialCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setMyLocation(initialCoords);
      mapViewRef.current?.animateToRegion({
        ...initialCoords,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          distanceInterval: 30,
        },
        (newLocation) => {
          const newCoordinate = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          };
          setMyLocation(newCoordinate);
          setPathBuffer((prev) => [...prev, newCoordinate]);
        }
      );
    };

    startTracking();

    return () => {
      locationSubscription?.remove();
    };
  }, []);

  useEffect(() => {
    const snapBuffer = async () => {
      if (pathBuffer.length < 100 || !googleApiKey) {
        return;
      }

      const segmentToSnap = pathBuffer.slice(0, 100);
      const pathString = segmentToSnap
        .map((p) => `${p.latitude},${p.longitude}`)
        .join('|');
      const response = await fetch(
        `https://roads.googleapis.com/v1/snapToRoads?path=${pathString}&interpolate=true&key=${googleApiKey}`
      );
      const data = await response.json();

      if (data.snappedPoints) {
        const snappedSegment = data.snappedPoints.map((point: any) => ({
          latitude: point.location.latitude,
          longitude: point.location.longitude,
        }));
        setSnappedPath((prev) => [...prev, ...snappedSegment]);
        setPathBuffer((prev) => prev.slice(100));
      } else {
        console.warn('Failed to snap path, using raw points for this segment.');
        setSnappedPath((prev) => [...prev, ...segmentToSnap]);
        setPathBuffer((prev) => prev.slice(100));
      }
    };

    snapBuffer();
  }, [pathBuffer, googleApiKey]);

  const onPlaceSelected = useCallback((details: any) => {
    if (!details || !details.geometry || !details.geometry.location) {
      console.warn('Invalid place details received from autocomplete.');
      return;
    }
    const position = {
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
    };
    setDestination(position);
    setIsRouteVisible(false);
    mapViewRef.current?.animateToRegion({
      ...position,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    });
  }, []);

  const traceRoute = useCallback(() => {
    if (myLocation && destination) {
      setIsRouteVisible(true);
    }
  }, [myLocation, destination]);

  return {
    googleApiKey,
    myLocation,
    destination,
    routeCoordinates: [...snappedPath, ...pathBuffer],
    isRouteVisible,
    mapViewRef,
    onPlaceSelected,
    traceRoute,
  };
};
