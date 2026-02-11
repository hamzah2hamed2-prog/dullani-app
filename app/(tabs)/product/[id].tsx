import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, View, TouchableOpacity, Image, Linking } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Fetch product data
  const { data: product, isLoading } = trpc.products.getById.useQuery(
    { id: parseInt(id as string) },
    { enabled: !!id }
  );

  // Fetch store data if product exists
  const { data: store } = trpc.stores.getById.useQuery(
    { id: product?.storeId || 0 },
    { enabled: !!product?.storeId }
  );

  // Check if in wishlist
  const { data: inWishlist } = trpc.wishlist.isInWishlist.useQuery(
    { productId: parseInt(id as string) },
    { enabled: !!id }
  );

  // Wishlist mutations
  const addToWishlistMutation = trpc.wishlist.add.useMutation({
    onSuccess: () => setIsInWishlist(true),
  });

  const removeFromWishlistMutation = trpc.wishlist.remove.useMutation({
    onSuccess: () => setIsInWishlist(false),
  });

  useEffect(() => {
    if (inWishlist !== undefined) {
      setIsInWishlist(inWishlist);
    }
  }, [inWishlist]);

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlistMutation.mutate({
        productId: parseInt(id as string),
      });
    } else {
      addToWishlistMutation.mutate({
        productId: parseInt(id as string),
      });
    }
  };

  const handleContactStore = () => {
    if (store?.phone) {
      const message = `مرحبا، رأيت هذا المنتج "${product?.name}" على تطبيق دلني، هل ما زال متوفرا؟`;
      const whatsappUrl = `https://wa.me/${store.phone}?text=${encodeURIComponent(message)}`;
      Linking.openURL(whatsappUrl).catch(() => {
        alert("لا يمكن فتح واتساب");
      });
    }
  };

  if (isLoading) {
    return (
      <ScreenContainer>
        <Text className="text-center text-muted">جاري التحميل...</Text>
      </ScreenContainer>
    );
  }

  if (!product) {
    return (
      <ScreenContainer>
        <Text className="text-center text-muted">المنتج غير موجود</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0">
      <ScrollView>
        {/* Header with back button */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-border">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-xl">←</Text>
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-foreground">تفاصيل المنتج</Text>
          <TouchableOpacity onPress={handleWishlistToggle}>
            <Text className="text-xl">{isInWishlist ? "❤️" : "🤍"}</Text>
          </TouchableOpacity>
        </View>

        {/* Product Image */}
        <View className="w-full h-80 bg-muted justify-center items-center">
          <Image
            source={{ uri: product.image || "https://via.placeholder.com/400x400?text=Product" }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        {/* Product Info */}
        <View className="p-4 gap-4">
          {/* Name and Price */}
          <View className="gap-2">
            <Text className="text-2xl font-bold text-foreground">{product.name}</Text>
            <Text className="text-3xl font-bold text-primary">{product.price} ر.س</Text>
          </View>

          {/* Category */}
          {product.category && (
            <View className="flex-row gap-2">
              <View className="bg-primary px-3 py-1 rounded-full">
                <Text className="text-white text-xs font-semibold">{product.category}</Text>
              </View>
            </View>
          )}

          {/* Description */}
          {product.description && (
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">الوصف</Text>
              <Text className="text-sm text-muted leading-relaxed">{product.description}</Text>
            </View>
          )}

          {/* Store Info */}
          {store && (
            <View className="bg-surface border border-border rounded-lg p-4 gap-3">
              <Text className="text-sm font-semibold text-foreground">معلومات المتجر</Text>
              
              <TouchableOpacity className="gap-1">
                <Text className="text-base font-semibold text-foreground">{store.name}</Text>
                {store.rating && (
                  <Text className="text-xs text-muted">⭐ {store.rating}</Text>
                )}
              </TouchableOpacity>

              {store.address && (
                <Text className="text-xs text-muted">📍 {store.address}</Text>
              )}

              {store.phone && (
                <Text className="text-xs text-muted">📞 {store.phone}</Text>
              )}

              {store.openingHours && (
                <Text className="text-xs text-muted">🕐 {store.openingHours}</Text>
              )}
            </View>
          )}

          {/* Stock Status */}
          <View className="flex-row items-center gap-2">
            <View
              className={`w-3 h-3 rounded-full ${
                product.inStock ? "bg-success" : "bg-error"
              }`}
            />
            <Text className="text-sm text-muted">
              {product.inStock ? "متوفر في المخزون" : "غير متوفر"}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="px-4 py-4 gap-3 border-t border-border">
        <TouchableOpacity
          onPress={handleContactStore}
          className="bg-primary px-4 py-3 rounded-lg flex-row items-center justify-center gap-2"
        >
          <Text className="text-white">💬</Text>
          <Text className="text-white font-semibold">تواصل عبر واتساب</Text>
        </TouchableOpacity>

        {store?.address && (
          <TouchableOpacity className="bg-surface border border-border px-4 py-3 rounded-lg flex-row items-center justify-center gap-2">
            <Text className="text-foreground">📍</Text>
            <Text className="text-foreground font-semibold">عرض على الخريطة</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScreenContainer>
  );
}
