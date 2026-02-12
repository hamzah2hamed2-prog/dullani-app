import { View, TextInput, TouchableOpacity } from "react-native";
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
    <View className="flex-row items-center gap-2 px-4 py-2">
      {/* Search Input */}
      <View
        className="flex-1 flex-row items-center rounded-full px-4 py-3 border border-border"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }}
      >
        <IconSymbol size={20} name="magnifyingglass" color={colors.muted} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          className="flex-1 ml-2 text-foreground"
          style={{
            color: colors.foreground,
            fontSize: 14,
          }}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={onClear} className="ml-2">
            <IconSymbol size={18} name="xmark" color={colors.muted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Button */}
      <TouchableOpacity
        onPress={onFilterPress}
        className="bg-primary rounded-full p-3"
        style={{ backgroundColor: colors.primary }}
      >
        <IconSymbol size={20} name="filter" color="white" />
      </TouchableOpacity>
    </View>
  );
}
