import { Animated, Easing } from "react-native";

/**
 * Animation Utilities
 * Provides reusable animation functions and values
 */

/**
 * Create a fade-in animation
 */
export function createFadeInAnimation(duration = 300) {
  const fadeAnim = new Animated.Value(0);

  const animate = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const reset = () => {
    fadeAnim.setValue(0);
  };

  return { fadeAnim, animate, reset };
}

/**
 * Create a slide-in animation
 */
export function createSlideInAnimation(duration = 300, direction: "left" | "right" | "up" | "down" = "up") {
  const slideAnim = new Animated.Value(
    direction === "left" ? -100 : direction === "right" ? 100 : direction === "up" ? 100 : -100
  );

  const animate = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const reset = () => {
    slideAnim.setValue(direction === "left" ? -100 : direction === "right" ? 100 : direction === "up" ? 100 : -100);
  };

  const getTransformStyle = () => {
    if (direction === "left" || direction === "right") {
      return { transform: [{ translateX: slideAnim }] };
    }
    return { transform: [{ translateY: slideAnim }] };
  };

  return { slideAnim, animate, reset, getTransformStyle };
}

/**
 * Create a scale animation
 */
export function createScaleAnimation(duration = 200, fromScale = 0.8) {
  const scaleAnim = new Animated.Value(fromScale);

  const animate = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const reset = () => {
    scaleAnim.setValue(fromScale);
  };

  const getTransformStyle = () => {
    return { transform: [{ scale: scaleAnim }] };
  };

  return { scaleAnim, animate, reset, getTransformStyle };
}

/**
 * Create a bounce animation
 */
export function createBounceAnimation(duration = 500) {
  const bounceAnim = new Animated.Value(0);

  const animate = () => {
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: -10,
        duration: duration / 2,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 0,
        duration: duration / 2,
        easing: Easing.out(Easing.bounce),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const reset = () => {
    bounceAnim.setValue(0);
  };

  const getTransformStyle = () => {
    return { transform: [{ translateY: bounceAnim }] };
  };

  return { bounceAnim, animate, reset, getTransformStyle };
}

/**
 * Create a rotation animation
 */
export function createRotationAnimation(duration = 1000, fromRotation = 0) {
  const rotationAnim = new Animated.Value(fromRotation);

  const animate = (toRotation = 360) => {
    Animated.timing(rotationAnim, {
      toValue: toRotation,
      duration,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  const reset = () => {
    rotationAnim.setValue(fromRotation);
  };

  const getTransformStyle = () => {
    const rotation = rotationAnim.interpolate({
      inputRange: [0, 360],
      outputRange: ["0deg", "360deg"],
    });
    return { transform: [{ rotate: rotation }] };
  };

  return { rotationAnim, animate, reset, getTransformStyle };
}

/**
 * Create a pulse animation
 */
export function createPulseAnimation(duration = 1000) {
  const pulseAnim = new Animated.Value(1);

  const animate = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: duration / 2,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: duration / 2,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const reset = () => {
    pulseAnim.setValue(1);
  };

  const getTransformStyle = () => {
    return { transform: [{ scale: pulseAnim }] };
  };

  return { pulseAnim, animate, reset, getTransformStyle };
}

/**
 * Timing presets for consistent animations
 */
export const ANIMATION_TIMINGS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 800,
} as const;

/**
 * Easing presets
 */
export const ANIMATION_EASINGS = {
  EASE_IN: Easing.in(Easing.ease),
  EASE_OUT: Easing.out(Easing.ease),
  EASE_IN_OUT: Easing.inOut(Easing.ease),
  LINEAR: Easing.linear,
  CUBIC_IN: Easing.in(Easing.cubic),
  CUBIC_OUT: Easing.out(Easing.cubic),
  BOUNCE: Easing.bounce,
} as const;
