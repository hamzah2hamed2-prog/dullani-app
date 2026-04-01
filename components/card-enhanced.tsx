import React from "react";
import { View, Pressable, Animated } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { SHADOWS, BORDER_RADIUS, SPACING } from "@/constants/design-system";
import { cn } from "@/lib/utils";
import * as Haptics from "expo-haptics";

interface CardEnhancedProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: "elevated" | "outlined" | "filled";
  padding?: "small" | "medium" | "large";
  borderRadius?: "small" | "medium" | "large";
  shadow?: "none" | "small" | "medium" | "large";
  className?: string;
  pressable?: boolean;
  haptic?: boolean;
}

/**
 * Enhanced Card Component
 * Provides visual hierarchy and interactive feedback
 */
export function CardEnhanced({
  children,
  onPress,
  variant = "elevated",
  padding = "medium",
  borderRadius = "medium",
  shadow = "small",
  className,
  pressable = !!onPress,
  haptic = true,
}: CardEnhancedProps) {
  const colors = useColors();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const opacityAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Padding styles
  const paddingStyles = {
    small: `p-${SPACING.SM}`,
    medium: `p-${SPACING.MD}`,
    large: `p-${SPACING.LG}`,
  };

  // Border radius styles
  const borderRadiusValue = {
    small: BORDER_RADIUS.MEDIUM,
    medium: BORDER_RADIUS.LARGE,
    large: BORDER_RADIUS.EXTRA_LARGE,
  };

  // Variant styles
  const variantStyles = {
    elevated: {
      backgroundColor: colors.surface,
      ...SHADOWS[shadow as keyof typeof SHADOWS],
    },
    outlined: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    filled: {
      backgroundColor: colors.surface,
    },
  };

  const cardContent = (
    <View
      className={cn(
        "rounded-lg",
        paddingStyles[padding],
        className
      )}
      style={{
        ...variantStyles[variant],
        borderRadius: borderRadiusValue[borderRadius],
      }}
    >
      {children}
    </View>
  );

  if (pressable && onPress) {
    return (
      <Animated.View
        style={[
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress}>
          {cardContent}
        </Pressable>
      </Animated.View>
    );
  }

  return cardContent;
}

export default CardEnhanced;
