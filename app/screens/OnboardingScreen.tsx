import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { Colors, Fonts, BorderRadius } from '../../constants/theme';
import { SymbolView } from 'expo-symbols';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const features = [
  {
    icon: 'notifications_active',
    title: 'Allerte in tempo reale',
    description: 'Ricevi notifiche immediate sulle emergenze climatiche.',
  },
  {
    icon: 'route',
    title: 'Percorsi sicuri',
    description: 'Pianifica i tuoi spostamenti evitando le aree a rischio.',
  },
  {
    icon: 'emergency_home',
    title: 'Monitoraggio emergenze',
    description: 'Tieni traccia degli eventi climatici importanti in corso.',
  },
];

const OnboardingScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <SymbolView name="shield_with_cloud" size={32} type="hierarchical" tintColor={Colors.light.primary} />
        <Text style={styles.appName}>ClimateSafe</Text>
      </View>
      <View style={styles.mainContent}>
        <Text style={styles.headline}>Viaggia sicuro, informato sul clima</Text>
        <FlatList
          data={features}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.featureCard}>
              <View style={styles.iconContainer}>
                <SymbolView name={item.icon} size={48} type="hierarchical" tintColor={Colors.light.primary} />
              </View>
              <Text style={styles.featureTitle}>{item.title}</Text>
              <Text style={styles.featureDescription}>{item.description}</Text>
            </View>
          )}
          keyExtractor={(item) => item.title}
          contentContainerStyle={styles.carouselContainer}
        />
        <View style={styles.indicatorContainer}>
          <View style={[styles.indicator, styles.activeIndicator]} />
          <View style={styles.indicator} />
          <View style={styles.indicator} />
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => router.push('screens/CreateAccountScreen')}>
          <Text style={styles.buttonText}>Crea Account</Text>
        </TouchableOpacity>
        <Text style={styles.loginText}>
          Hai già un account?{' '}
          <Text style={styles.loginLink} onPress={() => router.push('screens/CreateAccountScreen')}>
            Accedi
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    paddingTop: 40,
  },
  appName: {
    fontSize: 28,
    fontFamily: 'SpaceGrotesk-Bold',
    color: Colors.light.primary,
    marginLeft: 8,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
  },
  headline: {
    fontSize: 32,
    fontFamily: 'SpaceGrotesk-Bold',
    color: Colors.dark.text,
    textAlign: 'center',
    marginHorizontal: 16,
    marginBottom: 24,
  },
  carouselContainer: {
    alignItems: 'center',
  },
  featureCard: {
    alignItems: 'center',
    width: width,
    paddingHorizontal: 60,
  },
  iconContainer: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: 'rgba(96, 122, 251, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Medium',
    color: Colors.dark.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Regular',
    color: '#92adc9',
    textAlign: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#324d67',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: Colors.light.primary,
  },
  footer: {
    padding: 24,
  },
  buttonContainer: {
    backgroundColor: Colors.light.primary,
    height: 48,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  loginText: {
    textAlign: 'center',
    color: '#92adc9',
    fontFamily: 'SpaceGrotesk-Regular',
  },
  loginLink: {
    color: Colors.light.primary,
    fontFamily: 'SpaceGrotesk-Bold',
  },
});

export default OnboardingScreen;
