import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, View, TouchableOpacity, Image, FlatList, Linking } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { FollowButton } from "@/components/follow-button";

export default function StoreProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [followersCount, setFollowersCount] = useState(0);

  // Fetch store data
  const { data: store, isLoading } = trpc.stores.getById.useQuery(
    { id: parseInt(id as string) },
    { enabled: !!id }
  );

  // Fetch store products
  const { data: products = [] } = trpc.products.getByStore.useQuery(
    { storeId: parseInt(id as string) },
    { enabled: !!id }
  );

  // Fetch followers count
  const { data: followers = 0 } = trpc.social.getStoreFollowersCount.useQuery(
    { storeId: parseInt(id as string) },
    { enabled: !!id }
  );

  useEffect(() => {
    if (typeof followers === "number") {
      setFollowersCount(followers);
    }
  }, [followers]);

  const handleContactStore = () => {
    if (store?.phone) {
      const message = `مرحا، أود الاستفسار عن منتجاتك على تطبيق دلني`;
      const whatsappUrl = `https://wa.me/${store.phone}?text=${encodeURIComponent(message)}`;
      Linking.openURL(whatsappUrl).catch(() => {
        alert("لا يمكن فتح واتساب");
      });
    }
  };

  const renderProductCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => router.push(`/(tabs)/product/${item.id}` as any)}
      className="bg-surface rounded-lg overflow-hidden border border-border mr-3"
      style={{ width: 150 }}
    >
      <View className="w-full h-32 bg-muted justify-center items-center">
        <Image
          source={{ uri: item.image || "https://via.placeholder.com/150x150?text=Product" }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>
      <View className="p-2">
        <Text className="text-xs font-semibold text-foreground truncate">
          {item.name}
        </Text>
        <Text className="text-primary font-bold text-sm">{item.price} ر.س</Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <ScreenContainer>
        <Text className="text-center text-muted">جاري التحميل...</Text>
      </ScreenContainer>
    );
  }

  if (!store) {
    return (
      <ScreenContainer>
        <Text className="text-center text-muted">المتجر غير موجود</Text>
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
          <Text className="text-lg font-semibold text-foreground">ملف المتجر</Text>
          <View className="w-6" />
        </View>

        {/* Store Header */}
        <View className="p-4 gap-4 border-b border-border">
          {/* Store Name */}
          <View>
            <Text className="text-2xl font-bold text-foreground">{store.name}</Text>
            {store.address && (
              <Text className="text-sm text-muted mt-1">📍 {store.address}</Text>
            )}
          </View>

          {/* Store Info Grid */}
          <View className="flex-row gap-2">
            {store.phone && (
              <View className="flex-1 bg-primary/10 rounded-lg p-3">
                <Text className="text-xs text-muted mb-1">الهاتف</Text>
                <Text className="text-sm font-semibold text-foreground">{store.phone}</Text>
              </View>
            )}
            {store.openingHours && (
              <View className="flex-1 bg-primary/10 rounded-lg p-3">
                <Text className="text-xs text-muted mb-1">ساعات العمل</Text>
                <Text className="text-sm font-semibold text-foreground">{store.openingHours}</Text>
              </View>
            )}
          </View>

          {/* Followers Count */}
          <View className="flex-row items-center gap-4">
            <View className="flex-1 bg-primary/10 rounded-lg p-3">
              <Text className="text-xs text-muted mb-1">المتابعون</Text>
              <Text className="text-lg font-bold text-foreground">{followersCount}</Text>
            </View>
            <View className="flex-1">
              <FollowButton storeId={parseInt(id as string)} size={16} />
            </View>
          </View>

          {/* Action Buttons */}
          <View className="gap-2">
            <TouchableOpacity
              onPress={handleContactStore}
              className="bg-primary px-4 py-3 rounded-lg flex-row items-center justify-center gap-2"
            >
              <Text className="text-white">💬</Text>
              <Text className="text-white font-semibold">تواصل عبر واتساب</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push(`/(tabs)/store/${store.id}/map` as any)}
              className="bg-surface border border-primary px-4 py-3 rounded-lg flex-row items-center justify-center gap-2"
            >
              <Text className="text-primary">🗺️</Text>
              <Text className="text-primary font-semibold">عرض على الخريطة</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Products Section */}
        <View className="p-4">
          <View className="mb-4">
            <Text className="text-lg font-bold text-foreground">
              منتجات المتجر ({products.length})
            </Text>
          </View>

          {products.length > 0 ? (
            <FlatList
              data={products}
              renderItem={renderProductCard}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              scrollEnabled={false}
              contentContainerStyle={{ gap: 8 }}
            />
          ) : (
            <View className="bg-surface rounded-lg p-6 items-center">
              <Text className="text-muted text-center">لا توجد منتجات متاحة حالياً</Text>
            </View>
          )}
        </View>

        {/* Store Description */}
        {store.description && (
          <View className="p-4 border-t border-border">
            <Text className="text-sm font-semibold text-foreground mb-2">عن المتجر</Text>
            <Text className="text-sm text-muted leading-relaxed">{store.description}</Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
