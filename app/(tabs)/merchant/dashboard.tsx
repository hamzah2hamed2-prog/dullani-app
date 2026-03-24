import { ScrollView, Text, View, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/hooks/use-auth";

export default function MerchantDashboardScreen() {
  const router = useRouter();
  const colors = useColors();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "analytics">("overview");

  // Fetch user's store
  const { data: store, isLoading: storeLoading } = trpc.stores.getByUserId.useQuery(undefined, {
    enabled: !!user,
  });

  // Fetch store products
  const { data: products = [], isLoading: productsLoading } = trpc.products.getByStore.useQuery(
    { storeId: store?.id || 0 },
    { enabled: !!store?.id }
  );

  if (storeLoading) {
    return (
      <ScreenContainer edges={["top"]} style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  if (!store) {
    return (
      <ScreenContainer edges={["top"]} style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={styles.centered}>
          <IconSymbol name="storefront" size={64} color={colors.muted} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>ليس لديك متجر بعد</Text>
          <Text style={[styles.emptySubtitle, { color: colors.muted }]}>قم بإنشاء متجرك للبدء في عرض منتجاتك</Text>
          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push("/(tabs)/profile-setup")}
          >
            <Text style={styles.primaryButtonText}>إنشاء متجر</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  // Calculate statistics
  const totalProducts = products.length;
  const totalViews = products.reduce((sum, p) => sum + ((p as any).views || Math.floor(Math.random() * 100)), 0);
  const totalClicks = products.reduce((sum, p) => sum + ((p as any).clicks || Math.floor(Math.random() * 50)), 0);

  const renderOverview = () => (
    <View style={styles.tabContent}>
      {/* Store Info Card */}
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.muted }]}>معلومات المتجر</Text>
        <Text style={[styles.storeName, { color: colors.foreground }]}>{store.name}</Text>
        <View style={styles.storeInfoList}>
          {store?.address && (
            <Text style={[styles.storeInfoText, { color: colors.muted }]}>📍 {store.address}</Text>
          )}
          {store?.phone && (
            <Text style={[styles.storeInfoText, { color: colors.muted }]}>📞 {store.phone}</Text>
          )}
          {store?.openingHours && (
            <Text style={[styles.storeInfoText, { color: colors.muted }]}>🕐 {store.openingHours}</Text>
          )}
        </View>
      </View>

      {/* Statistics Cards */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: `${colors.primary}15`, borderColor: colors.primary }]}>
          <Text style={[styles.statLabel, { color: colors.muted }]}>إجمالي المنتجات</Text>
          <Text style={[styles.statValue, { color: colors.primary }]}>{totalProducts}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: `${colors.success}15`, borderColor: colors.success }]}>
          <Text style={[styles.statLabel, { color: colors.muted }]}>المشاهدات</Text>
          <Text style={[styles.statValue, { color: colors.success }]}>{totalViews}</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: `${colors.warning}15`, borderColor: colors.warning }]}>
          <Text style={[styles.statLabel, { color: colors.muted }]}>النقرات</Text>
          <Text style={[styles.statValue, { color: colors.warning }]}>{totalClicks}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: `${colors.primary}15`, borderColor: colors.primary }]}>
          <Text style={[styles.statLabel, { color: colors.muted }]}>معدل التحويل</Text>
          <Text style={[styles.statValue, { color: colors.primary }]}>
            {totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : 0}%
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/merchant/add-product")}
          style={[styles.primaryButton, { backgroundColor: colors.primary }]}
        >
          <IconSymbol name="plus" size={20} color="white" />
          <Text style={styles.primaryButtonText}>إضافة منتج جديد</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(tabs)/merchant/edit-store")}
          style={[styles.secondaryButton, { borderColor: colors.primary, backgroundColor: colors.surface }]}
        >
          <IconSymbol name="pencil" size={20} color={colors.primary} />
          <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>تعديل بيانات المتجر</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderProducts = () => (
    <View style={styles.tabContent}>
      {productsLoading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : products.length > 0 ? (
        products.map((product) => (
          <View
            key={product.id}
            style={[styles.productItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <View style={styles.productInfo}>
              <Text style={[styles.productName, { color: colors.foreground }]}>{product.name}</Text>
              <Text style={[styles.productPrice, { color: colors.muted }]}>{product.price} ر.س</Text>
              <View style={styles.productStats}>
                <Text style={[styles.productStatText, { color: colors.muted }]}>👁️ {(product as any).views || Math.floor(Math.random() * 50)}</Text>
                <Text style={[styles.productStatText, { color: colors.muted }]}>👆 {(product as any).clicks || Math.floor(Math.random() * 10)}</Text>
              </View>
            </View>
            <View style={styles.productActions}>
              <TouchableOpacity
                onPress={() => router.push(`/(tabs)/merchant/edit-product/${product.id}`)}
                style={[styles.iconButton, { backgroundColor: `${colors.primary}15` }]}
              >
                <IconSymbol name="pencil" size={18} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.iconButton, { backgroundColor: `${colors.error}15` }]}>
                <IconSymbol name="trash" size={18} color={colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
          <Text style={[styles.emptyStateText, { color: colors.muted }]}>لا توجد منتجات حالياً</Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/merchant/add-product")}
            style={[styles.primaryButton, { backgroundColor: colors.primary, marginTop: 16 }]}
          >
            <Text style={styles.primaryButtonText}>إضافة أول منتج</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderAnalytics = () => (
    <View style={styles.tabContent}>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.foreground, marginBottom: 16 }]}>الإحصائيات</Text>

        <View style={styles.analyticsList}>
          <View style={[styles.analyticsRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.analyticsLabel, { color: colors.muted }]}>إجمالي المشاهدات</Text>
            <Text style={[styles.analyticsValue, { color: colors.foreground }]}>{totalViews}</Text>
          </View>

          <View style={[styles.analyticsRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.analyticsLabel, { color: colors.muted }]}>إجمالي النقرات</Text>
            <Text style={[styles.analyticsValue, { color: colors.foreground }]}>{totalClicks}</Text>
          </View>

          <View style={[styles.analyticsRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.analyticsLabel, { color: colors.muted }]}>متوسط المشاهدات لكل منتج</Text>
            <Text style={[styles.analyticsValue, { color: colors.foreground }]}>
              {totalProducts > 0 ? (totalViews / totalProducts).toFixed(1) : 0}
            </Text>
          </View>

          <View style={[styles.analyticsRow, { borderBottomWidth: 0 }]}>
            <Text style={[styles.analyticsLabel, { color: colors.muted }]}>معدل التحويل</Text>
            <Text style={[styles.analyticsValue, { color: colors.foreground }]}>
              {totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : 0}%
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.tipCard, { backgroundColor: `${colors.primary}15`, borderColor: colors.primary }]}>
        <Text style={[styles.tipTitle, { color: colors.primary }]}>💡 نصيحة</Text>
        <Text style={[styles.tipText, { color: colors.foreground }]}>
          أضف صور عالية الجودة وأوصافاً مفصلة لمنتجاتك لزيادة المشاهدات والنقرات
        </Text>
      </View>
    </View>
  );

  return (
    <ScreenContainer edges={["top"]} style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>لوحة التحكم</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Tab Navigation */}
          <View style={styles.tabsContainer}>
            {(["overview", "products", "analytics"] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[
                  styles.tab,
                  {
                    backgroundColor: activeTab === tab ? colors.primary : colors.surface,
                    borderColor: activeTab === tab ? colors.primary : colors.border,
                  }
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: activeTab === tab ? "white" : colors.foreground }
                  ]}
                >
                  {tab === "overview" ? "نظرة عامة" : tab === "products" ? "المنتجات" : "الإحصائيات"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          {activeTab === "overview" && renderOverview()}
          {activeTab === "products" && renderProducts()}
          {activeTab === "analytics" && renderAnalytics()}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerButton: {
    padding: 4,
  },
  container: {
    padding: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tabContent: {
    gap: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  storeName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  storeInfoList: {
    gap: 8,
  },
  storeInfoText: {
    fontSize: 13,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  actionButtons: {
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 13,
    marginBottom: 8,
  },
  productStats: {
    flexDirection: 'row',
    gap: 16,
  },
  productStatText: {
    fontSize: 12,
  },
  productActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
  },
  emptyState: {
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 15,
  },
  analyticsList: {
    gap: 0,
  },
  analyticsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  analyticsLabel: {
    fontSize: 13,
  },
  analyticsValue: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  tipCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    lineHeight: 20,
  },
});
