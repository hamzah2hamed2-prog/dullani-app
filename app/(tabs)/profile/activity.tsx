import { ScrollView, View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function ActivityScreen() {
  const router = useRouter();
  const colors = useColors();
  const [activeTab, setActiveTab] = useState("recent");

  const activities = [
    {
      id: 1,
      type: "like",
      product: "فستان سهرة فاخر",
      store: "متجر الملابس الفاخرة",
      timestamp: "قبل ساعة",
      icon: "❤️",
    },
    {
      id: 2,
      type: "comment",
      product: "سماعات بلوتوث",
      store: "متجر الإلكترونيات",
      timestamp: "قبل 3 ساعات",
      icon: "💬",
    },
    {
      id: 3,
      type: "follow",
      product: "متجر الملابس الفاخرة",
      store: "متجر",
      timestamp: "أمس",
      icon: "👥",
    },
    {
      id: 4,
      type: "share",
      product: "وسادة فاخرة",
      store: "متجر المنزل",
      timestamp: "قبل يومين",
      icon: "📤",
    },
    {
      id: 5,
      type: "wishlist",
      product: "كريم العناية بالبشرة",
      store: "متجر الجمال",
      timestamp: "قبل 3 أيام",
      icon: "💔",
    },
  ];

  const stats = [
    { label: "الإعجابات", value: 342, icon: "❤️" },
    { label: "التعليقات", value: 89, icon: "💬" },
    { label: "المشاركات", value: 45, icon: "📤" },
    { label: "المتابعات", value: 1205, icon: "👥" },
  ];

  const renderActivityItem = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.activityItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <View style={[styles.activityIcon, { backgroundColor: colors.primary }]}>
        <Text style={{ fontSize: 16 }}>{item.icon}</Text>
      </View>
      <View style={styles.activityInfo}>
        <Text style={[styles.activityTitle, { color: colors.foreground }]}>
          {item.type === "like"
            ? "أعجبت بـ"
            : item.type === "comment"
            ? "علقت على"
            : item.type === "follow"
            ? "متابعة"
            : item.type === "share"
            ? "شاركت"
            : "أضفت للرغبات"}
        </Text>
        <Text style={[styles.activityProduct, { color: colors.muted }]} numberOfLines={1}>
          {item.product}
        </Text>
      </View>
      <Text style={[styles.activityTime, { color: colors.muted }]}>{item.timestamp}</Text>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer style={{ padding: 0 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
            <Text style={{ color: colors.foreground }}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>النشاط</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* Statistics Cards */}
        <View style={[styles.statsContainer, { backgroundColor: colors.background }]}>
          <FlatList
            data={stats}
            renderItem={({ item }) => (
              <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={{ fontSize: 24 }}>{item.icon}</Text>
                <Text style={[styles.statValue, { color: colors.foreground }]}>
                  {item.value.toLocaleString()}
                </Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>{item.label}</Text>
              </View>
            )}
            keyExtractor={(item) => item.label}
            numColumns={2}
            columnWrapperStyle={styles.statsRow}
            scrollEnabled={false}
            contentContainerStyle={styles.statsList}
          />
        </View>

        {/* Tabs */}
        <View style={[styles.tabsContainer, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <TouchableOpacity
            style={[
              styles.tab,
              {
                borderBottomColor: activeTab === "recent" ? colors.primary : "transparent",
                borderBottomWidth: activeTab === "recent" ? 2 : 0,
              },
            ]}
            onPress={() => setActiveTab("recent")}
          >
            <Text style={[styles.tabText, { color: activeTab === "recent" ? colors.primary : colors.muted }]}>
              النشاط الأخير
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              {
                borderBottomColor: activeTab === "trending" ? colors.primary : "transparent",
                borderBottomWidth: activeTab === "trending" ? 2 : 0,
              },
            ]}
            onPress={() => setActiveTab("trending")}
          >
            <Text style={[styles.tabText, { color: activeTab === "trending" ? colors.primary : colors.muted }]}>
              الأكثر رواجاً
            </Text>
          </TouchableOpacity>
        </View>

        {/* Activities List */}
        <View style={[styles.activitiesContainer, { backgroundColor: colors.background }]}>
          <FlatList
            data={activities}
            renderItem={renderActivityItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.activitiesList}
          />
        </View>

        {/* Insights Section */}
        <View style={[styles.insightsSection, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>📊 الرؤى</Text>
          <View style={[styles.insightCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.insightRow}>
              <Text style={[styles.insightLabel, { color: colors.foreground }]}>أكثر منتج تفاعلاً</Text>
              <Text style={[styles.insightValue, { color: colors.primary }]}>فستان سهرة فاخر</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.insightRow}>
              <Text style={[styles.insightLabel, { color: colors.foreground }]}>أكثر متجر متابعة</Text>
              <Text style={[styles.insightValue, { color: colors.primary }]}>متجر الملابس الفاخرة</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.insightRow}>
              <Text style={[styles.insightLabel, { color: colors.foreground }]}>الفئة المفضلة</Text>
              <Text style={[styles.insightValue, { color: colors.primary }]}>الموضة</Text>
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
  statsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  statsList: {
    gap: 12,
  },
  statsRow: {
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 0.5,
    padding: 16,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    marginTop: 4,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
  },
  activitiesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  activitiesList: {
    gap: 8,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 0.5,
    padding: 12,
    gap: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 12,
    fontWeight: "600",
  },
  activityProduct: {
    fontSize: 11,
    marginTop: 2,
  },
  activityTime: {
    fontSize: 10,
  },
  insightsSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  insightCard: {
    borderRadius: 8,
    borderWidth: 0.5,
    overflow: "hidden",
  },
  insightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  insightLabel: {
    fontSize: 12,
  },
  insightValue: {
    fontSize: 12,
    fontWeight: "600",
  },
  divider: {
    height: 0.5,
  },
});
