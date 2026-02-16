import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { StarRating } from "./star-rating";

interface RatingFilterProps {
  selectedRating: number;
  onRatingSelect: (rating: number) => void;
}

export function RatingFilter({
  selectedRating,
  onRatingSelect,
}: RatingFilterProps) {
  const colors = useColors();

  const ratingOptions = [
    { value: 0, label: "جميع التقييمات" },
    { value: 4, label: "4 نجوم وما فوق" },
    { value: 3, label: "3 نجوم وما فوق" },
    { value: 2, label: "2 نجوم وما فوق" },
    { value: 1, label: "1 نجم وما فوق" },
  ];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <Text style={[styles.title, { color: colors.foreground }]}>
        التقييم
      </Text>

      <View style={styles.optionsContainer}>
        {ratingOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => onRatingSelect(option.value)}
            style={[
              styles.optionButton,
              {
                backgroundColor:
                  selectedRating === option.value
                    ? `${colors.primary}20`
                    : colors.background,
                borderColor:
                  selectedRating === option.value
                    ? colors.primary
                    : colors.border,
              },
            ]}
            activeOpacity={0.7}
          >
            <View style={styles.optionContent}>
              {option.value > 0 && (
                <StarRating rating={option.value} size={12} />
              )}
              <Text
                style={[
                  styles.optionLabel,
                  {
                    color:
                      selectedRating === option.value
                        ? colors.primary
                        : colors.foreground,
                  },
                ]}
              >
                {option.label}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 12,
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  optionsContainer: {
    gap: 8,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  optionLabel: {
    fontSize: 13,
    fontWeight: "600",
  },
});
