import { useRouter } from 'expo-router';
import { Headset, Map, TrafficCone, TriangleAlert } from 'lucide-react-native';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Colors } from '../../constants/theme';

const AlertDetailsScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
      </View>
      <ScrollView>
        <View style={styles.chipsContainer}>
          <View style={[styles.chip, { backgroundColor: Colors.light['alert-high'] }]}>
           
            <Text style={styles.chipText}>Gravità Alta</Text>
          </View>
          <View style={[styles.chip, { backgroundColor: 'rgba(96, 122, 251, 0.2)' }]}>
            <Text style={[styles.chipText, { color: Colors.dark.text }]}>Bologna, Italia</Text>
          </View>
        </View>
        {/* <ImageBackground
          source={require('../../assets/images/static-map-view.png')}
          style={styles.mapImage}
          borderRadius={BorderRadius.xl}
        /> */}
        <View style={styles.mapContainer}>
         <MapView
          style={styles.mapImage}
          mapPadding={{ bottom: 16, left: 16, right: 16, top: 116 }}
          initialRegion={{
            latitude: 44.4949,
            longitude: 11.3426,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          // Disable all user interactions so the map cannot be moved or zoomed
          scrollEnabled={false}
          zoomEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
        >
          <Marker
          coordinate={{
            latitude: 44.4949,
            longitude: 11.3426,
          }}
        />
        </MapView>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bologna, Zona Nord</Text>
          <Text style={styles.timestamp}>Aggiornato alle 14:30</Text>
          <Text style={styles.description}>
            Le forti piogge hanno causato l&apos;esondazione del fiume Reno, interessando le aree a
            nord della città. Le autorità consigliano di evitare tutti gli spostamenti non
            essenziali.
          </Text>
        </View>
        <Text style={styles.sectionTitle}>Consigli di Sicurezza</Text>
        <View style={styles.safetyAdviceContainer}>
          <View style={styles.adviceRow}>
            <View style={styles.adviceIcon}>
              <TriangleAlert size={24} color={Colors.light['alert-high']} />
            </View>
            <Text style={styles.adviceText}>Non attraversare strade allagate.</Text>
          </View>
          <View style={styles.adviceRow}>
            <View style={styles.adviceIcon}>
              <TrafficCone size={24} color={Colors.light['alert-medium']} />
            </View>
            <Text style={styles.adviceText}>
              Cerca un terreno più elevato se ti trovi in una zona a rischio.
            </Text>
          </View>
          <View style={styles.adviceRow}>
            <View style={styles.adviceIcon}>
              <Headset size={24} color={Colors.light.primary} />
            </View>
            <Text style={styles.adviceText}>Segui le indicazioni delle autorità locali.</Text>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Percorso Alternativo</Text>
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Il tuo percorso è stato modificato</Text>
              <Text style={styles.timestamp}>
                Tempo di viaggio aggiuntivo stimato:{' '}
                <Text style={{ fontFamily: 'SpaceGrotesk-Bold' }}>+15 min</Text>
              </Text>
            </View>
            {/* <ImageBackground
              source={require('../../assets/images/alternative-route-map.png')}
              style={styles.routeImage}
              borderRadius={BorderRadius.lg}
            /> */}
            <View style={styles.adviceIconFoot} >
              <Map size={32} color={Colors.light.primary}/>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.ctaButton} onPress={() => router.push('/screens/MapScreen')  }>
          {/* <SymbolView name="route" size={24} tintColor="white" /> */}
          <Text style={styles.ctaButtonText}>Mostra Percorso Sicuro</Text>
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
  },
  chipsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
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
  },
  timestamp: {
    fontFamily: 'SpaceGrotesk-Regular',
    color: Colors.dark.placeholder,
    marginVertical: 4,
  },
  description: {
    fontFamily: 'SpaceGrotesk-Regular',
    color: Colors.dark.text,
  },
  sectionTitle: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 18,
    color: Colors.dark.text,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  safetyAdviceContainer: {
    marginHorizontal: 16,
    gap: 8,
  },
  adviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BorderRadius.xl,
    padding: 16,
  },
  adviceIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(96, 122, 251, 0.2)',
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  adviceIconFoot: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(96, 122, 251, 0.2)',
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    margin: 8,
  },
  adviceText: {
    flex: 1,
    fontFamily: 'SpaceGrotesk-Medium',
    color: Colors.dark.text,
  },
  routeImage: {
    width: 100,
    height: 100,
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
});

export default AlertDetailsScreen;
