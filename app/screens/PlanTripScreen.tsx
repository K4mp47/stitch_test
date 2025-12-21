import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Colors, Fonts, BorderRadius } from '../../constants/theme';
import { SymbolView } from 'expo-symbols';
import { useRouter } from 'expo-router';

const PlanTripScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <SymbolView name="arrow_back" size={24} tintColor={Colors.dark.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Plan a Safe Trip</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Start Point</Text>
          <View style={styles.inputContainer}>
            <SymbolView name="farsight_digital" size={24} tintColor={Colors.dark.placeholder} />
            <TextInput
              style={styles.input}
              placeholder="Enter starting location"
              placeholderTextColor={Colors.dark.placeholder}
            />
          </View>
          <TouchableOpacity>
            <Text style={styles.link}>Use my current location</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Destination</Text>
          <View style={styles.inputContainer}>
            <SymbolView name="flag" size={24} tintColor={Colors.dark.placeholder} />
            <TextInput
              style={styles.input}
              placeholder="Enter destination"
              placeholderTextColor={Colors.dark.placeholder}
            />
          </View>
        </View>
        <Text style={styles.sectionTitle}>Select Vehicle Type</Text>
        <View style={styles.vehicleSelector}>
          <TouchableOpacity style={[styles.vehicleButton, styles.selectedVehicle]}>
            <SymbolView name="directions_car" size={32} tintColor={Colors.light.primary} />
            <Text style={[styles.vehicleText, { color: Colors.light.primary }]}>Car</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.vehicleButton}>
            <SymbolView name="two_wheeler" size={32} tintColor={Colors.dark.placeholder} />
            <Text style={styles.vehicleText}>Motorcycle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.vehicleButton}>
            <SymbolView name="local_shipping" size={32} tintColor={Colors.dark.placeholder} />
            <Text style={styles.vehicleText}>Van</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Find Safe Routes</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>
          Routes are calculated based on real-time climate alerts.
        </Text>
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
    padding: 16,
  },
  backButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -12,
  },
  title: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 20,
    color: Colors.dark.text,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontFamily: 'SpaceGrotesk-Medium',
    fontSize: 16,
    color: Colors.dark.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.inputBackground,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    color: Colors.dark.text,
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 16,
  },
  link: {
    color: Colors.light.primary,
    fontFamily: 'SpaceGrotesk-Regular',
    textDecorationLine: 'underline',
    marginTop: 8,
  },
  sectionTitle: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 18,
    color: Colors.dark.text,
    marginBottom: 12,
  },
  vehicleSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  vehicleButton: {
    flex: 1,
    height: 96,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    gap: 8,
  },
  selectedVehicle: {
    borderColor: Colors.light.primary,
    backgroundColor: 'rgba(96, 122, 251, 0.2)',
  },
  vehicleText: {
    fontFamily: 'SpaceGrotesk-Medium',
    color: Colors.dark.placeholder,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: Colors.dark.border,
  },
  ctaButton: {
    backgroundColor: Colors.light.primary,
    height: 56,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaButtonText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 16,
    color: 'white',
  },
  footerText: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 12,
    color: Colors.dark.placeholder,
    textAlign: 'center',
    marginTop: 12,
  },
});

export default PlanTripScreen;
