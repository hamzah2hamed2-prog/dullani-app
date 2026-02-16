import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColors } from "@/hooks/use-colors";

interface StarRatingProps {
  rating: number;
  size?: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
  showCount?: boolean;
  count?: number;
  showLabel?: boolean;
}

export function StarRating({
  rating,
  size = 16,
  onRatingChange,
  interactive = false,
  showCount = false,
  count = 0,
  showLabel = false,
}: StarRatingProps) {
  const colors = useColors();
  const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5

  const handleStarPress = (star: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(star);
    }
  };

  const renderStar = (index: number) => {
    const starValue = index + 1;
    let iconName: string;

    if (roundedRating >= starValue) {
      iconName = "star";
    } else if (roundedRating >= starValue - 0.5) {
      iconName = "star-half";
    } else {
      iconName = "star-outline";
    }

    return (
      <TouchableOpacity
        key={index}
        onPress={() => handleStarPress(starValue)}
        disabled={!interactive}
        style={styles.star}
      >
        <MaterialIcons
          name={iconName as any}
          size={size}
          color={colors.warning}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {[0, 1, 2, 3, 4].map((index) => renderStar(index))}
      </View>
      {showLabel && (
        <Text style={[styles.ratingText, { color: colors.foreground }]}>
          {roundedRating.toFixed(1)}
        </Text>
      )}
      {showCount && (
        <Text style={[styles.countText, { color: colors.muted }]}>
          ({count})
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  starsContainer: {
    flexDirection: "row",
    gap: 2,
  },
  star: {
    padding: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  countText: {
    fontSize: 11,
    fontWeight: "500",
  },
});
