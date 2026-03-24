import { FlatList, Text, View, TouchableOpacity, TextInput, ActivityIndicator, Image, Dimensions, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = width / 3;

export default function SearchScreen() {
  const router = useRouter();
  const colors = useColors();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch all products
  const { data: products = [], isLoading: productsLoading } = trpc.products.list.useQuery({
    limit: 100,
    offset: 0,
  });

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = trpc.categories.list.useQuery();

  // Fetch search history
  const { data: searchHistory = [], refetch: refetchHistory } = trpc.searchHistory.list.useQuery(
    { limit: 5 },
    { enabled: isSearching }
  );

  const addSearchMutation = trpc.searchHistory.add.useMutation({
    onSuccess: () => refetchHistory(),
  });

  const clearHistoryMutation = trpc.searchHistory.clear.useMutation({
    onSuccess: () => refetchHistory(),
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      addSearchMutation.mutate({ query: query.trim() });
    }
  };

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

  const renderProductItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={{ width: COLUMN_WIDTH, height: COLUMN_WIDTH, padding: 1 }}
      onPress={() => router.push(`/(tabs)/product/${item.id}`)}
    >
      <Image 
        source={{ uri: item.image || "https://via.placeholder.com/200" }} 
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  return (
    <ScreenContainer edges={["top"]} style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Search Input Bar */}
      <View style={{ paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{ 
          backgroundColor: colors.surface, 
          borderRadius: 10, 
          paddingHorizontal: 12, 
          paddingVertical: 8, 
          flexDirection: "row", 
          alignItems: "center",
          flex: 1
        }}>
          <IconSymbol name="magnifyingglass" size={16} color={colors.muted} />
          <TextInput
            placeholder="البحث"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsSearching(true)}
            onSubmitEditing={() => handleSearch(searchQuery)}
            style={{ 
              marginLeft: 8, 
              flex: 1, 
              color: colors.foreground, 
              textAlign: "right", 
              fontSize: 16,
              paddingVertical: 0
            }}
            placeholderTextColor={colors.muted}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <IconSymbol name="xmark" size={14} color={colors.muted} />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Quick Action Buttons */}
        <TouchableOpacity onPress={() => router.push("/(tabs)/image-search")}>
          <IconSymbol name="camera.fill" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/(tabs)/stores-map")}>
          <IconSymbol name="map.fill" size={24} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      {isSearching && searchQuery === "" ? (
        <View style={{ flex: 1, padding: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
            <Text style={{ fontWeight: 'bold', color: colors.foreground }}>عمليات البحث الأخيرة</Text>
            <TouchableOpacity onPress={() => clearHistoryMutation.mutate()}>
              <Text style={{ color: colors.primary }}>مسح الكل</Text>
            </TouchableOpacity>
          </View>
          {searchHistory.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={{ paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: colors.border }}
              onPress={() => setSearchQuery(item.query)}
            >
              <Text style={{ color: colors.foreground }}>{item.query}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity 
            style={{ marginTop: 20 }}
            onPress={() => setIsSearching(false)}
          >
            <Text style={{ color: colors.muted, textAlign: 'center' }}>إغلاق</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Quick Filter Categories */}
          <View style={{ paddingBottom: 10 }}>
            {categoriesLoading ? (
              <ActivityIndicator color={colors.primary} size="small" />
            ) : (
              <FlatList
                data={[{ id: 0, name: "الكل" }, ...categories]}
                renderItem={({ item }) => {
                  const isSelected = item.name === "الكل" ? !selectedCategory : selectedCategory === item.name;
                  return (
                    <TouchableOpacity
                      onPress={() => setSelectedCategory(item.name === "الكل" ? null : item.name)}
                      style={{
                        marginLeft: 8,
                        paddingHorizontal: 16,
                        paddingVertical: 6,
                        borderRadius: 8,
                        backgroundColor: isSelected ? colors.surface : colors.background,
                        borderWidth: 1,
                        borderColor: colors.border
                      }}
                    >
                      <Text style={{ fontSize: 13, fontWeight: "600", color: isSelected ? colors.primary : colors.foreground }}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                inverted
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 10 }}
              />
            )}
          </View>

          {/* Explore Grid */}
          {productsLoading ? (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : filteredProducts.length > 0 ? (
            <FlatList
              data={filteredProducts}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: colors.muted }}>لا توجد نتائج</Text>
            </View>
          )}
        </>
      )}
    </ScreenContainer>
  );
}
