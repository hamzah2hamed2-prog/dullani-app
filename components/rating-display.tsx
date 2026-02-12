import { View, Text, TouchableOpacity } from "react-native";
import { IconSymbol } from "./ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface RatingDisplayProps {
  rating: number; // 0-5
  count?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export function RatingDisplay({
  rating,
  count,
  size = "md",
  interactive = false,
  onRatingChange,
}: RatingDisplayProps) {
  const colors = useColors();

  const getIconSize = () => {
    switch (size) {
      case "sm":
        return 14;
      case "md":
        return 18;
      case "lg":
        return 24;
      default:
        return 18;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case "sm":
        return "text-xs";
      case "md":
        return "text-sm";
      case "lg":
        return "text-base";
      default:
        return "text-sm";
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= Math.round(rating);
      stars.push(
        <TouchableOpacity
          key={i}
          disabled={!interactive}
          onPress={() => interactive && onRatingChange?.(i)}
          activeOpacity={interactive ? 0.7 : 1}
        >
          <IconSymbol
            size={getIconSize()}
            name="star.fill"
            color={
              isFilled ? colors.warning : `${colors.muted}40`
            }
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <View className="flex-row items-center gap-1">
      <View className="flex-row gap-0.5">{renderStars()}</View>
      <Text className={`${getTextSize()} text-muted font-semibold`}>
        {rating.toFixed(1)}
      </Text>
      {count && (
        <Text className={`${getTextSize()} text-muted`}>
          ({count})
        </Text>
      )}
    </View>
  );
}
