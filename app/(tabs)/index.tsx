import { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { ProductCardEnhanced } from "@/components/product-card-enhanced";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { StoriesSection } from "@/components/stories-section";

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const [refreshing, setRefreshing] = useState(false);
  const [wishlisted, setWishlisted] = useState<Set<number>>(new Set());

  // Fetch real data from tRPC
  const { data: products = [], isLoading: productsLoading, refetch } = trpc.products.list.useQuery({
    limit: 20,
    offset: 0,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleWishlistToggle = (id: number, isWishlisted: boolean) => {
    const newWishlisted = new Set(wishlisted);
    if (isWishlisted) {
      newWishlisted.add(id);
    } else {
      newWishlisted.delete(id);
    }
    setWishlisted(newWishlisted);
  };

  const renderHeader = () => (
    <View>
      <StoriesSection />
    </View>
  );

  return (
    <ScreenContainer edges={["top"]} style={styles.container}>
      {/* Instagram Style Header */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: 'rgba(0,0,0,0.05)', borderBottomWidth: 1 }]}>
        <Text style={[styles.logo, { color: colors.foreground }]}>دلني</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon}>
            <IconSymbol name="plus.circle.fill" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon} onPress={() => router.push("/(tabs)/notifications")}>
            <IconSymbol name="heart.fill" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <IconSymbol name="paperplane" size={24} color={colors.foreground} />
          </TouchableOpacity>
        </View>
      </View>

      {productsLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => (
            <ProductCardEnhanced
              id={item.id}
              name={item.name}
              price={item.price}
              image={item.image || "https://via.placeholder.com/400"}
              storeName={(item as any).storeName || "متجر دلني"}
              category={item.category || "عام"}
              description={item.description}
              isWishlisted={wishlisted.has(item.id)}
              onWishlistToggle={handleWishlistToggle}
              likesCount={Math.floor(Math.random() * 100)} // Mock likes for demo
              commentsCount={Math.floor(Math.random() * 20)} // Mock comments for demo
            />
          )}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    zIndex: 10,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'System', // Instagram uses a specific font, but we'll use bold system font
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  headerIcon: {
    padding: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
});

