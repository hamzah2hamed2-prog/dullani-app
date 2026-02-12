import { View, Animated } from "react-native";
import { useEffect, useRef } from "react";

interface LoadingSkeletonProps {
  width?: number;
  height?: number;
  borderRadius?: number;
  className?: string | undefined;
}

/**
 * Loading Skeleton Component
 * Shows a shimmer effect while content is loading
 */
export function LoadingSkeleton({
  width,
  height = 20,
  borderRadius = 8,
  className,
}: LoadingSkeletonProps) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={{
        width: typeof width === "number" ? width : "100%",
        height: typeof height === "number" ? height : 20,
        borderRadius,
        opacity,
      }}
      className={`bg-muted ${className}`}
    />
  );
}

/**
 * Product Card Skeleton
 * Shows a skeleton while product card is loading
 */
export function ProductCardSkeleton() {
  return (
    <View className="bg-surface rounded-lg overflow-hidden border border-border p-3">
      <LoadingSkeleton height={160} borderRadius={8} className="mb-3" />
      <LoadingSkeleton height={16} width={200} className="mb-2" />
      <LoadingSkeleton height={12} width={150} className="mb-3" />
      <LoadingSkeleton height={18} width={100} />
    </View>
  );
}

/**
 * Store Card Skeleton
 * Shows a skeleton while store card is loading
 */
export function StoreCardSkeleton() {
  return (
    <View className="bg-surface rounded-lg border border-border p-4 mb-3">
      <View className="flex-row items-center gap-3 mb-3">
        <LoadingSkeleton width={50} height={50} borderRadius={25} />
        <View className="flex-1">
          <LoadingSkeleton height={16} width={200} className="mb-2" />
          <LoadingSkeleton height={12} width={150} />
        </View>
      </View>
      <LoadingSkeleton height={12} width={300} className="mb-2" />
      <LoadingSkeleton height={12} width={250} />
    </View>
  );
}
