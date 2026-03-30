import { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Pressable,
} from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/hooks/use-auth";
import { useSearchProducts, useSearchSuggestions } from "@/hooks/use-products";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = width / 3;

export default function SearchScreen() {
  const router = useRouter();
  const colors = useColors();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [savedSearches, setSavedSearches] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    priceMin: 0,
    priceMax: 10000,
    rating: 0,
    sortBy: "newest",
  });

  // Fetch search results
  const { data: searchResults, isLoading: searchLoading } = useSearchProducts(searchQuery, {
    categoryId: selectedCategory || undefined,
    minPrice: advancedFilters.priceMin,
    maxPrice: advancedFilters.priceMax,
    rating: advancedFilters.rating,
  });

  // Fetch search suggestions
  const { data: suggestions = [] } = useSearchSuggestions(searchQuery);

  const products = searchResults?.products || [];

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = trpc.categories.list.useQuery();

  // Fetch search history
  const { data: searchHistory = [], refetch: refetchHistory } = trpc.searchHistory.list.useQuery(
    { limit: 10 },
    { enabled: isSearching && isAuthenticated }
  );

  const addSearchMutation = trpc.searchHistory.add.useMutation({
    onSuccess: () => refetchHistory(),
  });

  const clearHistoryMutation = trpc.searchHistory.clear.useMutation({
    onSuccess: () => refetchHistory(),
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowSearchHistory(query.length === 0);
    setIsSearching(true);
    if (query.trim() && isAuthenticated) {
      addSearchMutation.mutate({ query: query.trim() });
    }
  };

  const handleSaveSearch = () => {
    if (searchQuery.trim() && !savedSearches.includes(searchQuery)) {
      setSavedSearches([...savedSearches, searchQuery]);
    }
  };

  const handleRemoveSavedSearch = (search: string) => {
    setSavedSearches(savedSearches.filter((s) => s !== search));
  };

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === null || product.category === selectedCategory;

    const matchesPrice =
      (product.price || 0) >= advancedFilters.priceMin &&
      (product.price || 0) <= advancedFilters.priceMax;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const renderProductItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={{ width: COLUMN_WIDTH, height: COLUMN_WIDTH, padding: 1 }}
      onPress={() => router.push(`/(tabs)/product/${item.id}`)}
    >
      <Image
        source={{ uri: item.image || "https://via.placeholder.com/200" }}
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  const renderSearchHistory = () => (
    <View style={[styles.historyContainer, { backgroundColor: colors.background }]}>
      <View style={styles.historyHeader}>
        <Text style={[styles.historyTitle, { color: colors.foreground }]}>سجل البحث</Text>
        {searchHistory.length > 0 && (
          <TouchableOpacity onPress={() => clearHistoryMutation.mutate()}>
            <Text style={[styles.clearButton, { color: colors.primary }]}>مسح الكل</Text>
          </TouchableOpacity>
        )}
      </View>
      {searchHistory.length > 0 ? (
        <View style={styles.historyList}>
          {searchHistory.map((item: any, index: number) => (
            <TouchableOpacity
              key={index}
              style={[styles.historyItem, { borderBottomColor: colors.border }]}
              onPress={() => handleSearch(item.query)}
            >
              <IconSymbol name="clock" size={16} color={colors.muted} />
              <Text style={[styles.historyItemText, { color: colors.foreground }]}>
                {item.query}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text style={[styles.emptyText, { color: colors.muted }]}>لا يوجد سجل بحث</Text>
      )}
    </View>
  );

  const renderSavedSearches = () => (
    <View style={[styles.savedSearchesContainer, { backgroundColor: colors.surface }]}>
      <Text style={[styles.savedSearchesTitle, { color: colors.foreground }]}>البحث المفضل</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.savedSearchesList}>
        {savedSearches.map((search, index) => (
          <Pressable
            key={index}
            style={[styles.savedSearchChip, { backgroundColor: colors.primary }]}
            onPress={() => handleSearch(search)}
          >
            <Text style={[styles.savedSearchText, { color: colors.background }]}>{search}</Text>
            <TouchableOpacity onPress={() => handleRemoveSavedSearch(search)}>
              <Text style={[styles.removeChip, { color: colors.background }]}>✕</Text>
            </TouchableOpacity>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );

  const renderAdvancedFilters = () => (
    <View style={[styles.filtersPanel, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      <Text style={[styles.filterTitle, { color: colors.foreground }]}>الفلاتر المتقدمة</Text>

      {/* Price Filter */}
      <View style={styles.filterGroup}>
        <Text style={[styles.filterLabel, { color: colors.foreground }]}>السعر</Text>
        <View style={styles.priceRange}>
          <Text style={[styles.priceText, { color: colors.muted }]}>
            {advancedFilters.priceMin} - {advancedFilters.priceMax} ريال
          </Text>
        </View>
      </View>

      {/* Sort Options */}
      <View style={styles.filterGroup}>
        <Text style={[styles.filterLabel, { color: colors.foreground }]}>الترتيب</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortOptions}>
          {["newest", "oldest", "price-low", "price-high", "popular"].map((option) => (
            <Pressable
              key={option}
              style={[
                styles.sortOption,
                {
                  backgroundColor:
                    advancedFilters.sortBy === option ? colors.primary : colors.background,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setAdvancedFilters({ ...advancedFilters, sortBy: option })}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  {
                    color:
                      advancedFilters.sortBy === option ? colors.background : colors.foreground,
                  },
                ]}
              >
                {option === "newest" && "الأحدث"}
                {option === "oldest" && "الأقدم"}
                {option === "price-low" && "السعر: منخفض"}
                {option === "price-high" && "السعر: مرتفع"}
                {option === "popular" && "الأكثر شهرة"}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  return (
    <ScreenContainer edges={["top"]} style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Search Input Bar */}
      <View
        style={[
          styles.searchBar,
          { backgroundColor: colors.background, borderBottomColor: colors.border },
        ]}
      >
        <View
          style={[
            styles.searchInputContainer,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <IconSymbol name="magnifyingglass" size={18} color={colors.muted} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="ابحث عن منتجات..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={handleSearch}
            onFocus={() => setShowSearchHistory(true)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch("")}>
              <IconSymbol name="xmark.circle.fill" size={18} color={colors.muted} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.filterIconButton, { backgroundColor: colors.surface }]}
          onPress={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          <IconSymbol name="slider.horizontal.3" size={20} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      {/* Advanced Filters */}
      {showAdvancedFilters && renderAdvancedFilters()}

      {/* Saved Searches */}
      {savedSearches.length > 0 && searchQuery.length === 0 && renderSavedSearches()}

      {/* Search History or Results */}
      {showSearchHistory && searchQuery.length === 0 ? (
        renderSearchHistory()
      ) : (
        <>
          {/* Categories Filter */}
          {!categoriesLoading && categories.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={[styles.categoriesScroll, { borderBottomColor: colors.border }]}
            >
              <TouchableOpacity
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: selectedCategory === null ? colors.primary : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setSelectedCategory(null)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color:
                        selectedCategory === null ? colors.background : colors.foreground,
                    },
                  ]}
                >
                  الكل
                </Text>
              </TouchableOpacity>
              {categories.map((cat: any) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor:
                        selectedCategory === cat.name ? colors.primary : colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => setSelectedCategory(cat.name)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      {
                        color:
                          selectedCategory === cat.name ? colors.background : colors.foreground,
                      },
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Results Header */}
          {searchQuery.length > 0 && (
            <View style={[styles.resultsHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.resultsCount, { color: colors.muted }]}>
                {filteredProducts.length} نتيجة
              </Text>
              {filteredProducts.length > 0 && (
                <TouchableOpacity onPress={handleSaveSearch}>
                  <Text style={[styles.saveSearchButton, { color: colors.primary }]}>
                    💾 حفظ البحث
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Products Grid */}
          {productsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : filteredProducts.length > 0 ? (
            <FlatList
              data={filteredProducts}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.muted }]}>
                لم يتم العثور على نتائج
              </Text>
            </View>
          )}
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 0.5,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  filterIconButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  categoriesScroll: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 0.5,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "500",
  },
  historyContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  clearButton: {
    fontSize: 13,
    fontWeight: "500",
  },
  historyList: {
    gap: 0,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  historyItemText: {
    fontSize: 14,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
  },
  savedSearchesContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
  },
  savedSearchesTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  savedSearchesList: {
    marginHorizontal: -12,
    paddingHorizontal: 12,
  },
  savedSearchChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  savedSearchText: {
    fontSize: 13,
    fontWeight: "500",
  },
  removeChip: {
    fontSize: 14,
    fontWeight: "bold",
  },
  filtersPanel: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  filterGroup: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 6,
  },
  priceRange: {
    paddingVertical: 6,
  },
  priceText: {
    fontSize: 12,
  },
  sortOptions: {
    marginHorizontal: -12,
    paddingHorizontal: 12,
  },
  sortOption: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
    borderWidth: 0.5,
  },
  sortOptionText: {
    fontSize: 12,
    fontWeight: "500",
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  resultsCount: {
    fontSize: 13,
  },
  saveSearchButton: {
    fontSize: 13,
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
