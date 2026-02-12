import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, View, TouchableOpacity, Linking } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";

export default function StoreMapScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Fetch store data
  const { data: store, isLoading } = trpc.stores.getById.useQuery(
    { id: parseInt(id as string) },
    { enabled: !!id }
  );

  const handleOpenMap = () => {
    if (store?.address) {
      // Open in Google Maps or Apple Maps
      const query = encodeURIComponent(store.address);
      const url = `https://maps.google.com/?q=${query}`;
      Linking.openURL(url).catch(() => {
        alert("لا يمكن فتح الخريطة");
      });
    }
  };

  const handleGetDirections = () => {
    if (store?.address) {
      // Open directions
      const query = encodeURIComponent(store.address);
      const url = `https://maps.google.com/maps/dir/?api=1&destination=${query}`;
      Linking.openURL(url).catch(() => {
        alert("لا يمكن فتح الاتجاهات");
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

  if (!store) {
    return (
      <ScreenContainer>
        <Text className="text-center text-muted">المتجر غير موجود</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-4">
      <ScrollView>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6 pb-4 border-b border-border">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-xl">←</Text>
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-foreground">الموقع</Text>
          <View className="w-6" />
        </View>

        {/* Store Name */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-foreground">{store.name}</Text>
        </View>

        {/* Map Placeholder */}
        <View className="w-full h-64 bg-muted rounded-lg border border-border mb-6 items-center justify-center">
          <Text className="text-6xl mb-2">🗺️</Text>
          <Text className="text-sm text-muted">خريطة التطبيق</Text>
        </View>

        {/* Address Information */}
        {store.address && (
          <View className="bg-surface border border-border rounded-lg p-4 mb-4 gap-3">
            <View>
              <Text className="text-xs font-semibold text-muted mb-1">العنوان</Text>
              <Text className="text-sm font-semibold text-foreground">{store.address}</Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View className="gap-3 mb-6">
          <TouchableOpacity
            onPress={handleOpenMap}
            className="bg-primary px-4 py-3 rounded-lg flex-row items-center justify-center gap-2"
          >
            <Text className="text-white text-lg">🗺️</Text>
            <Text className="text-white font-semibold">عرض على الخريطة</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleGetDirections}
            className="bg-surface border border-primary px-4 py-3 rounded-lg flex-row items-center justify-center gap-2"
          >
            <Text className="text-primary text-lg">🧭</Text>
            <Text className="text-primary font-semibold">الحصول على الاتجاهات</Text>
          </TouchableOpacity>
        </View>

        {/* Store Contact Information */}
        <View className="bg-surface border border-border rounded-lg p-4 gap-3">
          <Text className="text-sm font-semibold text-foreground mb-2">معلومات الاتصال</Text>

          {store.phone && (
            <View className="flex-row items-center gap-2">
              <Text className="text-lg">📞</Text>
              <TouchableOpacity
                onPress={() => {
                  const url = `tel:${store.phone}`;
                  Linking.openURL(url).catch(() => {
                    alert("لا يمكن إجراء المكالمة");
                  });
                }}
              >
                <Text className="text-primary font-semibold">{store.phone}</Text>
              </TouchableOpacity>
            </View>
          )}

          {store.openingHours && (
            <View className="flex-row items-center gap-2">
              <Text className="text-lg">🕐</Text>
              <Text className="text-sm text-foreground">{store.openingHours}</Text>
            </View>
          )}

          {store.description && (
            <View className="mt-3 pt-3 border-t border-border">
              <Text className="text-xs text-muted mb-1">عن المتجر</Text>
              <Text className="text-sm text-foreground leading-relaxed">
                {store.description}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
