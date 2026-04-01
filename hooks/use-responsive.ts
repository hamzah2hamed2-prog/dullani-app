import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BREAKPOINTS } from "@/constants/design-system";

/**
 * Hook for responsive design
 * Provides screen size information and responsive utilities
 */
export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Determine screen size
  const isSmall = width < BREAKPOINTS.MEDIUM;
  const isMedium = width >= BREAKPOINTS.MEDIUM && width < BREAKPOINTS.LARGE;
  const isLarge = width >= BREAKPOINTS.LARGE && width < BREAKPOINTS.EXTRA_LARGE;
  const isExtraLarge = width >= BREAKPOINTS.EXTRA_LARGE;
  const isTablet = width >= BREAKPOINTS.EXTRA_LARGE;
  const isDesktop = width >= BREAKPOINTS.DESKTOP;

  // Determine orientation
  const isPortrait = height > width;
  const isLandscape = width > height;

  // Calculate safe dimensions
  const safeWidth = width - insets.left - insets.right;
  const safeHeight = height - insets.top - insets.bottom;

  // Calculate columns for grid layouts
  const getColumns = (minColumnWidth: number = 150): number => {
    return Math.max(1, Math.floor(safeWidth / minColumnWidth));
  };

  // Calculate item width for grid
  const getItemWidth = (columns: number, gap: number = 12): number => {
    return (safeWidth - gap * (columns - 1)) / columns;
  };

  // Get responsive padding
  const getResponsivePadding = (): number => {
    if (isSmall) return 12;
    if (isMedium) return 16;
    if (isLarge) return 20;
    return 24;
  };

  // Get responsive font size
  const getResponsiveFontSize = (baseSize: number): number => {
    if (isSmall) return baseSize * 0.9;
    if (isExtraLarge) return baseSize * 1.1;
    return baseSize;
  };

  // Get responsive gap
  const getResponsiveGap = (): number => {
    if (isSmall) return 8;
    if (isMedium) return 12;
    return 16;
  };

  return {
    // Dimensions
    width,
    height,
    safeWidth,
    safeHeight,
    insets,

    // Size checks
    isSmall,
    isMedium,
    isLarge,
    isExtraLarge,
    isTablet,
    isDesktop,

    // Orientation
    isPortrait,
    isLandscape,

    // Utilities
    getColumns,
    getItemWidth,
    getResponsivePadding,
    getResponsiveFontSize,
    getResponsiveGap,
  };
}

export default useResponsive;
