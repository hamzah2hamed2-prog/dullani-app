import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, View, TouchableOpacity, Image, FlatList, Linking, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { FollowButton } from "@/components/follow-button";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { FeaturedSection } from "@/components/featured-section";

export default function StoreProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colors = useColors();
  const [followersCount, setFollowersCount] = useState(0);

  // Fetch store data
  const { data: store, isLoading } = trpc.stores.getById.useQuery(
    { id: parseInt(id as string) },
    { enabled: !!id }
  );

  // Fetch store products
  const { data: products = [], isLoading: productsLoading } = trpc.products.getByStore.useQuery(
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
      const message = `مرحبا، أود الاستفسار عن منتجاتك على تطبيق دلني`;
      const whatsappUrl = `https://wa.me/${store.phone}?text=${encodeURIComponent(message)}`;
      Linking.openURL(whatsappUrl).catch(() => {
        alert("لا يمكن فتح واتساب");
      });
    }
  };

  if (isLoading) {
    return (
      <ScreenContainer>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 12, color: colors.muted }}>جاري التحميل...</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (!store) {
    return (
      <ScreenContainer>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
          <IconSymbol name="xmark" size={48} color={colors.error} />
          <Text style={{ marginTop: 16, fontSize: 18, fontWeight: "bold", color: colors.foreground }}>المتجر غير موجود</Text>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={{ marginTop: 20, backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>العودة</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  const mappedProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image || "https://via.placeholder.com/200?text=No+Image",
    storeName: store.name,
    category: p.category || "عام",
  }));

  return (
    <ScreenContainer style={{ padding: 0 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with back button */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
            <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.foreground }}>ملف المتجر</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* Store Profile Section */}
        <View style={{ padding: 20, alignItems: "center", borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: colors.muted, overflow: "hidden", marginBottom: 16, borderWidth: 3, borderColor: colors.primary }}>
            <Image
              source={{ uri: store.logo || "https://via.placeholder.com/200?text=Store" }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          </View>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.foreground, textAlign: "center" }}>{store.name}</Text>
          {store.address && (
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8, gap: 4 }}>
              <IconSymbol name="mappin.fill" size={14} color={colors.muted} />
              <Text style={{ fontSize: 14, color: colors.muted }}>{store.address}</Text>
            </View>
          )}

          {/* Followers Stats */}
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 20, gap: 24 }}>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.foreground }}>{followersCount}</Text>
              <Text style={{ fontSize: 12, color: colors.muted }}>متابع</Text>
            </View>
            <View style={{ height: 30, width: 1, backgroundColor: colors.border }} />
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.foreground }}>{products.length}</Text>
              <Text style={{ fontSize: 12, color: colors.muted }}>منتج</Text>
            </View>
          </View>

          {/* Follow Button */}
          <View style={{ width: "100%", marginTop: 20 }}>
            <FollowButton storeId={store.id} size={16} />
          </View>
        </View>

        {/* Store Info Grid */}
        <View style={{ padding: 20, flexDirection: "row", gap: 12 }}>
          {store.phone && (
            <View style={{ flex: 1, backgroundColor: `${colors.primary}10`, borderRadius: 12, padding: 16 }}>
              <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 4 }}>الهاتف</Text>
              <Text style={{ fontSize: 14, fontWeight: "bold", color: colors.foreground }}>{store.phone}</Text>
            </View>
          )}
          {store.openingHours && (
            <View style={{ flex: 1, backgroundColor: `${colors.primary}10`, borderRadius: 12, padding: 16 }}>
              <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 4 }}>ساعات العمل</Text>
              <Text style={{ fontSize: 14, fontWeight: "bold", color: colors.foreground }}>{store.openingHours}</Text>
            </View>
          )}
        </View>

        {/* Store Description */}
        {store.description && (
          <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.foreground, marginBottom: 8 }}>عن المتجر</Text>
            <Text style={{ fontSize: 14, color: colors.muted, lineHeight: 22 }}>{store.description}</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={{ paddingHorizontal: 20, gap: 12, marginBottom: 24 }}>
          <TouchableOpacity
            onPress={handleContactStore}
            style={{ backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 }}
          >
            <IconSymbol name="phone.fill" size={18} color="white" />
            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>تواصل عبر واتساب</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push(`/(tabs)/store/${store.id}/map`)}
            style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.primary, paddingVertical: 14, borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 }}
          >
            <IconSymbol name="map.fill" size={18} color={colors.primary} />
            <Text style={{ color: colors.primary, fontSize: 16, fontWeight: "bold" }}>عرض على الخريطة</Text>
          </TouchableOpacity>
        </View>

        {/* Products Section */}
        <View style={{ paddingBottom: 40 }}>
          <FeaturedSection
            title="منتجات المتجر"
            subtitle={`جميع المنتجات المتاحة في ${store.name}`}
            products={mappedProducts}
            isLoading={productsLoading}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
