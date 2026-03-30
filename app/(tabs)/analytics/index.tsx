import { ScrollView, View, Text, TouchableOpacity, Dimensions, StyleSheet, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAnalytics } from "@/hooks/use-analytics";
import { useAuth } from "@/hooks/use-auth";
import { IconSymbol } from "@/components/ui/icon-symbol";

const { width } = Dimensions.get("window");

export default function AnalyticsScreen() {
  const router = useRouter();
  const colors = useColors();
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month">("week");

  // Fetch analytics data from API
  const { data: analyticsData, isLoading } = useAnalytics(user?.id, timeRange);

  const stats = analyticsData || {
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    followers: 0,
    engagement: 0,
  };

  const chartData = analyticsData?.chartData || [
    { day: "السبت", value: 0 },
    { day: "الأحد", value: 0 },
    { day: "الاثنين", value: 0 },
    { day: "الثلاثاء", value: 0 },
    { day: "الأربعاء", value: 0 },
    { day: "الخميس", value: 0 },
    { day: "الجمعة", value: 0 },
  ];

  const maxValue = Math.max(...chartData.map((d) => d.value), 1);

  const renderStatCard = (label: string, value: number, icon: string) => (
    <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.statIcon, { backgroundColor: colors.primary }]}>
        <IconSymbol name={icon as any} size={20} color={colors.background} />
      </View>
      <View style={styles.statContent}>
        <Text style={[styles.statLabel, { color: colors.muted }]}>{label}</Text>
        <Text style={[styles.statValue, { color: colors.foreground }]}>{value.toLocaleString("ar-SA")}</Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <ScreenContainer style={{ alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={{ padding: 0 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
            <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>الإحصائيات</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* Time Range Selector */}
        <View style={[styles.timeRangeContainer, { backgroundColor: colors.background }]}>
          {(["day", "week", "month"] as const).map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.timeRangeButton,
                {
                  backgroundColor: timeRange === range ? colors.primary : colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setTimeRange(range)}
            >
              <Text
                style={[
                  styles.timeRangeText,
                  {
                    color: timeRange === range ? colors.background : colors.foreground,
                  },
                ]}
              >
                {range === "day" ? "يوم" : range === "week" ? "أسبوع" : "شهر"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Grid */}
        <View style={[styles.statsGrid, { backgroundColor: colors.background }]}>
          {renderStatCard("المشاهدات", stats.views, "eye.fill")}
          {renderStatCard("الإعجابات", stats.likes, "heart.fill")}
          {renderStatCard("التعليقات", stats.comments, "bubble.right.fill")}
          {renderStatCard("المشاركات", stats.shares, "square.and.arrow.up")}
        </View>

        {/* Chart Section */}
        <View style={[styles.chartSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.chartTitle, { color: colors.foreground }]}>المشاهدات اليومية</Text>

          <View style={styles.chartContainer}>
            <View style={styles.chart}>
              {chartData.map((item, index) => (
                <View key={index} style={styles.chartBar}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: (item.value / maxValue) * 120,
                        backgroundColor: colors.primary,
                      },
                    ]}
                  />
                  <Text style={[styles.barLabel, { color: colors.muted }]}>{item.day}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Engagement Stats */}
        <View style={[styles.engagementSection, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>ملخص الأداء</Text>

          <View style={[styles.engagementCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.engagementRow}>
              <View>
                <Text style={[styles.engagementLabel, { color: colors.muted }]}>معدل التفاعل</Text>
                <Text style={[styles.engagementValue, { color: colors.primary }]}>{stats.engagement.toFixed(1)}%</Text>
              </View>
              <View style={[styles.engagementIcon, { backgroundColor: colors.primary }]}>
                <IconSymbol name="chart.pie.fill" size={24} color={colors.background} />
              </View>
            </View>
          </View>

          <View style={[styles.engagementCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.engagementRow}>
              <View>
                <Text style={[styles.engagementLabel, { color: colors.muted }]}>المتابعون</Text>
                <Text style={[styles.engagementValue, { color: colors.primary }]}>
                  {stats.followers.toLocaleString("ar-SA")}
                </Text>
              </View>
              <View style={[styles.engagementIcon, { backgroundColor: colors.primary }]}>
                <IconSymbol name="person.2.fill" size={24} color={colors.background} />
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  timeRangeContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 0.5,
    alignItems: "center",
  },
  timeRangeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statsGrid: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  statCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 0.5,
    gap: 12,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
  },
  chartSection: {
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 0.5,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 16,
  },
  chartContainer: {
    height: 180,
    justifyContent: "flex-end",
  },
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    height: 150,
  },
  chartBar: {
    alignItems: "center",
    flex: 1,
    gap: 8,
  },
  bar: {
    width: (width - 64) / 7 - 8,
    borderRadius: 4,
  },
  barLabel: {
    fontSize: 10,
    textAlign: "center",
  },
  engagementSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  engagementCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 0.5,
  },
  engagementRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  engagementLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  engagementValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  engagementIcon: {
    width: 50,
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
