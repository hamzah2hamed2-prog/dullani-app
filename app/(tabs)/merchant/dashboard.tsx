import { useState } from "react";
import { useRouter } from "expo-router";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

const { width } = Dimensions.get("window");

export default function MerchantDashboardScreen() {
  const router = useRouter();
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<"overview" | "analytics" | "reports">("overview");
  const [selectedPeriod, setSelectedPeriod] = useState<"daily" | "weekly" | "monthly">("daily");

  const { data: user } = trpc.auth.me.useQuery();
  
  const store = {
    id: 1,
    name: "متجري",
    address: "الرياض، السعودية",
    phone: "+966501234567",
    openingHours: "9:00 - 22:00",
  };

  const { data: products = [] } = trpc.products.getByStore.useQuery(
    { storeId: store.id }
  );

  // Mock analytics data
  const analyticsData = {
    daily: [
      { day: "السبت", views: 120, clicks: 45, sales: 8 },
      { day: "الأحد", views: 150, clicks: 52, sales: 12 },
      { day: "الاثنين", views: 100, clicks: 38, sales: 6 },
      { day: "الثلاثاء", views: 180, clicks: 65, sales: 15 },
      { day: "الأربعاء", views: 200, clicks: 72, sales: 18 },
      { day: "الخميس", views: 220, clicks: 80, sales: 20 },
      { day: "الجمعة", views: 250, clicks: 95, sales: 25 },
    ],
    weekly: [
      { week: "الأسبوع 1", views: 850, clicks: 310, sales: 75 },
      { week: "الأسبوع 2", views: 920, clicks: 340, sales: 88 },
      { week: "الأسبوع 3", views: 780, clicks: 285, sales: 65 },
      { week: "الأسبوع 4", views: 1050, clicks: 385, sales: 105 },
    ],
    monthly: [
      { month: "يناير", views: 3500, clicks: 1250, sales: 280 },
      { month: "فبراير", views: 3800, clicks: 1380, sales: 310 },
      { month: "مارس", views: 4200, clicks: 1520, sales: 345 },
    ],
  };

  const totalProducts = products.length;
  const totalViews = products.reduce((sum, p) => sum + ((p as any).views || 0), 0);
  const totalClicks = products.reduce((sum, p) => sum + ((p as any).clicks || 0), 0);
  const totalSales = 250;

  const renderChart = (data: any[]) => {
    const maxValue = Math.max(...data.map(d => d.views));
    return (
      <View style={styles.chartContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.chartBar}>
            <View style={styles.barLabel}>
              <Text style={[styles.barLabelText, { color: colors.muted }]}>
                {item.day || item.week || item.month}
              </Text>
            </View>
            <View style={styles.barWrapper}>
              <View
                style={[
                  styles.bar,
                  {
                    height: (item.views / maxValue) * 100,
                    backgroundColor: colors.primary,
                  },
                ]}
              />
            </View>
            <Text style={[styles.barValue, { color: colors.foreground }]}>
              {item.views}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderOverview = () => (
    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
      {/* Store Info Card */}
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.cardLabel, { color: colors.muted }]}>معلومات المتجر</Text>
        <Text style={[styles.storeName, { color: colors.foreground }]}>{store.name}</Text>
        <View style={styles.infoList}>
          {store?.address && (
            <Text style={[styles.infoItem, { color: colors.muted }]}>📍 {store.address}</Text>
          )}
          {store?.phone && (
            <Text style={[styles.infoItem, { color: colors.muted }]}>📞 {store.phone}</Text>
          )}
          {store?.openingHours && (
            <Text style={[styles.infoItem, { color: colors.muted }]}>🕐 {store.openingHours}</Text>
          )}
        </View>
      </View>

      {/* Statistics Cards */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.statLabel, { color: colors.muted }]}>إجمالي المنتجات</Text>
          <Text style={[styles.statValue, { color: colors.primary }]}>{totalProducts}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.statLabel, { color: colors.muted }]}>المشاهدات</Text>
          <Text style={[styles.statValue, { color: colors.primary }]}>{totalViews}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.statLabel, { color: colors.muted }]}>النقرات</Text>
          <Text style={[styles.statValue, { color: colors.primary }]}>{totalClicks}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.statLabel, { color: colors.muted }]}>المبيعات</Text>
          <Text style={[styles.statValue, { color: colors.primary }]}>{totalSales}</Text>
        </View>
      </View>

      {/* Conversion Rate */}
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.cardLabel, { color: colors.muted }]}>معدل التحويل</Text>
        <Text style={[styles.conversionRate, { color: colors.primary }]}>
          {totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : 0}%
        </Text>
        <Text style={[styles.conversionDesc, { color: colors.muted }]}>
          {totalClicks} نقرة من {totalViews} مشاهدة
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/(tabs)/merchant/add-product")}
        >
          <Text style={[styles.actionButtonText, { color: colors.background }]}>+ إضافة منتج</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 0.5 }]}
          onPress={() => router.push("/(tabs)/merchant/edit-store")}
        >
          <Text style={[styles.actionButtonText, { color: colors.primary }]}>تعديل المتجر</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  );

  const renderAnalytics = () => (
    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
      {/* Period Selector */}
      <View style={[styles.periodSelector, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        {(["daily", "weekly", "monthly"] as const).map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              {
                backgroundColor: selectedPeriod === period ? colors.primary : colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text
              style={[
                styles.periodButtonText,
                {
                  color: selectedPeriod === period ? colors.background : colors.foreground,
                },
              ]}
            >
              {period === "daily" && "يومي"}
              {period === "weekly" && "أسبوعي"}
              {period === "monthly" && "شهري"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Chart */}
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.cardLabel, { color: colors.muted }]}>المشاهدات</Text>
        {renderChart(analyticsData[selectedPeriod])}
      </View>

      {/* Detailed Analytics */}
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.cardLabel, { color: colors.muted }]}>التحليلات التفصيلية</Text>
        {analyticsData[selectedPeriod].map((item, index) => (
          <View key={index} style={[styles.analyticsRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.analyticsLabel, { color: colors.foreground }]}>
              {item.day || item.week || item.month}
            </Text>
            <View style={styles.analyticsValues}>
              <View style={styles.analyticsValue}>
                <Text style={[styles.analyticsValueLabel, { color: colors.muted }]}>المشاهدات</Text>
                <Text style={[styles.analyticsValueNumber, { color: colors.primary }]}>{item.views}</Text>
              </View>
              <View style={styles.analyticsValue}>
                <Text style={[styles.analyticsValueLabel, { color: colors.muted }]}>النقرات</Text>
                <Text style={[styles.analyticsValueNumber, { color: colors.primary }]}>{item.clicks}</Text>
              </View>
              <View style={styles.analyticsValue}>
                <Text style={[styles.analyticsValueLabel, { color: colors.muted }]}>المبيعات</Text>
                <Text style={[styles.analyticsValueNumber, { color: colors.primary }]}>{item.sales}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  );

  const renderReports = () => (
    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
      {/* Report Cards */}
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.reportHeader}>
          <Text style={[styles.reportTitle, { color: colors.foreground }]}>تقرير اليوم</Text>
          <Text style={[styles.reportDate, { color: colors.muted }]}>30 مارس 2026</Text>
        </View>
        <View style={[styles.reportContent, { borderTopColor: colors.border }]}>
          <View style={styles.reportRow}>
            <Text style={[styles.reportLabel, { color: colors.muted }]}>المشاهدات</Text>
            <Text style={[styles.reportValue, { color: colors.primary }]}>250</Text>
          </View>
          <View style={styles.reportRow}>
            <Text style={[styles.reportLabel, { color: colors.muted }]}>النقرات</Text>
            <Text style={[styles.reportValue, { color: colors.primary }]}>95</Text>
          </View>
          <View style={styles.reportRow}>
            <Text style={[styles.reportLabel, { color: colors.muted }]}>المبيعات</Text>
            <Text style={[styles.reportValue, { color: colors.primary }]}>25</Text>
          </View>
        </View>
      </View>

      {/* Weekly Report */}
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.reportHeader}>
          <Text style={[styles.reportTitle, { color: colors.foreground }]}>التقرير الأسبوعي</Text>
          <Text style={[styles.reportDate, { color: colors.muted }]}>24-30 مارس</Text>
        </View>
        <View style={[styles.reportContent, { borderTopColor: colors.border }]}>
          <View style={styles.reportRow}>
            <Text style={[styles.reportLabel, { color: colors.muted }]}>إجمالي المشاهدات</Text>
            <Text style={[styles.reportValue, { color: colors.primary }]}>1,050</Text>
          </View>
          <View style={styles.reportRow}>
            <Text style={[styles.reportLabel, { color: colors.muted }]}>إجمالي النقرات</Text>
            <Text style={[styles.reportValue, { color: colors.primary }]}>385</Text>
          </View>
          <View style={styles.reportRow}>
            <Text style={[styles.reportLabel, { color: colors.muted }]}>إجمالي المبيعات</Text>
            <Text style={[styles.reportValue, { color: colors.primary }]}>105</Text>
          </View>
        </View>
      </View>

      {/* Monthly Report */}
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.reportHeader}>
          <Text style={[styles.reportTitle, { color: colors.foreground }]}>التقرير الشهري</Text>
          <Text style={[styles.reportDate, { color: colors.muted }]}>مارس 2026</Text>
        </View>
        <View style={[styles.reportContent, { borderTopColor: colors.border }]}>
          <View style={styles.reportRow}>
            <Text style={[styles.reportLabel, { color: colors.muted }]}>إجمالي المشاهدات</Text>
            <Text style={[styles.reportValue, { color: colors.primary }]}>4,200</Text>
          </View>
          <View style={styles.reportRow}>
            <Text style={[styles.reportLabel, { color: colors.muted }]}>إجمالي النقرات</Text>
            <Text style={[styles.reportValue, { color: colors.primary }]}>1,520</Text>
          </View>
          <View style={styles.reportRow}>
            <Text style={[styles.reportLabel, { color: colors.muted }]}>إجمالي المبيعات</Text>
            <Text style={[styles.reportValue, { color: colors.primary }]}>345</Text>
          </View>
        </View>
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  );

  return (
    <ScreenContainer style={{ padding: 0 }}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>لوحة التحكم</Text>
      </View>

      {/* Tab Buttons */}
      <View style={[styles.tabButtons, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        {(["overview", "analytics", "reports"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              {
                borderBottomColor: activeTab === tab ? colors.primary : "transparent",
                borderBottomWidth: activeTab === tab ? 2 : 0,
              },
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabButtonText,
                {
                  color: activeTab === tab ? colors.primary : colors.muted,
                  fontWeight: activeTab === tab ? "600" : "400",
                },
              ]}
            >
              {tab === "overview" && "نظرة عامة"}
              {tab === "analytics" && "التحليلات"}
              {tab === "reports" && "التقارير"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {activeTab === "overview" && renderOverview()}
      {activeTab === "analytics" && renderAnalytics()}
      {activeTab === "reports" && renderReports()}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  tabButtons: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  tabButtonText: {
    fontSize: 13,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 8,
    borderWidth: 0.5,
  },
  cardLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  storeName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  infoList: {
    gap: 6,
  },
  infoItem: {
    fontSize: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 12,
  },
  statCard: {
    width: (width - 40) / 2,
    padding: 12,
    borderRadius: 8,
    borderWidth: 0.5,
  },
  statLabel: {
    fontSize: 11,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  conversionRate: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 8,
  },
  conversionDesc: {
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },
  periodSelector: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  periodButtonText: {
    fontSize: 12,
    fontWeight: "500",
  },
  chartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    height: 150,
    marginTop: 12,
  },
  chartBar: {
    alignItems: "center",
    flex: 1,
  },
  barLabel: {
    marginBottom: 4,
  },
  barLabelText: {
    fontSize: 10,
  },
  barWrapper: {
    width: 24,
    height: 120,
    justifyContent: "flex-end",
    marginBottom: 4,
  },
  bar: {
    width: "100%",
    borderRadius: 4,
  },
  barValue: {
    fontSize: 10,
    fontWeight: "600",
  },
  analyticsRow: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  analyticsLabel: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 8,
  },
  analyticsValues: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  analyticsValue: {
    alignItems: "center",
  },
  analyticsValueLabel: {
    fontSize: 10,
    marginBottom: 2,
  },
  analyticsValueNumber: {
    fontSize: 13,
    fontWeight: "600",
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  reportDate: {
    fontSize: 11,
  },
  reportContent: {
    paddingTop: 12,
    borderTopWidth: 0.5,
  },
  reportRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  reportLabel: {
    fontSize: 12,
  },
  reportValue: {
    fontSize: 13,
    fontWeight: "600",
  },
});
