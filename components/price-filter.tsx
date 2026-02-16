import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { useColors } from "@/hooks/use-colors";

interface PriceFilterProps {
  minPrice: string;
  maxPrice: string;
  onMinChange: (price: string) => void;
  onMaxChange: (price: string) => void;
}

export function PriceFilter({
  minPrice,
  maxPrice,
  onMinChange,
  onMaxChange,
}: PriceFilterProps) {
  const colors = useColors();

  const handleReset = () => {
    onMinChange("");
    onMaxChange("");
  };

  const priceRanges = [
    { label: "أقل من 100 ر.س", min: "0", max: "100" },
    { label: "100 - 500 ر.س", min: "100", max: "500" },
    { label: "500 - 1000 ر.س", min: "500", max: "1000" },
    { label: "1000 - 5000 ر.س", min: "1000", max: "5000" },
    { label: "أكثر من 5000 ر.س", min: "5000", max: "999999" },
  ];

  const isRangeSelected = (min: string, max: string) => {
    return minPrice === min && maxPrice === max;
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          نطاق السعر
        </Text>
        <TouchableOpacity onPress={handleReset}>
          <Text style={[styles.resetButton, { color: colors.primary }]}>
            إعادة تعيين
          </Text>
        </TouchableOpacity>
      </View>

      {/* Preset Price Ranges */}
      <View style={styles.rangesContainer}>
        {priceRanges.map((range, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              onMinChange(range.min);
              onMaxChange(range.max);
            }}
            style={[
              styles.rangeButton,
              {
                backgroundColor: isRangeSelected(range.min, range.max)
                  ? `${colors.primary}20`
                  : colors.background,
                borderColor: isRangeSelected(range.min, range.max)
                  ? colors.primary
                  : colors.border,
              },
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.rangeLabel,
                {
                  color: isRangeSelected(range.min, range.max)
                    ? colors.primary
                    : colors.foreground,
                },
              ]}
            >
              {range.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Custom Price Input */}
      <View style={styles.customSection}>
        <Text style={[styles.customLabel, { color: colors.foreground }]}>
          نطاق مخصص
        </Text>
        <View style={styles.inputRow}>
          <TextInput
            placeholder="الحد الأدنى"
            placeholderTextColor={colors.muted}
            value={minPrice}
            onChangeText={onMinChange}
            keyboardType="numeric"
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.foreground,
              },
            ]}
          />
          <Text style={[styles.separator, { color: colors.muted }]}>-</Text>
          <TextInput
            placeholder="الحد الأقصى"
            placeholderTextColor={colors.muted}
            value={maxPrice}
            onChangeText={onMaxChange}
            keyboardType="numeric"
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.foreground,
              },
            ]}
          />
        </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  resetButton: {
    fontSize: 12,
    fontWeight: "600",
  },
  rangesContainer: {
    gap: 8,
  },
  rangeButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  rangeLabel: {
    fontSize: 13,
    fontWeight: "600",
  },
  customSection: {
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  customLabel: {
    fontSize: 13,
    fontWeight: "600",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 12,
    fontWeight: "500",
  },
  separator: {
    fontSize: 14,
    fontWeight: "700",
  },
});
