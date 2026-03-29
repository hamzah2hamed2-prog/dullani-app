import { ScrollView, View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function AdvancedWishlistScreen() {
  const router = useRouter();
  const colors = useColors();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const categories = [
    { id: "all", name: "الكل", count: 24 },
    { id: "fashion", name: "الموضة", count: 8 },
    { id: "electronics", name: "الإلكترونيات", count: 6 },
    { id: "home", name: "المنزل", count: 5 },
    { id: "beauty", name: "الجمال", count: 5 },
  ];

  const wishlistItems = [
    {
      id: 1,
      name: "فستان سهرة فاخر",
      price: 450,
      image: "https://via.placeholder.com/150",
      category: "fashion",
      store: "متجر الملابس الفاخرة",
      addedDate: "2024-03-15",
      rating: 4.8,
    },
    {
      id: 2,
      name: "سماعات بلوتوث",
      price: 250,
      image: "https://via.placeholder.com/150",
      category: "electronics",
      store: "متجر الإلكترونيات",
      addedDate: "2024-03-10",
      rating: 4.5,
    },
    {
      id: 3,
      name: "وسادة فاخرة",
      price: 120,
      image: "https://via.placeholder.com/150",
      category: "home",
      store: "متجر المنزل",
      addedDate: "2024-03-08",
      rating: 4.6,
    },
    {
      id: 4,
      name: "كريم العناية بالبشرة",
      price: 85,
      image: "https://via.placeholder.com/150",
      category: "beauty",
      store: "متجر الجمال",
      addedDate: "2024-03-05",
      rating: 4.7,
    },
  ];

  const filteredItems = wishlistItems.filter(
    (item) => selectedCategory === "all" || item.category === selectedCategory
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
    } else if (sortBy === "price-low") {
      return a.price - b.price;
    } else if (sortBy === "price-high") {
      return b.price - a.price;
    } else if (sortBy === "rating") {
      return b.rating - a.rating;
    }
    return 0;
  });

  const renderWishlistItem = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.wishlistItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => router.push(`/(tabs)/product/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: colors.foreground }]} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={[styles.itemStore, { color: colors.muted }]} numberOfLines={1}>
          {item.store}
        </Text>
        <View style={styles.itemFooter}>
          <Text style={[styles.itemPrice, { color: colors.primary }]}>
            {item.price} ر.س
          </Text>
          <View style={styles.ratingBadge}>
            <Text style={{ fontSize: 11, color: colors.foreground }}>⭐ {item.rating}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={[styles.removeButton, { backgroundColor: colors.error }]}>
        <Text style={{ color: "white" }}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer style={{ padding: 0 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
            <Text style={{ color: colors.foreground }}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>قائمة الرغبات</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* Categories */}
        <View style={[styles.categoriesContainer, { backgroundColor: colors.background }]}>
          <FlatList
            data={categories}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  {
                    backgroundColor: selectedCategory === item.id ? colors.primary : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setSelectedCategory(item.id)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color: selectedCategory === item.id ? colors.background : colors.foreground,
                    },
                  ]}
                >
                  {item.name}
                </Text>
                <Text
                  style={[
                    styles.categoryCount,
                    {
                      color: selectedCategory === item.id ? colors.background : colors.muted,
                    },
                  ]}
                >
                  {item.count}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Sort Options */}
        <View style={[styles.sortContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.sortLabel, { color: colors.foreground }]}>ترتيب حسب:</Text>
          <View style={styles.sortOptions}>
            {["recent", "price-low", "price-high", "rating"].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.sortButton,
                  {
                    backgroundColor: sortBy === option ? colors.primary : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setSortBy(option)}
              >
                <Text
                  style={[
                    styles.sortButtonText,
                    {
                      color: sortBy === option ? colors.background : colors.foreground,
                    },
                  ]}
                >
                  {option === "recent"
                    ? "الأحدث"
                    : option === "price-low"
                    ? "السعر ↓"
                    : option === "price-high"
                    ? "السعر ↑"
                    : "التقييم"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Wishlist Items */}
        <View style={[styles.itemsContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.itemsCount, { color: colors.muted }]}>
            {sortedItems.length} منتج
          </Text>
          <FlatList
            data={sortedItems}
            renderItem={renderWishlistItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.itemsList}
          />
        </View>

        {/* Empty State */}
        {sortedItems.length === 0 && (
          <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
            <Text style={{ fontSize: 48 }}>💔</Text>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>قائمة الرغبات فارغة</Text>
            <Text style={[styles.emptyDescription, { color: colors.muted }]}>
              أضف منتجاتك المفضلة إلى قائمة الرغبات
            </Text>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  categoriesContainer: {
    paddingVertical: 12,
  },
  categoriesList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 0.5,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
  },
  categoryCount: {
    fontSize: 11,
  },
  sortContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sortLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
  },
  sortOptions: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 0.5,
  },
  sortButtonText: {
    fontSize: 11,
    fontWeight: "600",
  },
  itemsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  itemsCount: {
    fontSize: 12,
    marginBottom: 12,
  },
  itemsList: {
    gap: 12,
  },
  wishlistItem: {
    flexDirection: "row",
    borderRadius: 8,
    borderWidth: 0.5,
    overflow: "hidden",
  },
  itemImage: {
    width: 100,
    height: 100,
  },
  itemInfo: {
    flex: 1,
    padding: 12,
  },
  itemName: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  itemStore: {
    fontSize: 11,
    marginBottom: 8,
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "bold",
  },
  ratingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    margin: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
  },
  emptyDescription: {
    fontSize: 13,
    marginTop: 8,
  },
});
