import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text, StyleSheet } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { Platform } from "react-native";
import { useColors } from "@/hooks/use-colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.muted,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: bottomPadding,
          height: 80 + bottomPadding,
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1.5,
          elevation: 15,
          shadowColor: "#000",
          shadowOpacity: 0.12,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: -5 },
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
          marginTop: 4,
          marginBottom: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 8,
          paddingHorizontal: 0,
          flex: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "الاستكشاف",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabItem}>
              <View
                style={[
                  styles.iconContainer,
                  focused && { backgroundColor: color + "15" },
                ]}
              >
                <MaterialIcons
                  name="home"
                  size={32}
                  color={color}
                  style={{ fontWeight: "bold" }}
                />
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "البحث",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabItem}>
              <View
                style={[
                  styles.iconContainer,
                  focused && { backgroundColor: color + "15" },
                ]}
              >
                <MaterialIcons
                  name="search"
                  size={32}
                  color={color}
                  style={{ fontWeight: "bold" }}
                />
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: "المفضلة",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabItem}>
              <View
                style={[
                  styles.iconContainer,
                  focused && { backgroundColor: color + "15" },
                ]}
              >
                <MaterialIcons
                  name={focused ? "favorite" : "favorite-border"}
                  size={32}
                  color={color}
                  style={{ fontWeight: "bold" }}
                />
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "الملف الشخصي",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabItem}>
              <View
                style={[
                  styles.iconContainer,
                  focused && { backgroundColor: color + "15" },
                ]}
              >
                <MaterialIcons
                  name="account-circle"
                  size={32}
                  color={color}
                  style={{ fontWeight: "bold" }}
                />
              </View>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
});
