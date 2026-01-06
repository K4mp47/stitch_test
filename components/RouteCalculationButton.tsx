import { Route } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { BorderRadius, Colors } from '../constants/theme';

interface RouteCalculationButtonProps {
  onPress: () => void;
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
}

const RouteCalculationButton = ({ onPress, isLoading = false, style }: RouteCalculationButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    if (!isLoading) {
      setIsPressed(true);
      onPress();
      setTimeout(() => setIsPressed(false), 300);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, style, isPressed && styles.pressed, isLoading && styles.loading]}
      onPress={handlePress}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color={Colors.dark.text} size="small" />
      ) : (
        <Route color={Colors.dark.text} size={24} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pressed: {
    transform: [{ scale: 0.95 }],
  },
  loading: {
    opacity: 0.8,
  },
});

export default RouteCalculationButton;
