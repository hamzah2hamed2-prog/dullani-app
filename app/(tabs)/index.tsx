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
  Alert,
} from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { ProductCardEnhanced } from "@/components/product-card-enhanced";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { StoriesSection } from "@/components/stories-section";
import { useAuth } from "@/hooks/use-auth";

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const { user, isAuthenticated } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

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

  const handleAddPress = () => {
    if (!isAuthenticated) {
      router.push("/login"); // Redirect to login
      return;
    }
    
    if (user?.accountType === "merchant") {
      router.push("/(tabs)/merchant/add-product");
    } else {
      Alert.alert(
        "كن تاجراً",
        "هل ترغب في فتح متجرك الخاص والبدء في عرض منتجاتك؟",
        [
          { text: "ليس الآن", style: "cancel" },
          { text: "نعم، أريد ذلك", onPress: () => router.push("/(tabs)/profile-setup") }
        ]
      );
    }
  };

  const renderHeader = () => (
    <View>
      <StoriesSection />
    </View>
  );

  return (
    <ScreenContainer edges={["top"]} style={styles.container}>
      {/* Instagram Style Header */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border, borderBottomWidth: 0.5 }]}>
        <Text style={[styles.logo, { color: colors.foreground }]}>دلني</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon} onPress={handleAddPress}>
            <IconSymbol name="plus.circle.fill" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon} onPress={() => router.push("/(tabs)/notifications")}>
            <IconSymbol name="heart.fill" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon} onPress={() => Alert.alert("قريباً", "ميزة الرسائل المباشرة ستكون متوفرة قريباً!")}>
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
              price={item.price?.toString() || "0"}
              image={item.image || "https://via.placeholder.com/400"}
              storeName={(item as any).storeName || "متجر دلني"}
              category={item.category || "عام"}
              description={item.description || undefined}
              likesCount={Math.floor(Math.random() * 100)} // Mock likes for demo
              commentsCount={Math.floor(Math.random() * 20)} // Mock comments for demo
            />
          )}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
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
    fontFamily: 'System',
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

