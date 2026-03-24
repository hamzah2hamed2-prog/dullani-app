import { FlatList, Text, View, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { ProductCardEnhanced } from "@/components/product-card-enhanced";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function SearchScreen() {
  const router = useRouter();
  const colors = useColors();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch all products
  const { data: products = [], isLoading: productsLoading } = trpc.products.list.useQuery({
    limit: 100,
    offset: 0,
  });

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = trpc.categories.list.useQuery();

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === null || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const renderProductCard = ({ item }: { item: any }) => (
    <View style={{ flex: 1, margin: 8 }}>
      <ProductCardEnhanced
        id={item.id}
        name={item.name}
        price={item.price}
        image={item.image || "https://via.placeholder.com/200?text=No+Image"}
        storeName={item.storeName || "متجر غير معروف"}
        category={item.category || "عام"}
        rating={0} // Can be added later
        ratingCount={0}
      />
    </View>
  );

  return (
    <ScreenContainer style={{ padding: 0 }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.foreground, marginBottom: 16, textAlign: "right" }}>البحث</Text>

        {/* Search Input */}
        <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
          <IconSymbol name="magnifyingglass" size={20} color={colors.muted} />
          <TextInput
            placeholder="ابحث عن منتجات..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ marginRight: 12, flex: 1, color: colors.foreground, textAlign: "right", fontSize: 16 }}
            placeholderTextColor={colors.muted}
          />
        </View>

        {/* Quick Action Buttons */}
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/image-search")}
            style={{ flex: 1, backgroundColor: `${colors.primary}15`, borderWidth: 1, borderColor: colors.primary, borderRadius: 12, padding: 10, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            <IconSymbol name="camera.fill" size={18} color={colors.primary} />
            <Text style={{ fontSize: 12, fontWeight: "600", color: colors.primary }}>البحث بالصور</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/stores-map")}
            style={{ flex: 1, backgroundColor: `${colors.primary}15`, borderWidth: 1, borderColor: colors.primary, borderRadius: 12, padding: 10, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            <IconSymbol name="map.fill" size={18} color={colors.primary} />
            <Text style={{ fontSize: 12, fontWeight: "600", color: colors.primary }}>المتاجر</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories Filter */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted, marginBottom: 8, textAlign: "right" }}>الفئات</Text>
        {categoriesLoading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <FlatList
            data={[{ id: 0, name: "الكل" }, ...categories]}
            renderItem={({ item }) => {
              const isSelected = item.name === "الكل" ? !selectedCategory : selectedCategory === item.name;
              return (
                <TouchableOpacity
                  onPress={() =>
                    setSelectedCategory(item.name === "الكل" ? null : item.name)
                  }
                  style={{
                    marginLeft: 8,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor: isSelected ? colors.primary : colors.surface,
                    borderWidth: 1,
                    borderColor: isSelected ? colors.primary : colors.border
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      color: isSelected ? "white" : colors.foreground
                    }}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            inverted // Support RTL
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>

      {/* Results Count */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
        <Text style={{ fontSize: 12, color: colors.muted, textAlign: "right" }}>
          {filteredProducts.length} منتج
        </Text>
      </View>

      {/* Products Grid */}
      {productsLoading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 8 }}
        />
      ) : (
        <View style={{ flex: 1, itemsCenter: "center", justifyContent: "center" }}>
          <Text style={{ color: colors.muted }}>لا توجد نتائج</Text>
        </View>
      )}
    </ScreenContainer>
  );
}
