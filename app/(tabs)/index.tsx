import { FlatList, Text, View, TouchableOpacity, Image } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  storeName: string;
}

// Mock data for MVP
const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "حذاء رياضي",
    price: 299,
    image: "https://via.placeholder.com/200x200?text=Shoe",
    storeName: "متجر الأحذية",
  },
  {
    id: "2",
    name: "ساعة ذكية",
    price: 599,
    image: "https://via.placeholder.com/200x200?text=Watch",
    storeName: "متجر الإلكترونيات",
  },
  {
    id: "3",
    name: "عطر فاخر",
    price: 199,
    image: "https://via.placeholder.com/200x200?text=Perfume",
    storeName: "متجر العطور",
  },
  {
    id: "4",
    name: "حقيبة يد",
    price: 449,
    image: "https://via.placeholder.com/200x200?text=Bag",
    storeName: "متجر الموضة",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [products] = useState<Product[]>(MOCK_PRODUCTS);

  const renderProductCard = ({ item }: { item: Product }) => (
    <View className="flex-1 m-2">
      <TouchableOpacity
        onPress={() => router.push(`/(tabs)/product/${item.id}` as any)}
        className="bg-surface rounded-lg overflow-hidden border border-border"
      >
        {/* Product Image */}
        <View className="w-full h-40 bg-muted justify-center items-center">
          <Image
            source={{ uri: item.image }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        {/* Product Info */}
        <View className="p-3 gap-1">
          <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
            {item.name}
          </Text>
          <Text className="text-xs text-muted">{item.storeName}</Text>
          <Text className="text-base font-bold text-primary mt-1">
            {item.price} ر.س
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenContainer className="p-0">
      {/* Header */}
      <View className="px-4 py-4 gap-2 border-b border-border">
        <Text className="text-2xl font-bold text-foreground">دلني</Text>
        <Text className="text-xs text-muted">دليلك لمتاجر مدينتك</Text>
      </View>

      {/* Search Bar and Navigation */}
      <View className="px-4 py-3 gap-3">
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/search")}
          className="bg-surface border border-border rounded-lg px-3 py-2 flex-row items-center"
        >
          <Text className="text-muted">🔍</Text>
          <Text className="ml-2 text-muted text-sm">ابحث عن منتجات...</Text>
        </TouchableOpacity>

        {/* Quick Navigation */}
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/search")}
            className="flex-1 bg-primary px-3 py-2 rounded-lg"
          >
            <Text className="text-white text-xs font-semibold text-center">
              🔍 بحث متقدم
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/wishlist")}
            className="flex-1 bg-surface border border-border px-3 py-2 rounded-lg"
          >
            <Text className="text-foreground text-xs font-semibold text-center">
              ❤️ رغباتي
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Products Grid */}
      <FlatList
        data={products}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        scrollEnabled={true}
        contentContainerStyle={{ paddingHorizontal: 4 }}
      />
    </ScreenContainer>
  );
}
