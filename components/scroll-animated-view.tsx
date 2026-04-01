import React, { useRef } from "react";
import { Animated, ScrollView, View } from "react-native";

interface ScrollAnimatedViewProps {
  children: React.ReactNode;
  onScroll?: (offset: number) => void;
  parallaxHeight?: number;
  parallaxImage?: React.ReactNode;
}

/**
 * Scroll Animated View Component
 * Provides parallax and fade effects on scroll
 */
export function ScrollAnimatedView({
  children,
  onScroll,
  parallaxHeight = 200,
  parallaxImage,
}: ScrollAnimatedViewProps) {
  const scrollAnim = useRef(new Animated.Value(0)).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollAnim } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        onScroll?.(event.nativeEvent.contentOffset.y);
      },
    }
  );

  const parallaxTranslate = scrollAnim.interpolate({
    inputRange: [0, parallaxHeight],
    outputRange: [0, parallaxHeight * 0.3],
    extrapolate: "clamp",
  });

  const parallaxOpacity = scrollAnim.interpolate({
    inputRange: [0, parallaxHeight],
    outputRange: [1, 0.5],
    extrapolate: "clamp",
  });

  return (
    <ScrollView
      scrollEventThrottle={16}
      onScroll={handleScroll}
      showsVerticalScrollIndicator={false}
    >
      {/* Parallax Header */}
      {parallaxImage && (
        <Animated.View
          style={{
            height: parallaxHeight,
            overflow: "hidden",
            transform: [{ translateY: parallaxTranslate }],
            opacity: parallaxOpacity,
          }}
        >
          {parallaxImage}
        </Animated.View>
      )}

      {/* Content */}
      <View>{children}</View>
    </ScrollView>
  );
}

export default ScrollAnimatedView;
