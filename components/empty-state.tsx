import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { SPACING } from "@/constants/design-system";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  fullScreen?: boolean;
}

/**
 * Empty State Component
 * Displays friendly message when no data is available
 */
export function EmptyState({
  icon = "📭",
  title,
  description,
  actionLabel,
  onAction,
  fullScreen = false,
}: EmptyStateProps) {
  const colors = useColors();

  const content = (
    <View className="items-center gap-3">
      {/* Icon */}
      <Text className="text-6xl">{icon}</Text>

      {/* Title */}
      <Text className="text-lg font-bold text-foreground text-center">{title}</Text>

      {/* Description */}
      {description && (
        <Text className="text-sm text-muted text-center leading-relaxed max-w-xs">
          {description}
        </Text>
      )}

      {/* Action Button */}
      {actionLabel && onAction && (
        <TouchableOpacity
          onPress={onAction}
          className="mt-4 px-6 py-3 rounded-lg bg-primary"
        >
          <Text className="text-white font-semibold text-sm">{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (fullScreen) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        {content}
      </View>
    );
  }

  return (
    <View className="items-center justify-center py-12 px-6">
      {content}
    </View>
  );
}

export default EmptyState;
