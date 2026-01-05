import { useRouter } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Animated, { FadeIn, SlideOutRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapSearchBar from '../../components/MapSearchBar';
import RouteCalculationButton from '../../components/RouteCalculationButton';
import { Colors } from '../../constants/theme';
import { useMapLogic } from '../../hooks/useMapLogic';

const MapScreen = () => {
  const router = useRouter();
  const {
    googleApiKey,
    myLocation,
    destination,
    routeCoordinates,
    isRouteVisible,
    mapViewRef,
    onPlaceSelected,
    traceRoute,
  } = useMapLogic();

  if (!googleApiKey) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          Google API key is missing. Please configure it in app.json to use the map.
        </Text>
      </View>
    );
  }

  return (
    <Animated.View
      style={styles.container}
      entering={FadeIn.duration(250)}
      exiting={SlideOutRight.duration(300)}
    >
      <MapView
        ref={mapViewRef}
        style={styles.map}
        mapPadding={{ bottom: 16, left: 16, right: 16, top: 116 }}
        showsUserLocation
        followsUserLocation
        showsMyLocationButton
      >
        {!isRouteVisible && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor={Colors.light.primary}
            strokeWidth={6}
          />
        )}
        {destination && <Marker coordinate={destination} />}
        {myLocation && destination && isRouteVisible && (
          <MapViewDirections
            origin={myLocation}
            destination={destination}
            apikey={googleApiKey}
            strokeColor={Colors.light.primary}
            strokeWidth={6}
          />
        )}
      </MapView>
      <SafeAreaView style={styles.safeArea} pointerEvents="box-none">
        <MapSearchBar
          googleApiKey={googleApiKey}
          onPlaceSelected={onPlaceSelected}
          onSettingsPress={() => router.navigate('/screens/SettingsScreen')}
        />
        {destination && <RouteCalculationButton onPress={traceRoute} />}
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 20,
    color: 'white',
  },
});

export default MapScreen;
