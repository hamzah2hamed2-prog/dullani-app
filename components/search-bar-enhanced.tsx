import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { IconSymbol } from "./ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface SearchBarEnhancedProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  onFilterPress?: () => void;
  placeholder?: string;
}

export function SearchBarEnhanced({
  value,
  onChangeText,
  onClear,
  onFilterPress,
  placeholder = "ابحث عن منتجات...",
}: SearchBarEnhancedProps) {
  const colors = useColors();

  return (
    <View style={[styles.container, { paddingHorizontal: 16 }]}>
      {/* Search Input */}
      <View
        style={[
          styles.searchInput,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <IconSymbol size={20} name="magnifyingglass" color={colors.muted} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          style={[
            styles.textInput,
            {
              color: colors.foreground,
            },
          ]}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={onClear} style={styles.clearButton}>
            <IconSymbol size={18} name="xmark" color={colors.muted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Button */}
      <TouchableOpacity
        onPress={onFilterPress}
        style={[
          styles.filterButton,
          { backgroundColor: colors.primary },
        ]}
        activeOpacity={0.8}
      >
        <IconSymbol size={20} name="filter" color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },
  clearButton: {
    padding: 4,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
