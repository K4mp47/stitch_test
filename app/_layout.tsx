import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'SpaceGrotesk-Regular': require('../assets/fonts/SpaceGrotesk-Regular.otf'),
    'SpaceGrotesk-Medium': require('../assets/fonts/SpaceGrotesk-Medium.otf'),
    'SpaceGrotesk-Bold': require('../assets/fonts/SpaceGrotesk-Bold.otf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="screens/OnboardingScreen" />
      <Stack.Screen name="screens/CreateAccountScreen" />
      <Stack.Screen name="screens/MapScreen" />
      <Stack.Screen name="screens/SettingsScreen" />
      <Stack.Screen name="screens/AlertDetailsScreen" />
      <Stack.Screen name="screens/PlanTripScreen" />
    </Stack>
  );
}
