import { useState } from "react";
import { useRouter } from "expo-router";
import {
  ScrollView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { SearchBarEnhanced } from "@/components/search-bar-enhanced";
import { ProductCardEnhanced } from "@/components/product-card-enhanced";
import { ScreenHeader } from "@/components/screen-header";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { FeaturedSection } from "@/components/featured-section";
import { PopularStoresSection } from "@/components/popular-stores-section";

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlisted, setWishlisted] = useState<Set<number>>(new Set());

  // Fetch real data from tRPC
  const { data: products = [], isLoading: productsLoading } = trpc.products.list.useQuery({
    limit: 20,
    offset: 0,
  });

  const { data: categories = [], isLoading: categoriesLoading } = trpc.categories.list.useQuery();
  const { data: stores = [], isLoading: storesLoading } = trpc.stores.list.useQuery({
    limit: 10,
    offset: 0,
  });

  const handleWishlistToggle = (id: number, isWishlisted: boolean) => {
    const newWishlisted = new Set(wishlisted);
    if (isWishlisted) {
      newWishlisted.add(id);
    } else {
      newWishlisted.delete(id);
    }
    setWishlisted(newWishlisted);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Map stores to the format expected by PopularStoresSection
  const mappedStores = stores.map((s) => ({
    id: s.id,
    name: s.name,
    logo: s.logo || "https://via.placeholder.com/100?text=Store",
    rating: parseFloat(s.rating || "0"),
    ratingCount: 0, // In a real app, this would come from the database
    category: "متجر",
  }));

  // Map products to the format expected by FeaturedSection
  const mappedProducts = filteredProducts.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image || "https://via.placeholder.com/200?text=No+Image",
    storeName: (p as any).storeName || "متجر غير معروف",
    category: p.category || "عام",
  }));

  const isLoading = productsLoading || categoriesLoading || storesLoading;

  return (
    <ScreenContainer style={styles.container}>
      {/* Header */}
      <ScreenHeader
        title="دلني"
        subtitle="اكتشف أفضل المنتجات المحلية"
        rightAction={{
          icon: "bell.fill",
          onPress: () => router.push("/(tabs)/notifications"),
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <SearchBarEnhanced
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery("")}
            onFilterPress={() => router.push("/(tabs)/search")}
          />
        </View>

        {/* Categories Section */}
        <View style={styles.categoriesSection}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            الفئات
          </Text>
          {categoriesLoading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <FlatList
              data={[{ id: 0, name: "الكل" }, ...categories]}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => {
                const isSelected = item.name === "الكل" ? !selectedCategory : selectedCategory === item.name;
                return (
                  <TouchableOpacity
                    onPress={() => setSelectedCategory(item.name === "الكل" ? null : item.name)}
                    style={[
                      styles.categoryButton,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.surface,
                        borderColor: isSelected ? colors.primary : colors.border,
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        { color: isSelected ? "white" : colors.foreground },
                      ]}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
              scrollEventThrottle={16}
              contentContainerStyle={styles.categoriesList}
            />
          )}
        </View>

        {/* Popular Stores Section */}
        <PopularStoresSection
          stores={mappedStores}
          onViewAll={() => router.push("/(tabs)/search")}
          isLoading={storesLoading}
        />

        {/* Featured Products Section */}
        <FeaturedSection
          title="المنتجات المميزة"
          subtitle="مختاراتنا لك لهذا الأسبوع"
          products={mappedProducts}
          onViewAll={() => router.push("/(tabs)/search")}
          isLoading={productsLoading}
        />

        {/* Promotional Banner */}
        <View
          style={[
            styles.promotionalBanner,
            { backgroundColor: colors.primary },
          ]}
        >
          <View style={styles.bannerContent}>
            <View style={styles.bannerText}>
              <Text style={styles.bannerTitle}>عرض خاص</Text>
              <Text style={styles.bannerSubtitle}>
                احصل على خصم 20% على أول طلب عند استخدام كود "DULLANI20"
              </Text>
            </View>
            <IconSymbol size={40} name="tag.fill" color="white" />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  searchSection: {
    paddingTop: 12,
  },
  categoriesSection: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  categoriesList: {
    paddingRight: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryButtonText: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  productsSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  productsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  productGridItem: {
    width: "48%",
  },
  promotionalBanner: {
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 16,
    padding: 20,
    overflow: "hidden",
  },
  bannerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  bannerSubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
  },
});
