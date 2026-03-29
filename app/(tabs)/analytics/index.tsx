import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

const { width } = Dimensions.get("window");

export default function AnalyticsScreen() {
  const router = useRouter();
  const colors = useColors();
  const [timeRange, setTimeRange] = useState("week");

  const stats = {
    views: 2543,
    likes: 342,
    comments: 89,
    shares: 45,
    followers: 1205,
    engagement: 15.8,
  };

  const chartData = [
    { day: "السبت", value: 320 },
    { day: "الأحد", value: 280 },
    { day: "الاثنين", value: 450 },
    { day: "الثلاثاء", value: 380 },
    { day: "الأربعاء", value: 520 },
    { day: "الخميس", value: 480 },
    { day: "الجمعة", value: 610 },
  ];

  const maxValue = Math.max(...chartData.map((d) => d.value));

  return (
    <ScreenContainer style={{ padding: 0 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
            <Text style={{ color: colors.foreground }}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>الإحصائيات</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* Time Range Selector */}
        <View style={[styles.timeRangeContainer, { backgroundColor: colors.background }]}>
          {["day", "week", "month"].map((range) => (
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

        {/* Stats Cards */}
        <View style={[styles.statsContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.statHeader}>
              <Text style={[styles.statLabel, { color: colors.muted }]}>المشاهدات</Text>
              <Text style={{ color: colors.primary }}>👁️</Text>
            </View>
            <Text style={[styles.statValue, { color: colors.foreground }]}>{stats.views.toLocaleString()}</Text>
            <Text style={[styles.statChange, { color: colors.success }]}>↑ 12% من الأسبوع الماضي</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.statHeader}>
              <Text style={[styles.statLabel, { color: colors.muted }]}>الإعجابات</Text>
              <Text style={{ color: colors.primary }}>❤️</Text>
            </View>
            <Text style={[styles.statValue, { color: colors.foreground }]}>{stats.likes}</Text>
            <Text style={[styles.statChange, { color: colors.success }]}>↑ 8% من الأسبوع الماضي</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.statHeader}>
              <Text style={[styles.statLabel, { color: colors.muted }]}>التعليقات</Text>
              <Text style={{ color: colors.primary }}>💬</Text>
            </View>
            <Text style={[styles.statValue, { color: colors.foreground }]}>{stats.comments}</Text>
            <Text style={[styles.statChange, { color: colors.success }]}>↑ 5% من الأسبوع الماضي</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.statHeader}>
              <Text style={[styles.statLabel, { color: colors.muted }]}>المشاركات</Text>
              <Text style={{ color: colors.primary }}>📤</Text>
            </View>
            <Text style={[styles.statValue, { color: colors.foreground }]}>{stats.shares}</Text>
            <Text style={[styles.statChange, { color: colors.success }]}>↑ 3% من الأسبوع الماضي</Text>
          </View>
        </View>

        {/* Chart Section */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>المشاهدات اليومية</Text>
          <View style={[styles.chartContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.chart}>
              {chartData.map((item, index) => (
                <View key={index} style={styles.chartBar}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: (item.value / maxValue) * 150,
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

        {/* Engagement Section */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>معدل التفاعل</Text>
          <View style={[styles.engagementCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.engagementRow}>
              <Text style={[styles.engagementLabel, { color: colors.foreground }]}>معدل التفاعل الإجمالي</Text>
              <Text style={[styles.engagementValue, { color: colors.primary }]}>{stats.engagement}%</Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${stats.engagement}%`,
                    backgroundColor: colors.primary,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Followers Section */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>المتابعون</Text>
          <View style={[styles.followersCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.followerRow}>
              <View>
                <Text style={[styles.followerLabel, { color: colors.muted }]}>إجمالي المتابعين</Text>
                <Text style={[styles.followerValue, { color: colors.foreground }]}>
                  {stats.followers.toLocaleString()}
                </Text>
              </View>
              <Text style={{ color: colors.success }}>↑ 45 متابع جديد</Text>
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
    borderRadius: 6,
    borderWidth: 0.5,
    alignItems: "center",
  },
  timeRangeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  statCard: {
    borderRadius: 8,
    borderWidth: 0.5,
    padding: 12,
    marginBottom: 8,
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statChange: {
    fontSize: 11,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  chartContainer: {
    borderRadius: 8,
    borderWidth: 0.5,
    padding: 16,
  },
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    height: 200,
  },
  chartBar: {
    alignItems: "center",
    flex: 1,
  },
  bar: {
    width: 24,
    borderRadius: 4,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 10,
    textAlign: "center",
  },
  engagementCard: {
    borderRadius: 8,
    borderWidth: 0.5,
    padding: 12,
  },
  engagementRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  engagementLabel: {
    fontSize: 13,
  },
  engagementValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  followersCard: {
    borderRadius: 8,
    borderWidth: 0.5,
    padding: 12,
  },
  followerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  followerLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  followerValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
