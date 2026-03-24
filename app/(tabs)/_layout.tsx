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
        tabBarActiveTintColor: colors.foreground,
        tabBarInactiveTintColor: colors.muted,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: false, // Instagram style: no labels
        tabBarStyle: {
          height: 50 + bottomPadding,
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
          paddingBottom: bottomPadding,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name={focused ? "home" : "home"}
              size={30}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name={focused ? "search" : "search"}
              size={30}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name={focused ? "favorite" : "favorite-border"}
              size={30}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="following"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name={focused ? "people" : "people-outline"}
              size={30}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name={focused ? "account-circle" : "account-circle-outline"}
              size={30}
              color={color}
            />
          ),
        }}
      />
      
      {/* Hidden merchant screens from tab bar but accessible via navigation */}
      <Tabs.Screen
        name="merchant/dashboard"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="merchant/add-product"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="merchant/edit-store"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="merchant/edit-product/[id]"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="product/[id]"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="store/[id]"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="store/[id]/map"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="image-search"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="notifications"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="profile-edit"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="profile-setup"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="search-results"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="stores-map"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="product/[id]/comments"
        options={{ href: null }}
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
