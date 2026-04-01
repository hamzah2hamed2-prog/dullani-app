import React, { useRef } from "react";
import { Pressable, Text, Animated, View } from "react-native";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";

interface ButtonAnimatedProps {
  onPress?: () => void;
  title?: string;
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  haptic?: boolean;
  scale?: number;
  duration?: number;
}

/**
 * Animated Button Component
 * Provides smooth animations and haptic feedback on press
 */
export function ButtonAnimated({
  onPress,
  title,
  children,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  className,
  haptic = true,
  scale = 0.95,
  duration = 100,
}: ButtonAnimatedProps) {
  const colors = useColors();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled || loading) return;

    // Haptic feedback
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Scale animation
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: scale,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.8,
        duration,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = () => {
    if (!disabled && !loading) {
      onPress?.();
    }
  };

  // Variant styles
  const variantStyles = {
    primary: "bg-primary",
    secondary: "bg-surface border border-border",
    outline: "border-2 border-primary",
    ghost: "bg-transparent",
  };

  const variantTextStyles = {
    primary: "text-white",
    secondary: "text-foreground",
    outline: "text-primary",
    ghost: "text-primary",
  };

  // Size styles
  const sizeStyles = {
    small: "px-3 py-2 rounded-lg",
    medium: "px-6 py-3 rounded-lg",
    large: "px-8 py-4 rounded-xl",
  };

  const sizeTextStyles = {
    small: "text-xs font-semibold",
    medium: "text-sm font-semibold",
    large: "text-base font-semibold",
  };

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled || loading}
        className={cn(
          "items-center justify-center",
          variantStyles[variant],
          sizeStyles[size],
          disabled && "opacity-50",
          className
        )}
      >
        {loading ? (
          <View className="flex-row items-center gap-2">
            <Text className={cn("text-white", sizeTextStyles[size])}>جاري...</Text>
          </View>
        ) : (
          <>
            {title && <Text className={cn(variantTextStyles[variant], sizeTextStyles[size])}>{title}</Text>}
            {children}
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}

export default ButtonAnimated;
