import { useState } from "react";
import { useRouter } from "expo-router";
import {
  ScrollView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { SearchBarEnhanced } from "@/components/search-bar-enhanced";
import { ProductCardEnhanced } from "@/components/product-card-enhanced";
import { ScreenHeader } from "@/components/screen-header";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  storeName: string;
  category: string;
}

// Mock data for MVP
const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "حذاء رياضي",
    price: 299,
    image: "https://via.placeholder.com/200x200?text=Shoe",
    storeName: "متجر الأحذية",
    category: "أحذية",
  },
  {
    id: "2",
    name: "ساعة ذكية",
    price: 599,
    image: "https://via.placeholder.com/200x200?text=Watch",
    storeName: "متجر الإلكترونيات",
    category: "إلكترونيات",
  },
  {
    id: "3",
    name: "عطر فاخر",
    price: 199,
    image: "https://via.placeholder.com/200x200?text=Perfume",
    storeName: "متجر العطور",
    category: "عطور",
  },
  {
    id: "4",
    name: "حقيبة يد",
    price: 449,
    image: "https://via.placeholder.com/200x200?text=Bag",
    storeName: "متجر الموضة",
    category: "ملابس",
  },
  {
    id: "5",
    name: "نظارة شمسية",
    price: 349,
    image: "https://via.placeholder.com/200x200?text=Sunglasses",
    storeName: "متجر الملحقات",
    category: "ملحقات",
  },
  {
    id: "6",
    name: "حزام جلدي",
    price: 149,
    image: "https://via.placeholder.com/200x200?text=Belt",
    storeName: "متجر الموضة",
    category: "ملحقات",
  },
];

const CATEGORIES = [
  { id: "1", name: "الكل", icon: "star.fill" },
  { id: "2", name: "أحذية", icon: "bag.fill" },
  { id: "3", name: "ملابس", icon: "tag.fill" },
  { id: "4", name: "إلكترونيات", icon: "star.fill" },
  { id: "5", name: "عطور", icon: "star.fill" },
];

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlisted, setWishlisted] = useState<Set<string>>(new Set());

  const handleWishlistToggle = (id: string, isWishlisted: boolean) => {
    const newWishlisted = new Set(wishlisted);
    if (isWishlisted) {
      newWishlisted.add(id);
    } else {
      newWishlisted.delete(id);
    }
    setWishlisted(newWishlisted);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScreenContainer style={styles.container}>
      {/* Header */}
      <ScreenHeader
        title="دلني"
        subtitle="اكتشف أفضل المنتجات المحلية"
        rightAction={{
          icon: "bell.fill",
          onPress: () => {},
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
          <FlatList
            data={CATEGORIES}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedCategory(item.id)}
                style={[
                  styles.categoryButton,
                  {
                    backgroundColor:
                      selectedCategory === item.id
                        ? colors.primary
                        : colors.surface,
                    borderColor:
                      selectedCategory === item.id
                        ? colors.primary
                        : colors.border,
                  },
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    {
                      color:
                        selectedCategory === item.id
                          ? "white"
                          : colors.foreground,
                    },
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
            scrollEventThrottle={16}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Products Section */}
        <View style={styles.productsSection}>
          <View style={styles.productsHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              المنتجات المميزة
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/search")}
              style={styles.viewAllButton}
            >
              <Text style={[styles.viewAllText, { color: colors.primary }]}>
                عرض الكل
              </Text>
              <IconSymbol
                size={14}
                name="chevron.right"
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.productsGrid}>
            {filteredProducts.map((product) => (
              <View key={product.id} style={styles.productGridItem}>
                <ProductCardEnhanced
                  id={parseInt(product.id)}
                  name={product.name}
                  price={product.price.toString()}
                  image={product.image}
                  storeName={product.storeName}
                  category={product.category}
                  isWishlisted={wishlisted.has(product.id)}
                  onWishlistToggle={(id, isWishlisted) =>
                    handleWishlistToggle(id.toString(), isWishlisted)
                  }
                />
              </View>
            ))}
          </View>
        </View>

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
                احصل على خصم 20% على أول طلب
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
