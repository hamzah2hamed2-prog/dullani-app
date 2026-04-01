import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Switch } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { SPACING, BORDER_RADIUS } from "@/constants/design-system";
import * as Haptics from "expo-haptics";

export interface FilterOption {
  id: string;
  label: string;
  type: "checkbox" | "radio" | "range" | "toggle";
  options?: Array<{ id: string; label: string }>;
  value?: any;
  minValue?: number;
  maxValue?: number;
}

interface FilterPanelProps {
  filters: FilterOption[];
  onFilterChange: (filterId: string, value: any) => void;
  onApply: () => void;
  onReset: () => void;
  title?: string;
}

/**
 * Filter Panel Component
 * Provides advanced filtering options
 */
export function FilterPanel({
  filters,
  onFilterChange,
  onApply,
  onReset,
  title = "الفلاتر",
}: FilterPanelProps) {
  const colors = useColors();
  const [localFilters, setLocalFilters] = useState<Record<string, any>>(
    filters.reduce((acc, f) => ({ ...acc, [f.id]: f.value }), {})
  );

  const handleFilterChange = (filterId: string, value: any) => {
    setLocalFilters((prev) => ({ ...prev, [filterId]: value }));
    onFilterChange(filterId, value);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleReset = () => {
    setLocalFilters(filters.reduce((acc, f) => ({ ...acc, [f.id]: f.value }), {}));
    onReset();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const renderFilter = (filter: FilterOption) => {
    switch (filter.type) {
      case "checkbox":
        return (
          <View key={filter.id} className="mb-4">
            <Text className="text-sm font-semibold text-foreground mb-2">{filter.label}</Text>
            <View className="gap-2">
              {filter.options?.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => {
                    const currentValues = localFilters[filter.id] || [];
                    const newValues = currentValues.includes(option.id)
                      ? currentValues.filter((id: string) => id !== option.id)
                      : [...currentValues, option.id];
                    handleFilterChange(filter.id, newValues);
                  }}
                  className="flex-row items-center py-2"
                >
                  <View
                    className="w-5 h-5 rounded border-2 mr-2 items-center justify-center"
                    style={{
                      borderColor: colors.primary,
                      backgroundColor: localFilters[filter.id]?.includes(option.id)
                        ? colors.primary
                        : "transparent",
                    }}
                  >
                    {localFilters[filter.id]?.includes(option.id) && (
                      <Text className="text-white text-xs">✓</Text>
                    )}
                  </View>
                  <Text className="text-sm text-foreground">{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case "radio":
        return (
          <View key={filter.id} className="mb-4">
            <Text className="text-sm font-semibold text-foreground mb-2">{filter.label}</Text>
            <View className="gap-2">
              {filter.options?.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => handleFilterChange(filter.id, option.id)}
                  className="flex-row items-center py-2"
                >
                  <View
                    className="w-5 h-5 rounded-full border-2 mr-2 items-center justify-center"
                    style={{ borderColor: colors.primary }}
                  >
                    {localFilters[filter.id] === option.id && (
                      <View
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: colors.primary }}
                      />
                    )}
                  </View>
                  <Text className="text-sm text-foreground">{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case "toggle":
        return (
          <View key={filter.id} className="flex-row items-center justify-between mb-4 py-2">
            <Text className="text-sm font-semibold text-foreground">{filter.label}</Text>
            <Switch
              value={localFilters[filter.id] || false}
              onValueChange={(value) => handleFilterChange(filter.id, value)}
              trackColor={{ false: colors.border, true: colors.primary + "50" }}
              thumbColor={localFilters[filter.id] ? colors.primary : colors.muted}
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View
      className="rounded-lg p-4"
      style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }}
    >
      {/* Title */}
      <Text className="text-lg font-bold text-foreground mb-4">{title}</Text>

      {/* Filters */}
      <ScrollView showsVerticalScrollIndicator={false} className="max-h-96">
        {filters.map((filter) => renderFilter(filter))}
      </ScrollView>

      {/* Action Buttons */}
      <View className="flex-row gap-3 mt-6">
        {/* Reset Button */}
        <TouchableOpacity
          onPress={handleReset}
          className="flex-1 py-3 rounded-lg border border-border items-center"
        >
          <Text className="text-sm font-semibold text-foreground">إعادة تعيين</Text>
        </TouchableOpacity>

        {/* Apply Button */}
        <TouchableOpacity
          onPress={onApply}
          className="flex-1 py-3 rounded-lg items-center"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-sm font-semibold text-white">تطبيق</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default FilterPanel;
