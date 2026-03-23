import { View, Text, FlatList, RefreshControl } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { ScreenHeader } from "@/components/screen-header";
import { ProductCardEnhanced } from "@/components/product-card-enhanced";
import { trpc } from "@/lib/trpc";
import { useColors } from "@/hooks/use-colors";

export default function FollowingScreen() {
  const colors = useColors();
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);

  // Fetch following feed
  const { data: feedProducts = [], isLoading, refetch } = trpc.social.getFollowingFeed.useQuery(
    { limit: 20, offset }
  );

  useEffect(() => {
    if (Array.isArray(feedProducts)) {
      if (offset === 0) {
        setProducts(feedProducts);
      } else {
        setProducts((prev) => [...prev, ...feedProducts]);
      }
    }
  }, [feedProducts]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setOffset(0);
    await refetch();
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (!isLoading && feedProducts.length > 0) {
      setOffset((prev) => prev + 20);
    }
  };

  const renderProductCard = ({ item }: { item: any }) => (
    <View style={{ marginBottom: 16, paddingHorizontal: 8 }}>
      <ProductCardEnhanced
        id={item.id}
        name={item.name}
        price={item.price?.toString() || "0"}
        image={item.image || "https://via.placeholder.com/200x200?text=Product"}
        storeName={item.storeName || "متجر"}
        category={item.category || "عام"}
        rating={item.rating || 0}
        ratingCount={item.ratingCount || 0}
      />
    </View>
  );

  const renderEmptyState = () => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 40 }}>
      <Text style={{ fontSize: 16, color: colors.muted, marginBottom: 8 }}>
        لا توجد منتجات من المتاجر المتابعة
      </Text>
      <Text style={{ fontSize: 13, color: colors.muted, textAlign: "center" }}>
        ابدأ بمتابعة المتاجر لرؤية منتجاتهم هنا
      </Text>
    </View>
  );

  return (
    <ScreenContainer className="p-0">
      <ScreenHeader title="المتابعات" />
      
      <FlatList
        data={products}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingHorizontal: 8, paddingTop: 8 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={renderEmptyState}
        scrollEnabled={true}
      />
    </ScreenContainer>
  );
}
