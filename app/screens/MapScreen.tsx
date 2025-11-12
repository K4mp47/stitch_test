import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Colors, Fonts, BorderRadius } from '../../constants/theme';
import { SymbolView } from 'expo-symbols';
import BottomSheet from '../../components/ui/BottomSheet';
import { useRouter } from 'expo-router';

const MapScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/map-background.png')}
        style={styles.mapBackground}>
        <SafeAreaView style={styles.safeArea}>
          {/* Top App Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push('screens/SettingsScreen')}>
              <SymbolView name="menu" size={24} tintColor="white" />
            </TouchableOpacity>
            <Text style={styles.title}>Climate Watch</Text>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push('screens/AlertDetailsScreen')}>
              <SymbolView name="notifications" size={24} tintColor="white" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <SymbolView name="search" size={24} tintColor={Colors.dark.placeholder} />
              <TextInput
                placeholder="Cerca una località..."
                placeholderTextColor={Colors.dark.placeholder}
                style={styles.searchInput}
              />
            </View>
          </View>

          {/* Map Controls */}
          <View style={styles.mapControls}>
            <View style={styles.zoomControls}>
              <TouchableOpacity style={styles.zoomButton}>
                <SymbolView name="add" size={24} tintColor={Colors.dark.text} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.zoomButton, { borderTopWidth: 0 }]}>
                <SymbolView name="remove" size={24} tintColor={Colors.dark.text} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.myLocationButton}>
              <SymbolView name="my_location" size={24} tintColor="white" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>

      {/* Bottom Sheet */}
      <BottomSheet>
        <View style={styles.sheetContent}>
          <View style={styles.alertHeader}>
            <View style={styles.alertIconContainer}>
              <SymbolView name="flood" size={32} tintColor={Colors.light['alert-high']} />
            </View>
            <View style={styles.alertInfo}>
              <Text style={styles.alertTitle}>Allagamento</Text>
              <Text style={styles.alertLocation}>Via Po, 12, Milano, MI</Text>
            </View>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Attivo</Text>
            </View>
          </View>
          <Text style={styles.alertDescription}>
            Strada chiusa a causa di un grave allagamento dovuto a forti piogge. Si consiglia di
            utilizzare percorsi alternativi. Altezza dell'acqua stimata a 50cm. Aggiornato 5
            minuti fa.
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('screens/PlanTripScreen')}>
              <SymbolView name="directions" size={20} tintColor="white" />
              <Text style={styles.primaryButtonText}>Indicazioni</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}>
              <SymbolView name="share" size={24} tintColor={Colors.dark.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}>
              <SymbolView name="flag" size={24} tintColor={Colors.dark.text} />
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    color: 'white',
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.inputBackground,
    borderRadius: BorderRadius.xl,
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
