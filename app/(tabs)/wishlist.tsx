import { FlatList, Text, View, TouchableOpacity, Image, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { useColors } from "@/hooks/use-colors";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = width / 3;

export default function WishlistScreen() {
  const router = useRouter();
  const colors = useColors();

  // Fetch wishlist items with product details
  const { data: wishlistItems = [], isLoading, refetch } = trpc.wishlist.list.useQuery();

  const renderWishlistItem = ({ item }: { item: any }) => (
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
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: colors.border }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.foreground, textAlign: 'center' }}>المحفوظات</Text>
      </View>

      {/* Wishlist Items */}
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: colors.muted }}>جاري التحميل...</Text>
        </View>
      ) : wishlistItems.length > 0 ? (
        <FlatList
          data={wishlistItems}
          renderItem={renderWishlistItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={{ flex: 1, itemsCenter: "center", justifyContent: "center", padding: 40 }}>
          <Text style={{ fontSize: 40, textAlign: 'center', marginBottom: 20 }}>🔖</Text>
          <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>لا توجد محفوظات</Text>
          <Text style={{ color: colors.muted, textAlign: 'center' }}>
            المنتجات التي تقوم بحفظها ستظهر هنا لتتمكن من العودة إليها لاحقاً
          </Text>
          <TouchableOpacity 
            onPress={() => router.push("/")}
            style={{ marginTop: 30, backgroundColor: colors.primary, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>استكشف المنتجات</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScreenContainer>
  );
}
