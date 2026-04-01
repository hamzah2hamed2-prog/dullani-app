/**
 * Design System Constants
 * Centralized design tokens for consistent UI/UX
 */

/**
 * Shadow styles for elevation
 */
export const SHADOWS = {
  NONE: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  SMALL: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  MEDIUM: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  LARGE: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  EXTRA_LARGE: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },
} as const;

/**
 * Border radius values
 */
export const BORDER_RADIUS = {
  NONE: 0,
  SMALL: 4,
  MEDIUM: 8,
  LARGE: 12,
  EXTRA_LARGE: 16,
  FULL: 9999,
} as const;

/**
 * Spacing values
 */
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 20,
  XXL: 24,
  XXXL: 32,
} as const;

/**
 * Typography sizes
 */
export const TYPOGRAPHY = {
  CAPTION: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400" as const,
  },
  BODY_SMALL: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400" as const,
  },
  BODY: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  BODY_LARGE: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  SUBTITLE: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "600" as const,
  },
  TITLE_SMALL: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600" as const,
  },
  TITLE: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "700" as const,
  },
  TITLE_LARGE: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700" as const,
  },
  HEADLINE: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700" as const,
  },
} as const;

/**
 * Touch target sizes (minimum 44x44 for accessibility)
 */
export const TOUCH_TARGET = {
  SMALL: 40,
  MEDIUM: 44,
  LARGE: 48,
  EXTRA_LARGE: 56,
} as const;

/**
 * Animation durations
 */
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 800,
} as const;

/**
 * Opacity values
 */
export const OPACITY = {
  DISABLED: 0.5,
  HOVER: 0.8,
  PRESSED: 0.7,
  SUBTLE: 0.6,
  SEMI_TRANSPARENT: 0.5,
  TRANSPARENT: 0.3,
} as const;

/**
 * Z-index layers
 */
export const Z_INDEX = {
  BASE: 0,
  DROPDOWN: 100,
  MODAL: 1000,
  TOOLTIP: 1100,
  NOTIFICATION: 1200,
} as const;

/**
 * Responsive breakpoints
 */
export const BREAKPOINTS = {
  SMALL: 320,
  MEDIUM: 375,
  LARGE: 414,
  EXTRA_LARGE: 768,
  DESKTOP: 1024,
} as const;

/**
 * Common gradients
 */
export const GRADIENTS = {
  PRIMARY: ["#0a7ea4", "#0a5f7f"],
  SUCCESS: ["#22C55E", "#16a34a"],
  WARNING: ["#F59E0B", "#d97706"],
  ERROR: ["#EF4444", "#dc2626"],
  SUBTLE: ["#f5f5f5", "#e5e5e5"],
} as const;

/**
 * Common transitions
 */
export const TRANSITIONS = {
  FAST: "150ms ease-out",
  NORMAL: "300ms ease-out",
  SLOW: "500ms ease-out",
} as const;
