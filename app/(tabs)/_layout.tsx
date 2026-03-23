import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, StyleSheet } from "react-native";
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
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingTop: 10,
          paddingBottom: bottomPadding + 4,
          height: 85 + bottomPadding,
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          elevation: 20,
          shadowColor: "#000",
          shadowOpacity: 0.15,
          shadowRadius: 15,
          shadowOffset: { width: 0, height: -8 },
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 6,
          marginBottom: 2,
          letterSpacing: 0.3,
        },
        tabBarItemStyle: {
          paddingVertical: 8,
          paddingHorizontal: 0,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
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
                  focused && { backgroundColor: color + "20" },
                ]}
              >
                <MaterialIcons
                  name="home"
                  size={28}
                  color={color}
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
                  focused && { backgroundColor: color + "20" },
                ]}
              >
                <MaterialIcons
                  name="search"
                  size={28}
                  color={color}
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
                  focused && { backgroundColor: color + "20" },
                ]}
              >
                <MaterialIcons
                  name={focused ? "favorite" : "favorite-border"}
                  size={28}
                  color={color}
                />
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="following"
        options={{
          title: "المتابعات",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabItem}>
              <View
                style={[
                  styles.iconContainer,
                  focused && { backgroundColor: color + "20" },
                ]}
              >
                <MaterialIcons
                  name="people"
                  size={28}
                  color={color}
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
                  focused && { backgroundColor: color + "20" },
                ]}
              >
                <MaterialIcons
                  name="account-circle"
                  size={28}
                  color={color}
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
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
});
