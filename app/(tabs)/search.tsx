import { FlatList, Text, View, TouchableOpacity, TextInput } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Fetch all products
  const { data: products = [] } = trpc.products.list.useQuery({
    limit: 100,
    offset: 0,
  });

  // Fetch categories
  const { data: categories = [] } = trpc.categories.list.useQuery();

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === null || product.category === categories[selectedCategory]?.name;

    return matchesSearch && matchesCategory;
  });

  const renderProductCard = ({ item }: { item: any }) => (
    <View className="flex-1 m-2">
      <TouchableOpacity
        onPress={() => router.push(`/(tabs)/product/${item.id}` as any)}
        className="bg-surface rounded-lg overflow-hidden border border-border"
      >
        <View className="w-full h-40 bg-muted justify-center items-center">
          <Text className="text-4xl">📦</Text>
        </View>

        <View className="p-3 gap-1">
          <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
            {item.name}
          </Text>
          <Text className="text-xs text-muted">{item.category || "عام"}</Text>
          <Text className="text-base font-bold text-primary mt-1">{item.price} ر.س</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenContainer className="p-0">
      {/* Header */}
      <View className="px-4 py-4 border-b border-border">
        <Text className="text-2xl font-bold text-foreground mb-4">البحث</Text>

        {/* Search Input */}
        <View className="bg-surface border border-border rounded-lg px-3 py-2 flex-row items-center">
          <Text className="text-muted">🔍</Text>
          <TextInput
            placeholder="ابحث عن منتجات..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="ml-2 flex-1 text-foreground"
            placeholderTextColor="#687076"
          />
        </View>
      </View>

      {/* Categories Filter */}
      {categories.length > 0 && (
        <View className="px-4 py-3 border-b border-border">
          <Text className="text-xs font-semibold text-muted mb-2">الفئات</Text>
          <FlatList
            data={categories}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() =>
                  setSelectedCategory(selectedCategory === index ? null : index)
                }
                className={`mr-2 px-3 py-2 rounded-full ${
                  selectedCategory === index
                    ? "bg-primary"
                    : "bg-surface border border-border"
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    selectedCategory === index
                      ? "text-white"
                      : "text-foreground"
                  }`}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            scrollEnabled
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}

      {/* Results Count */}
      <View className="px-4 py-2">
        <Text className="text-xs text-muted">
          {filteredProducts.length} منتج
        </Text>
      </View>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          scrollEnabled
          contentContainerStyle={{ paddingHorizontal: 4 }}
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text className="text-muted">لا توجد نتائج</Text>
        </View>
      )}
    </ScreenContainer>
  );
}
