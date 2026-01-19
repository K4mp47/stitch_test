import { useLocalSearchParams, useRouter } from 'expo-router';
import { TrafficCone, TriangleAlert } from 'lucide-react-native';
import React, { useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Colors } from '../../constants/theme';

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

const AlertDetailsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const alerts = useMemo(() => {
    if (typeof params.alertData === 'string') {
      try {
        const parsed = JSON.parse(params.alertData);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        return [];
      }
    }
    return [];
  }, [params.alertData]);

  const alert = alerts[currentIndex] || null;

  if (!alert) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const polygons = alert.polygon ? parsePolygon(alert.polygon) : [];
  // Use first polygon for initial region
  const initialRegion = polygons.length > 0 && polygons[0].length > 0 ? {
    latitude: polygons[0][0].latitude,
    longitude: polygons[0][0].longitude,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  } : {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 10,
    longitudeDelta: 10,
  };

  const severityColor = alert.severity === 'SEVERE' ? Colors.light['alert-high'] :
    alert.severity === 'MODERATE' ? Colors.light['alert-medium'] : Colors.light.primary;

  const handleNext = () => {
    if (currentIndex < alerts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <TriangleAlert size={24} color={Colors.dark.text} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.title} numberOfLines={1}>{alert.eventType || 'Weather Alert'}</Text>
          {alerts.length > 1 && (
            <Text style={styles.paginationText}>Alert {currentIndex + 1} of {alerts.length}</Text>
          )}
        </View>
        <View style={{ width: 48 }} />
      </View>
      <ScrollView>
        <View style={styles.chipsContainer}>
          <View style={[styles.chip, { backgroundColor: severityColor }]}>
            <Text style={styles.chipText}>{alert.severity || 'Unknown Severity'}</Text>
          </View>
          <View style={[styles.chip, { backgroundColor: 'rgba(96, 122, 251, 0.2)' }]}>
            <Text style={[styles.chipText, { color: Colors.dark.text }]} numberOfLines={1}>
              {alert.areaName || 'Unknown Location'}
            </Text>
          </View>
        </View>

        <View style={styles.mapContainer}>
          <MapView
            key={`map-${alert.alertId}`} // Force re-render on alert change
            style={styles.mapImage}
            initialRegion={initialRegion}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
          >
            {polygons.map((polyCoords, index) => (
              <Polygon
                key={`poly-${index}`}
                coordinates={polyCoords}
                fillColor="rgba(255, 59, 48, 0.3)"
                strokeColor="rgba(255, 59, 48, 0.8)"
                strokeWidth={2}
              />
            ))}
            {polygons.length > 0 && polygons[0].length > 0 && (
              <Marker coordinate={polygons[0][0]} />
            )}
          </MapView>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{alert.alertTitle?.text || 'Alert'}</Text>
          <Text style={styles.timestamp}>
            Started: {alert.startTime ? new Date(alert.startTime).toLocaleString() : 'N/A'}
          </Text>
          <Text style={styles.timestamp}>
            Expires: {alert.expirationTime ? new Date(alert.expirationTime).toLocaleString() : 'N/A'}
          </Text>
          <Text style={styles.description}>
            {alert.description}
          </Text>
        </View>

        {alert.safetyRecommendations && alert.safetyRecommendations.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Safety Recommendations</Text>
            <View style={styles.safetyAdviceContainer}>
              {alert.safetyRecommendations.map((rec: any, index: number) => (
                <View key={index} style={styles.adviceRow}>
                  <View style={styles.adviceIcon}>
                    <TriangleAlert size={24} color={Colors.light['alert-medium']} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.adviceText, { fontWeight: 'bold' }]}>{rec.directive}</Text>
                    {rec.subtext && <Text style={styles.adviceText}>{rec.subtext}</Text>}
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Fallback instructions if no explicit recommendations but instructions exist */}
        {(!alert.safetyRecommendations || alert.safetyRecommendations.length === 0) && alert.instruction && (
          <>
            <Text style={styles.sectionTitle}>Instructions</Text>
            <View style={styles.safetyAdviceContainer}>
              {alert.instruction.map((inst: string, index: number) => (
                <View key={index} style={styles.adviceRow}>
                  <View style={styles.adviceIcon}>
                    <TrafficCone size={24} color={Colors.light['alert-medium']} />
                  </View>
                  <Text style={styles.adviceText}>{inst}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {/* Footer with Navigation Buttons */}
      <View style={styles.footer}>
        {alerts.length > 1 ? (
          <View style={styles.navigationButtons}>
            <TouchableOpacity
              style={[styles.navButton, currentIndex === 0 && styles.disabledButton]}
              onPress={handlePrev}
              disabled={currentIndex === 0}
            >
              <Text style={styles.navButtonText}>Previous</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButtonBottom} onPress={() => router.back()}>
              <Text style={styles.backButtonText}>Close</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navButton, currentIndex === alerts.length - 1 && styles.disabledButton]}
              onPress={handleNext}
              disabled={currentIndex === alerts.length - 1}
            >
              <Text style={styles.navButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.ctaButton} onPress={() => router.back()}>
            <Text style={styles.ctaButtonText}>Back to Map</Text>
          </TouchableOpacity>
        )}
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
  },
  iconButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 20,
    color: Colors.dark.text,
    textAlign: 'center',
  },
  paginationText: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 12,
    color: Colors.dark.placeholder,
    marginTop: 2,
  },
  chipsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    flexWrap: 'wrap',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    marginBottom: 4,
  },
  chipText: {
    color: 'white',
    fontFamily: 'SpaceGrotesk-Medium',
    marginLeft: 4,
  },
  mapContainer: {
    margin: 16,
    height: 200,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    borderRadius: BorderRadius.lg,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BorderRadius.xl,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 18,
    color: Colors.dark.text,
    marginBottom: 8,
  },
  timestamp: {
    fontFamily: 'SpaceGrotesk-Regular',
    color: Colors.dark.placeholder,
    marginVertical: 2,
    fontSize: 12,
  },
  description: {
    fontFamily: 'SpaceGrotesk-Regular',
    color: Colors.dark.text,
    marginTop: 8,
    lineHeight: 20,
  },
  sectionTitle: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 18,
    color: Colors.dark.text,
    marginHorizontal: 16,
    marginBottom: 8,
    marginTop: 8,
  },
  safetyAdviceContainer: {
    marginHorizontal: 16,
    gap: 8,
    marginBottom: 20,
  },
  adviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BorderRadius.xl,
    padding: 16,
  },
  adviceIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(96, 122, 251, 0.2)',
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  adviceText: {
    flex: 1,
    fontFamily: 'SpaceGrotesk-Medium',
    color: Colors.dark.text,
    flexWrap: 'wrap',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: Colors.dark.border,
    backgroundColor: Colors.dark.background,
  },
  ctaButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    height: 56,
    borderRadius: BorderRadius.xl,
    gap: 8,
  },
  ctaButtonText: {
    color: 'white',
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 18,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.lg,
    marginHorizontal: 8,
  },
  disabledButton: {
    backgroundColor: '#555',
    opacity: 0.5,
  },
  navButtonText: {
    color: 'white',
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 16,
  },
  backButtonBottom: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#666',
    borderRadius: BorderRadius.lg,
  },
  backButtonText: {
    color: Colors.dark.text,
    fontFamily: 'SpaceGrotesk-Medium',
  }
});

export default AlertDetailsScreen;
