import { ScrollView, View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function SimilarProductsScreen() {
  const router = useRouter();
  const { productId } = useLocalSearchParams();
  const colors = useColors();
  const [filterBy, setFilterBy] = useState("all");

  const filters = [
    { id: "all", name: "الكل" },
    { id: "price-similar", name: "سعر مشابه" },
    { id: "same-store", name: "من نفس المتجر" },
    { id: "trending", name: "الأكثر رواجاً" },
  ];

  const similarProducts = [
    {
      id: 2,
      name: "فستان سهرة أسود",
      price: 420,
      image: "https://via.placeholder.com/150",
      store: "متجر الملابس الفاخرة",
      rating: 4.7,
      similarity: 92,
    },
    {
      id: 3,
      name: "فستان سهرة ذهبي",
      price: 480,
      image: "https://via.placeholder.com/150",
      store: "متجر الملابس الفاخرة",
      rating: 4.8,
      similarity: 88,
    },
    {
      id: 4,
      name: "فستان كوكتيل",
      price: 350,
      image: "https://via.placeholder.com/150",
      store: "متجر الموضة",
      rating: 4.6,
      similarity: 85,
    },
    {
      id: 5,
      name: "فستان سهرة فضي",
      price: 450,
      image: "https://via.placeholder.com/150",
      store: "متجر الملابس الفاخرة",
      rating: 4.9,
      similarity: 90,
    },
    {
      id: 6,
      name: "فستان سهرة أحمر",
      price: 500,
      image: "https://via.placeholder.com/150",
      store: "متجر الملابس الفاخرة",
      rating: 4.8,
      similarity: 87,
    },
  ];

  const renderProductCard = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.productCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => router.push(`/(tabs)/product/${item.id}`)}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <View style={[styles.similarityBadge, { backgroundColor: colors.primary }]}>
          <Text style={[styles.similarityText, { color: colors.background }]}>
            {item.similarity}%
          </Text>
        </View>
      </View>
      <View style={styles.productInfo}>
        <Text style={[styles.productName, { color: colors.foreground }]} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={[styles.storeName, { color: colors.muted }]} numberOfLines={1}>
          {item.store}
        </Text>
        <View style={styles.productFooter}>
          <Text style={[styles.price, { color: colors.primary }]}>
            {item.price} ر.س
          </Text>
          <View style={styles.ratingContainer}>
            <Text style={{ fontSize: 11 }}>⭐</Text>
            <Text style={[styles.rating, { color: colors.foreground }]}>
              {item.rating}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => {}}
        >
          <Text style={[styles.addButtonText, { color: colors.background }]}>
            أضف للرغبات
          </Text>
        </TouchableOpacity>
      </View>
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
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>منتجات مشابهة</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* Filter Buttons */}
        <View style={[styles.filterContainer, { backgroundColor: colors.background }]}>
          <FlatList
            data={filters}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  {
                    backgroundColor: filterBy === item.id ? colors.primary : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setFilterBy(item.id)}
              >
                <Text
                  style={[
                    styles.filterText,
                    {
                      color: filterBy === item.id ? colors.background : colors.foreground,
                    },
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersList}
          />
        </View>

        {/* Products Grid */}
        <View style={[styles.productsContainer, { backgroundColor: colors.background }]}>
          <FlatList
            data={similarProducts}
            renderItem={renderProductCard}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            scrollEnabled={false}
            contentContainerStyle={styles.productsList}
          />
        </View>

        {/* Info Section */}
        <View style={[styles.infoSection, { backgroundColor: colors.background }]}>
          <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.infoTitle, { color: colors.foreground }]}>💡 نصيحة</Text>
            <Text style={[styles.infoText, { color: colors.muted }]}>
              تم اختيار هذه المنتجات بناءً على التشابه في الفئة والسعر والتقييمات
            </Text>
          </View>
        </View>

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
  filterContainer: {
    paddingVertical: 12,
  },
  filtersList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 0.5,
  },
  filterText: {
    fontSize: 12,
    fontWeight: "600",
  },
  productsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  productsList: {
    gap: 12,
  },
  columnWrapper: {
    gap: 12,
  },
  productCard: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 0.5,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: 1,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  similarityBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  similarityText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  storeName: {
    fontSize: 10,
    marginBottom: 8,
  },
  productFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  price: {
    fontSize: 13,
    fontWeight: "bold",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  rating: {
    fontSize: 11,
  },
  addButton: {
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 11,
    fontWeight: "600",
  },
  infoSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  infoCard: {
    borderRadius: 8,
    borderWidth: 0.5,
    padding: 12,
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 11,
    lineHeight: 16,
  },
});
