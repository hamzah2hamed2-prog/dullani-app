import { useState } from "react";
import { useRouter } from "expo-router";
import {
  ScrollView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
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
    <ScreenContainer className="p-0">
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
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Search Bar */}
        <View className="mt-4">
          <SearchBarEnhanced
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery("")}
            onFilterPress={() => router.push("/(tabs)/search")}
          />
        </View>

        {/* Categories */}
        <View className="mt-4 px-4">
          <Text className="text-sm font-bold text-foreground mb-3">
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
                className={`mr-2 px-4 py-2 rounded-full border ${
                  selectedCategory === item.id
                    ? "bg-primary border-primary"
                    : "bg-surface border-border"
                }`}
                style={{
                  backgroundColor:
                    selectedCategory === item.id
                      ? colors.primary
                      : colors.surface,
                  borderColor:
                    selectedCategory === item.id ? colors.primary : colors.border,
                }}
              >
                <Text
                  className={`text-sm font-semibold ${
                    selectedCategory === item.id
                      ? "text-white"
                      : "text-foreground"
                  }`}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
            scrollEventThrottle={16}
          />
        </View>

        {/* Products Grid */}
        <View className="mt-6 px-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-sm font-bold text-foreground">
              المنتجات المميزة
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/search")}
              className="flex-row items-center"
            >
              <Text className="text-xs text-primary font-semibold">عرض الكل</Text>
              <IconSymbol
                size={14}
                name="chevron.right"
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap justify-between">
            {filteredProducts.map((product) => (
              <View key={product.id} className="w-1/2 pr-2 mb-4">
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
        <View className="mt-6 mx-4 bg-gradient-to-r from-primary to-primary/70 rounded-2xl p-4 overflow-hidden">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-white font-bold text-lg mb-1">
                عرض خاص
              </Text>
              <Text className="text-white/80 text-sm">
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
