import { FlatList, Text, View, ActivityIndicator, RefreshControl } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { ProductCardEnhanced } from "@/components/product-card-enhanced";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";

export default function FollowingScreen() {
  const colors = useColors();
  const [refreshing, setRefreshing] = useState(false);

  // Fetch following feed
  const { data: feedProducts = [], isLoading, refetch } = trpc.social.getFollowingFeed.useQuery({
    limit: 20,
    offset: 0,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <ScreenContainer edges={["top"]} style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: colors.border }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.foreground, textAlign: 'center' }}>الخلاصة</Text>
      </View>

      {/* Feed */}
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : feedProducts.length > 0 ? (
        <FlatList
          data={feedProducts}
          renderItem={({ item }) => (
            <ProductCardEnhanced
              id={item.id}
              name={item.name}
              price={item.price?.toString() || "0"}
              image={item.image || "https://via.placeholder.com/400"}
              storeName={(item as any).storeName || "متجر تتابعه"}
              category={item.category || "عام"}
              description={item.description}
              likesCount={Math.floor(Math.random() * 50)} // Mock
              commentsCount={Math.floor(Math.random() * 10)} // Mock
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
        />
      ) : (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 40 }}>
          <Text style={{ fontSize: 40, textAlign: 'center', marginBottom: 20 }}>👥</Text>
          <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>لا توجد منشورات جديدة</Text>
          <Text style={{ color: colors.muted, textAlign: 'center' }}>
            قم بمتابعة المتاجر التي تحبها لتظهر أحدث منتجاتها هنا في خلاصتك الخاصة
          </Text>
        </View>
      )}
    </ScreenContainer>
  );
}
