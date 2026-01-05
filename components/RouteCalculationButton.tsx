import { Route } from 'lucide-react-native';
import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { BorderRadius, Colors } from '../constants/theme';

interface RouteCalculationButtonProps {
  onPress: () => void;
}

const RouteCalculationButton = ({ onPress }: RouteCalculationButtonProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Route color={Colors.dark.text} size={24} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 150,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RouteCalculationButton;
