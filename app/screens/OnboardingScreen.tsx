// import { useRouter } from 'expo-router';
import { useRouter } from 'expo-router';
import { Activity, Route, Shield, TriangleAlert } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Colors } from '../../constants/theme';

const { width } = Dimensions.get('window');

const features = [
  {
    icon: <TriangleAlert size={48} color={'white'} />,
    title: 'Allerte in tempo reale',
    description: 'Ricevi notifiche immediate sulle emergenze climatiche.',
  },
  {
    icon: <Route size={48} color={'white'} />,
    title: 'Percorsi sicuri',
    description: 'Pianifica i tuoi spostamenti evitando le aree a rischio.',
  },
  {
    icon: <Activity size={48} color={'white'} />,
    title: 'Monitoraggio emergenze',
    description: 'Tieni traccia degli eventi climatici importanti in corso.',
  },
];

const OnboardingScreen = () => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 });
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Shield size={32} color={Colors.light.primary} /> 
        {/* <SymbolView size={32} type="hierarchical" tintColor={Colors.light.primary} /> */}
        <Text style={styles.appName}>ClimateSafe</Text>
      </View>
      <View style={styles.mainContent}>
        <Text style={styles.headline}>Viaggia sicuro, informato sul clima</Text>
        <FlatList
          data={features}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={true}
          renderItem={({ item }) => (
            <View style={styles.featureCard}>
              <View style={styles.iconContainer}>
                {item.icon}
              </View>
              <Text style={styles.featureTitle}>{item.title}</Text>
              <Text style={styles.featureDescription}>{item.description}</Text>
            </View>
          )}
          keyExtractor={(item) => item.title}
          contentContainerStyle={styles.carouselContainer}
          onViewableItemsChanged={onViewableItemsChanged.current}
          viewabilityConfig={viewabilityConfig.current}
        />
        <View style={styles.indicatorContainer}>
          {features.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === activeIndex ? styles.activeIndicator : null,
              ]}
            />
          ))}
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => router.push('/screens/MapScreen')}
          >
          <Text style={styles.buttonText}>Let&apos;s choose a trip</Text>
        </TouchableOpacity>
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
    fontSize: 20,
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
});

export default OnboardingScreen;
