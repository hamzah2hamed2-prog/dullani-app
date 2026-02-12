import { ScrollView, Text, View, TouchableOpacity, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";

export default function StoresMapScreen() {
  const router = useRouter();
  const [selectedStore, setSelectedStore] = useState<any>(null);

  // Fetch all stores
  const { data: storesData, isLoading } = trpc.stores.list.useQuery({});
  const stores = storesData || [];

  const handleStorePress = (store: any) => {
    setSelectedStore(store);
  };

  const handleViewStore = (storeId: number) => {
    router.push(`/(tabs)/store/${storeId}` as any);
  };

  const renderStoreCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => handleStorePress(item)}
      className={`bg-surface border rounded-lg p-4 mb-3 ${
        selectedStore?.id === item.id ? "border-primary bg-primary/5" : "border-border"
      }`}
    >
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground">{item.name}</Text>
          {item.address && (
            <Text className="text-xs text-muted mt-1">📍 {item.address}</Text>
          )}
        </View>
        {item.rating && (
          <View className="bg-primary/10 px-2 py-1 rounded">
            <Text className="text-xs font-semibold text-primary">⭐ {item.rating}</Text>
          </View>
        )}
      </View>

      {item.phone && (
        <Text className="text-xs text-muted mb-1">📞 {item.phone}</Text>
      )}

      {item.openingHours && (
        <Text className="text-xs text-muted mb-3">🕐 {item.openingHours}</Text>
      )}

      <TouchableOpacity
        onPress={() => handleViewStore(item.id)}
        className="bg-primary px-3 py-2 rounded"
      >
        <Text className="text-white text-xs font-semibold text-center">
          عرض المتجر
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <ScreenContainer>
        <Text className="text-center text-muted">جاري التحميل...</Text>
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
          <Text className="text-lg font-semibold text-foreground">
            المتاجر القريبة
          </Text>
          <View className="w-6" />
        </View>

        {/* Info */}
        <View className="mb-6 bg-primary/10 rounded-lg p-4">
          <Text className="text-sm text-foreground">
            عدد المتاجر: <Text className="font-bold">{stores.length}</Text>
          </Text>
          <Text className="text-xs text-muted mt-1">
            اضغط على متجر لعرض التفاصيل
          </Text>
        </View>

        {/* Stores List */}
        {stores.length > 0 ? (
          <FlatList
            data={stores}
            renderItem={renderStoreCard}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        ) : (
          <View className="bg-surface rounded-lg p-6 items-center">
            <Text className="text-muted text-center">لا توجد متاجر متاحة حالياً</Text>
          </View>
        )}

        {/* Selected Store Details */}
        {selectedStore && (
          <View className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary">
            <Text className="text-sm font-semibold text-foreground mb-3">
              معلومات المتجر المختار
            </Text>

            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-xs text-muted">الاسم:</Text>
                <Text className="text-xs font-semibold text-foreground">
                  {selectedStore.name}
                </Text>
              </View>

              {selectedStore.address && (
                <View className="flex-row justify-between">
                  <Text className="text-xs text-muted">العنوان:</Text>
                  <Text className="text-xs font-semibold text-foreground">
                    {selectedStore.address}
                  </Text>
                </View>
              )}

              {selectedStore.phone && (
                <View className="flex-row justify-between">
                  <Text className="text-xs text-muted">الهاتف:</Text>
                  <Text className="text-xs font-semibold text-foreground">
                    {selectedStore.phone}
                  </Text>
                </View>
              )}

              {selectedStore.openingHours && (
                <View className="flex-row justify-between">
                  <Text className="text-xs text-muted">ساعات العمل:</Text>
                  <Text className="text-xs font-semibold text-foreground">
                    {selectedStore.openingHours}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
