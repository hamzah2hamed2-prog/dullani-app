import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useColors } from "@/hooks/use-colors";
import { PriceFilter } from "./price-filter";
import { RatingFilter } from "./rating-filter";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface AdvancedSearchFiltersProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: {
    minPrice: string;
    maxPrice: string;
    minRating: number;
    category: string;
  }) => void;
  categories?: Array<{ id: number; name: string }>;
  isLoading?: boolean;
}

export function AdvancedSearchFilters({
  visible,
  onClose,
  onApply,
  categories = [],
  isLoading = false,
}: AdvancedSearchFiltersProps) {
  const colors = useColors();
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleApply = () => {
    onApply({
      minPrice,
      maxPrice,
      minRating,
      category: selectedCategory,
    });
    onClose();
  };

  const handleReset = () => {
    setMinPrice("");
    setMaxPrice("");
    setMinRating(0);
    setSelectedCategory("");
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
      >
        {/* Header */}
        <View
          style={[
            styles.header,
            { backgroundColor: colors.surface, borderBottomColor: colors.border },
          ]}
        >
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons
              name="close"
              size={24}
              color={colors.foreground}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            البحث المتقدم
          </Text>
          <TouchableOpacity onPress={handleReset}>
            <Text style={[styles.resetText, { color: colors.primary }]}>
              إعادة تعيين
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filters Content */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          {/* Price Filter */}
          <PriceFilter
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinChange={setMinPrice}
            onMaxChange={setMaxPrice}
          />

          {/* Rating Filter */}
          <RatingFilter
            selectedRating={minRating}
            onRatingSelect={setMinRating}
          />

          {/* Category Filter */}
          {categories.length > 0 && (
            <View
              style={[
                styles.filterSection,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.filterTitle, { color: colors.foreground }]}>
                الفئة
              </Text>
              <View style={styles.categoriesGrid}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    onPress={() =>
                      setSelectedCategory(
                        selectedCategory === category.name ? "" : category.name
                      )
                    }
                    style={[
                      styles.categoryButton,
                      {
                        backgroundColor:
                          selectedCategory === category.name
                            ? `${colors.primary}20`
                            : colors.background,
                        borderColor:
                          selectedCategory === category.name
                            ? colors.primary
                            : colors.border,
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        {
                          color:
                            selectedCategory === category.name
                              ? colors.primary
                              : colors.foreground,
                        },
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer Buttons */}
        <View
          style={[
            styles.footer,
            { backgroundColor: colors.surface, borderTopColor: colors.border },
          ]}
        >
          <TouchableOpacity
            onPress={onClose}
            style={[
              styles.cancelButton,
              { borderColor: colors.border },
            ]}
            activeOpacity={0.7}
          >
            <Text style={[styles.cancelText, { color: colors.foreground }]}>
              إلغاء
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleApply}
            disabled={isLoading}
            style={[
              styles.applyButton,
              {
                backgroundColor: colors.primary,
                opacity: isLoading ? 0.6 : 1,
              },
            ]}
            activeOpacity={0.7}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.applyText}>تطبيق الفلاتر</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    paddingTop: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  resetText: {
    fontSize: 12,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  filterSection: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  applyText: {
    color: "white",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
