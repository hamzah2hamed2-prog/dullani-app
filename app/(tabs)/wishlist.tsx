import { FlatList, Text, View, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";

export default function WishlistScreen() {
  const router = useRouter();

  // Fetch wishlist items
  const { data: wishlistItems = [], refetch } = trpc.wishlist.list.useQuery();

  // Remove from wishlist mutation
  const removeFromWishlistMutation = trpc.wishlist.remove.useMutation({
    onSuccess: () => refetch(),
  });

  const handleRemoveFromWishlist = (productId: number) => {
    removeFromWishlistMutation.mutate({ productId });
  };

  const renderWishlistItem = ({ item }: { item: any }) => (
    <View className="flex-1 m-2">
      <TouchableOpacity
        onPress={() => router.push(`/(tabs)/product/${item.productId}` as any)}
        className="bg-surface rounded-lg overflow-hidden border border-border"
      >
        {/* Product Image */}
        <View className="w-full h-40 bg-muted justify-center items-center">
          <Image
            source={{ uri: "https://via.placeholder.com/200x200?text=Product" }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        {/* Product Info */}
        <View className="p-3 gap-2">
          <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
            المنتج #{item.productId}
          </Text>

          {/* Remove Button */}
          <TouchableOpacity
            onPress={() => handleRemoveFromWishlist(item.productId)}
            className="bg-error px-3 py-2 rounded"
          >
            <Text className="text-white text-xs font-semibold text-center">
              إزالة من الرغبات
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenContainer className="p-0">
      {/* Header */}
      <View className="px-4 py-4 border-b border-border">
        <Text className="text-2xl font-bold text-foreground">قائمة الرغبات</Text>
        <Text className="text-xs text-muted mt-1">
          {wishlistItems.length} منتج محفوظ
        </Text>
      </View>

      {/* Wishlist Items */}
      {wishlistItems.length > 0 ? (
        <FlatList
          data={wishlistItems}
          renderItem={renderWishlistItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          scrollEnabled
          contentContainerStyle={{ paddingHorizontal: 4, paddingVertical: 8 }}
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text className="text-4xl mb-4">💔</Text>
          <Text className="text-muted text-center">
            قائمة الرغبات فارغة{"\n"}
            ابدأ بحفظ المنتجات التي تعجبك
          </Text>
        </View>
      )}
    </ScreenContainer>
  );
}
