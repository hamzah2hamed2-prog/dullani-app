import { useEffect, useRef } from "react";
import {
  createFadeInAnimation,
  createSlideInAnimation,
  createScaleAnimation,
  createBounceAnimation,
  createRotationAnimation,
  createPulseAnimation,
  ANIMATION_TIMINGS,
} from "@/lib/animations";

type AnimationType = "fadeIn" | "slideIn" | "scale" | "bounce" | "rotation" | "pulse";

interface UseAnimationOptions {
  type: AnimationType;
  duration?: number;
  delay?: number;
  autoStart?: boolean;
  direction?: "left" | "right" | "up" | "down";
}

/**
 * Hook for managing animations in components
 * Provides easy animation setup with auto-start option
 */
export function useAnimation({
  type,
  duration = ANIMATION_TIMINGS.NORMAL,
  delay = 0,
  autoStart = true,
  direction = "up",
}: UseAnimationOptions) {
  const animationRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Create animation based on type
    switch (type) {
      case "fadeIn":
        animationRef.current = createFadeInAnimation(duration);
        break;
      case "slideIn":
        animationRef.current = createSlideInAnimation(duration, direction);
        break;
      case "scale":
        animationRef.current = createScaleAnimation(duration);
        break;
      case "bounce":
        animationRef.current = createBounceAnimation(duration);
        break;
      case "rotation":
        animationRef.current = createRotationAnimation(duration);
        break;
      case "pulse":
        animationRef.current = createPulseAnimation(duration);
        break;
    }

    // Auto-start animation if enabled
    if (autoStart && animationRef.current) {
      if (delay > 0) {
        timeoutRef.current = setTimeout(() => {
          animationRef.current?.animate?.();
        }, delay);
      } else {
        animationRef.current.animate();
      }
    }

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [type, duration, delay, autoStart, direction]);

  const start = () => {
    animationRef.current?.animate?.();
  };

  const stop = () => {
    animationRef.current?.reset?.();
  };

  const reset = () => {
    animationRef.current?.reset?.();
  };

  const getAnimatedValue = () => {
    return animationRef.current?.fadeAnim || animationRef.current?.slideAnim || animationRef.current?.scaleAnim;
  };

  const getTransformStyle = () => {
    return animationRef.current?.getTransformStyle?.() || {};
  };

  return {
    start,
    stop,
    reset,
    getAnimatedValue,
    getTransformStyle,
    animationValue: animationRef.current,
  };
}

export default useAnimation;
