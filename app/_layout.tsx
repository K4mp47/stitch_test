import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="screens/OnboardingScreen" options={{ title: 'Onboarding' }} />
      <Stack.Screen name="screens/CreateAccountScreen" options={{ title: 'Create Account' }} />
    </Stack>
  );
}
