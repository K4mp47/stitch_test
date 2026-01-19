import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function Home() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      const completed = await AsyncStorage.getItem("onboardingCompleted");

      if (completed === "true") {
        router.replace("/screens/MapScreen");
      } else {
        router.replace("/screens/OnboardingScreen");
      }

      setIsReady(true);
    };

    checkOnboarding();
  }, []);

  if (!isReady) {
    return <View />;
  }

  return <View />;
}
