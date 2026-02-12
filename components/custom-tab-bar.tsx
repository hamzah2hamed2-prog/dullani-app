import React from "react";
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";

interface TabBarItem {
  name: string;
  label: string;
  icon: string;
  route: any;
  badge?: number;
}

const TAB_ITEMS: TabBarItem[] = [
  { name: "home", label: "الاستكشاف", icon: "home", route: "/" },
  { name: "search", label: "البحث", icon: "search", route: "/search" },
  { name: "wishlist", label: "المفضلة", icon: "favorite", route: "/wishlist" },
  { name: "profile", label: "الملف", icon: "account-circle", route: "/profile" },
  { name: "notifications", label: "إشعارات", icon: "notifications", route: "/notifications", badge: 3 },
  { name: "settings", label: "الإعدادات", icon: "settings", route: "/settings" },
  { name: "help", label: "مساعدة", icon: "help", route: "/help" },
  { name: "share", label: "مشاركة", icon: "share", route: "/share" },
];

export function CustomTabBar() {
  const colors = useColors();
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState("home");

  const handleTabPress = (item: TabBarItem) => {
    setActiveTab(item.name);
    // Only navigate to existing routes
    if (["home", "search", "wishlist", "profile"].includes(item.name)) {
      router.push(item.route);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {TAB_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.name}
            style={styles.tabItem}
            onPress={() => handleTabPress(item)}
          >
            <View
              style={[
                styles.iconContainer,
                activeTab === item.name && {
                  backgroundColor: colors.tint,
                },
              ]}
            >
              <MaterialIcons
                name={item.icon as any}
                size={20}
                color={activeTab === item.name ? colors.background : colors.muted}
              />
              {item.badge && (
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: colors.error },
                  ]}
                >
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.label,
                {
                  color: activeTab === item.name ? colors.tint : colors.muted,
                  fontSize: 9,
                },
              ]}
              numberOfLines={1}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  scrollContent: {
    paddingHorizontal: 4,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    minWidth: 50,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  label: {
    marginTop: 4,
    fontWeight: "600",
  },
});
