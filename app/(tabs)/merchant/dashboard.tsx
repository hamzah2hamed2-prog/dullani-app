import { ScrollView, Text, View, TouchableOpacity, FlatList } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";

export default function MerchantDashboardScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "analytics">(
    "overview"
  );

  // Fetch user's store (for now, we'll use a mock store)
  const { data: user } = trpc.auth.me.useQuery();
  // TODO: Implement getByUserId endpoint in backend
  const store = {
    id: 1,
    name: "متجري",
    address: "الرياض، السعودية",
    phone: "+966501234567",
    openingHours: "9:00 - 22:00",
  };

  // Fetch store products
  const { data: products = [] } = trpc.products.getByStore.useQuery(
    { storeId: store.id }
  );

  // Calculate statistics
  const totalProducts = products.length;
  const totalViews = products.reduce((sum, p) => sum + ((p as any).views || 0), 0);
  const totalClicks = products.reduce((sum, p) => sum + ((p as any).clicks || 0), 0);

  const renderOverview = () => (
    <View className="gap-4">
      {/* Store Info Card */}
      <View className="bg-surface border border-border rounded-lg p-4">
        <Text className="text-sm font-semibold text-muted mb-2">معلومات المتجر</Text>
        <Text className="text-xl font-bold text-foreground mb-3">{store.name}</Text>
        <View className="gap-2">
          {store?.address && (
            <Text className="text-xs text-muted">📍 {store.address}</Text>
          )}
          {store?.phone && (
            <Text className="text-xs text-muted">📞 {store.phone}</Text>
          )}
          {store?.openingHours && (
            <Text className="text-xs text-muted">🕐 {store.openingHours}</Text>
          )}
        </View>
      </View>

      {/* Statistics Cards */}
      <View className="flex-row gap-2">
        <View className="flex-1 bg-primary/10 rounded-lg p-4 border border-primary">
          <Text className="text-xs text-muted mb-1">إجمالي المنتجات</Text>
          <Text className="text-2xl font-bold text-primary">{totalProducts}</Text>
        </View>
        <View className="flex-1 bg-success/10 rounded-lg p-4 border border-success">
          <Text className="text-xs text-muted mb-1">المشاهدات</Text>
          <Text className="text-2xl font-bold text-success">{totalViews}</Text>
        </View>
      </View>

      <View className="flex-row gap-2">
        <View className="flex-1 bg-warning/10 rounded-lg p-4 border border-warning">
          <Text className="text-xs text-muted mb-1">النقرات</Text>
          <Text className="text-2xl font-bold text-warning">{totalClicks}</Text>
        </View>
        <View className="flex-1 bg-primary/10 rounded-lg p-4 border border-primary">
          <Text className="text-xs text-muted mb-1">معدل التحويل</Text>
          <Text className="text-2xl font-bold text-primary">
            {totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : 0}%
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="gap-2">
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/merchant/add-product" as any)}
          className="bg-primary px-4 py-3 rounded-lg flex-row items-center justify-center gap-2"
        >
          <Text className="text-white text-lg">➕</Text>
          <Text className="text-white font-semibold">إضافة منتج جديد</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(tabs)/merchant/edit-store" as any)}
          className="bg-surface border border-primary px-4 py-3 rounded-lg flex-row items-center justify-center gap-2"
        >
          <Text className="text-primary text-lg">✏️</Text>
          <Text className="text-primary font-semibold">تعديل بيانات المتجر</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderProducts = () => (
    <View className="gap-3">
      {products.length > 0 ? (
        products.map((product) => (
          <View
            key={product.id}
            className="bg-surface border border-border rounded-lg p-4 flex-row items-center justify-between"
          >
            <View className="flex-1">
              <Text className="text-sm font-semibold text-foreground">{product.name}</Text>
              <Text className="text-xs text-muted mt-1">{product.price} ر.س</Text>
              <View className="flex-row gap-3 mt-2">
                <Text className="text-xs text-muted">👁️ {(product as any).views || 0}</Text>
                <Text className="text-xs text-muted">👆 {(product as any).clicks || 0}</Text>
              </View>
            </View>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() =>
                  router.push(
                    `/(tabs)/merchant/edit-product/${product.id}` as any
                  )
                }
                className="bg-primary/10 p-2 rounded"
              >
                <Text className="text-primary">✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-error/10 p-2 rounded">
                <Text className="text-error">🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <View className="bg-surface rounded-lg p-6 items-center">
          <Text className="text-muted text-center">لا توجد منتجات حالياً</Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/merchant/add-product" as any)}
            className="bg-primary px-4 py-2 rounded-lg mt-4"
          >
            <Text className="text-white text-sm font-semibold">إضافة أول منتج</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderAnalytics = () => (
    <View className="gap-4">
      <View className="bg-surface border border-border rounded-lg p-4">
        <Text className="text-sm font-semibold text-foreground mb-3">الإحصائيات</Text>

        <View className="gap-3">
          <View className="flex-row items-center justify-between pb-3 border-b border-border">
            <Text className="text-xs text-muted">إجمالي المشاهدات</Text>
            <Text className="text-sm font-bold text-foreground">{totalViews}</Text>
          </View>

          <View className="flex-row items-center justify-between pb-3 border-b border-border">
            <Text className="text-xs text-muted">إجمالي النقرات</Text>
            <Text className="text-sm font-bold text-foreground">{totalClicks}</Text>
          </View>

          <View className="flex-row items-center justify-between pb-3 border-b border-border">
            <Text className="text-xs text-muted">متوسط المشاهدات لكل منتج</Text>
            <Text className="text-sm font-bold text-foreground">
              {totalProducts > 0 ? (totalViews / totalProducts).toFixed(1) : 0}
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-xs text-muted">معدل التحويل</Text>
            <Text className="text-sm font-bold text-foreground">
              {totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : 0}%
            </Text>
          </View>
        </View>
      </View>

      <View className="bg-primary/10 border border-primary rounded-lg p-4">
        <Text className="text-xs font-semibold text-primary mb-2">💡 نصيحة</Text>
        <Text className="text-xs text-foreground leading-relaxed">
          أضف صور عالية الجودة وأوصافاً مفصلة لمنتجاتك لزيادة المشاهدات والنقرات
        </Text>
      </View>
    </View>
  );

  return (
    <ScreenContainer className="p-4">
      <ScrollView>
        {/* Header */}
        <View className="mb-6 pb-4 border-b border-border">
          <Text className="text-2xl font-bold text-foreground">لوحة التحكم</Text>
          <Text className="text-xs text-muted mt-1">إدارة متجرك ومنتجاتك</Text>
        </View>

        {/* Tab Navigation */}
        <View className="flex-row gap-2 mb-6">
          {(["overview", "products", "analytics"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`flex-1 px-3 py-2 rounded-lg ${
                activeTab === tab
                  ? "bg-primary"
                  : "bg-surface border border-border"
              }`}
            >
              <Text
                className={`text-xs font-semibold text-center ${
                  activeTab === tab ? "text-white" : "text-foreground"
                }`}
              >
                {tab === "overview"
                  ? "نظرة عامة"
                  : tab === "products"
                  ? "المنتجات"
                  : "الإحصائيات"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {activeTab === "overview" && renderOverview()}
        {activeTab === "products" && renderProducts()}
        {activeTab === "analytics" && renderAnalytics()}
      </ScrollView>
    </ScreenContainer>
  );
}
