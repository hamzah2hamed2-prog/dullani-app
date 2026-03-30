import React from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { getErrorMessage } from "@/constants/error-messages";

interface ErrorDisplayProps {
  error: Error | null;
  onDismiss?: () => void;
  onRetry?: () => void;
  showRetry?: boolean;
  variant?: "toast" | "inline" | "banner";
  duration?: number;
}

/**
 * Error Display Component
 * Shows user-friendly error messages with optional retry button
 */
export function ErrorDisplay({
  error,
  onDismiss,
  onRetry,
  showRetry = true,
  variant = "toast",
  duration = 5000,
}: ErrorDisplayProps) {
  const colors = useColors();
  const [visible, setVisible] = React.useState(!!error);

  React.useEffect(() => {
    if (!error) {
      setVisible(false);
      return;
    }

    setVisible(true);

    if (duration > 0 && !showRetry) {
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [error, duration, showRetry, onDismiss]);

  if (!visible || !error) {
    return null;
  }

  const errorMessage = getErrorMessage(error);

  if (variant === "toast") {
    return (
      <View
        className="mx-4 mb-4 p-4 rounded-lg flex-row items-center justify-between"
        style={{ backgroundColor: colors.error + "20", borderLeftWidth: 4, borderLeftColor: colors.error }}
      >
        <View className="flex-1">
          <Text className="text-sm font-semibold text-foreground">خطأ</Text>
          <Text className="text-xs text-muted mt-1">{errorMessage}</Text>
        </View>

        {showRetry && onRetry && (
          <TouchableOpacity onPress={onRetry} className="ml-2">
            <Text className="text-xs font-semibold text-primary">أعد</Text>
          </TouchableOpacity>
        )}

        {!showRetry && (
          <TouchableOpacity onPress={() => setVisible(false)} className="ml-2">
            <Text className="text-lg text-muted">×</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (variant === "inline") {
    return (
      <View className="p-4 rounded-lg bg-surface border border-border mb-4">
        <View className="flex-row items-start gap-3">
          <Text className="text-2xl">⚠️</Text>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-foreground">حدث خطأ</Text>
            <Text className="text-xs text-muted mt-1 leading-relaxed">{errorMessage}</Text>

            {showRetry && onRetry && (
              <TouchableOpacity onPress={onRetry} className="mt-3">
                <Text className="text-xs font-semibold text-primary">حاول مرة أخرى</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  }

  // Banner variant
  return (
    <View
      className="px-4 py-3 flex-row items-center justify-between"
      style={{ backgroundColor: colors.error + "10", borderBottomWidth: 1, borderBottomColor: colors.error }}
    >
      <View className="flex-1 flex-row items-center gap-2">
        <Text className="text-lg">⚠️</Text>
        <Text className="text-sm text-foreground flex-1">{errorMessage}</Text>
      </View>

      {showRetry && onRetry && (
        <TouchableOpacity onPress={onRetry} className="ml-2">
          <Text className="text-xs font-semibold text-primary">أعد</Text>
        </TouchableOpacity>
      )}

      {!showRetry && (
        <TouchableOpacity onPress={() => setVisible(false)} className="ml-2">
          <Text className="text-lg text-muted">×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default ErrorDisplay;
