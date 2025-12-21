import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, Settings } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Animated, { FadeIn, SlideOutRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Colors } from '../../constants/theme';

interface Coordinate {
  latitude: number;
  longitude: number;
}

const MapScreen = () => {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = React.useState(false);
  const inputRef = React.useRef<TextInput | null>(null);
  const [path, setPath] = useState<Coordinate[]>([]);
  const mapRef = useRef<MapView>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const geocodedLocations = await Location.geocodeAsync(searchQuery);
      if (geocodedLocations && geocodedLocations.length > 0) {
        const startLocation = {
          latitude: geocodedLocations[0].latitude,
          longitude: geocodedLocations[0].longitude,
        };
        setPath([startLocation]);
        mapRef.current?.animateToRegion({
          ...startLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } else {
        console.warn('Location not found');
      }
    } catch (error) {
      console.error('Geocoding failed', error);
    }
    setSearchOpen(false);
    inputRef.current?.blur();
  };

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const startLocationTracking = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      if (path.length === 0) {
        let location = await Location.getCurrentPositionAsync({});
        const initialCoordinate = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setPath([initialCoordinate]);
        mapRef.current?.animateToRegion({
          ...initialCoordinate,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 10,
        },
        (newLocation) => {
          const newCoordinate = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          };
          setPath((prevPath) => [...prevPath, newCoordinate]);
          mapRef.current?.animateToRegion(
            {
              ...newCoordinate,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            },
            { duration: 500 }
          );
        }
      );
    };

    startLocationTracking();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View
      style={styles.container}
      entering={FadeIn.duration(250)}
      exiting={SlideOutRight.duration(300)}
    >
      <MapView
        ref={mapRef}
        style={styles.map}
        mapPadding={{ bottom: 16, left: 16, right: 16, top: 116 }}
      >
        <Marker
          coordinate={{
            latitude: 44.4949,
            longitude: 11.3426,
          }}
          onPress={() => router.push('/screens/AlertDetailsScreen')}
        />
        <Polyline
          coordinates={path}
          strokeColor={Colors.light.primary}
          strokeWidth={6}
        />
      </MapView>
      <SafeAreaView style={styles.safeArea} pointerEvents="box-none">
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => {
                if (searchOpen) {
                  inputRef.current?.blur();
                  setSearchOpen(false);
                } else {
                  inputRef.current?.focus();
                  setSearchOpen(true);
                }
              }}
            >
              {!searchOpen ? (
                <Search color={Colors.dark.placeholder} size={24} />
              ) : (
                <ArrowLeft color={Colors.dark.placeholder} size={24} />
              )}
            </TouchableOpacity>
            <TextInput
              ref={inputRef}
              placeholder="Cerca una località..."
              placeholderTextColor={Colors.dark.placeholder}
              style={styles.searchInput}
              onFocus={() => setSearchOpen(true)}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              value={searchQuery}
            />
            <TouchableOpacity style={styles.iconButton} onPress={() => router.navigate('/screens/SettingsScreen')}>
              <Settings color={Colors.dark.placeholder} size={24} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mapBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#00000033',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  iconButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 20,
    color: 'white',
  },
  searchContainer: {
    marginTop: 12,
    marginHorizontal: 16,
    zIndex: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.inputBackground,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 16,
    height: 56,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: Colors.dark.text,
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 16,
  },
  mapControls: {
    position: 'absolute',
    bottom: 250,
    right: 16,
    alignItems: 'flex-end',
  },
  zoomControls: {
    backgroundColor: Colors.dark.inputBackground,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  zoomButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: Colors.dark.border,
  },
  myLocationButton: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  sheetContent: {
    padding: 16,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(211, 47, 47, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertInfo: {
    flex: 1,
    marginLeft: 12,
  },
  alertTitle: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 24,
    color: Colors.dark.text,
  },
  alertLocation: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 14,
    color: Colors.dark.placeholder,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(211, 47, 47, 0.1)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light['alert-high'],
    marginRight: 8,
  },
  statusText: {
    fontFamily: 'SpaceGrotesk-Medium',
    fontSize: 12,
    color: Colors.light['alert-high'],
  },
  alertDescription: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 16,
    color: Colors.dark.placeholder,
    marginVertical: 12,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.lg,
    gap: 8,
  },
  primaryButtonText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 16,
    color: 'white',
  },
  secondaryButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.dark.inputBackground,
    borderRadius: BorderRadius.lg,
  },
});

export default MapScreen;
