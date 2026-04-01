import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { ANIMATION_DURATION, SPACING } from "@/constants/design-system";

interface LoadingStateProps {
  message?: string;
  size?: "small" | "medium" | "large";
  fullScreen?: boolean;
}

/**
 * Loading State Component
 * Displays animated loading indicator with optional message
 */
export function LoadingState({
  message = "جاري التحميل...",
  size = "medium",
  fullScreen = false,
}: LoadingStateProps) {
  const colors = useColors();
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Rotation animation
    Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [rotationAnim, pulseAnim]);

  const rotation = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const sizeMap = {
    small: 32,
    medium: 48,
    large: 64,
  };

  const spinnerSize = sizeMap[size];

  const container = (
    <View
      className={fullScreen ? "flex-1 items-center justify-center" : "items-center justify-center py-8"}
    >
      {/* Spinner */}
      <Animated.View
        style={{
          transform: [{ rotate: rotation }],
        }}
      >
        <View
          style={{
            width: spinnerSize,
            height: spinnerSize,
            borderRadius: spinnerSize / 2,
            borderWidth: 3,
            borderColor: colors.primary + "30",
            borderTopColor: colors.primary,
          }}
        />
      </Animated.View>

      {/* Pulse ring */}
      <Animated.View
        style={{
          position: "absolute",
          width: spinnerSize,
          height: spinnerSize,
          borderRadius: spinnerSize / 2,
          borderWidth: 2,
          borderColor: colors.primary,
          opacity: 0.3,
          transform: [{ scale: pulseAnim }],
        }}
      />

      {/* Message */}
      {message && (
        <Text
          className="text-sm text-muted font-medium mt-4 text-center"
          style={{ marginTop: SPACING.MD }}
        >
          {message}
        </Text>
      )}
    </View>
  );

  if (fullScreen) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        {container}
      </View>
    );
  }

  return container;
}

export default LoadingState;
