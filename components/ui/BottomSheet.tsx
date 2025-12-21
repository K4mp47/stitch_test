import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { Colors } from '../../constants/theme';

const BottomSheet = ({ children }) => {
  const { height } = useWindowDimensions();
  const top = useSharedValue(height);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startY = top.value;
    },
    onActive: (event, ctx) => {
      top.value = ctx.startY + event.translationY;
    },
    onEnd: () => {
      if (top.value > height / 2) {
        top.value = withSpring(height - 200);
      } else {
        top.value = withSpring(100);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      top: top.value,
    };
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.handle} />
        {children}
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.dark.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.dark.border,
    alignSelf: 'center',
    marginBottom: 10,
  },
});

export default BottomSheet;
