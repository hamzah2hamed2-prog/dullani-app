import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, StyleSheet } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { Platform } from "react-native";
import { useColors } from "@/hooks/use-colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface TabIconProps {
  color: string;
  focused: boolean;
  label: string;
}

function TabIcon({ color, focused, label }: TabIconProps) {
  return (
    <View style={styles.iconWrapper}>
      <View
        style={[
          styles.iconBackground,
          focused && { backgroundColor: color + "20" },
        ]}
      >
        {label === "الاستكشاف" && (
          <MaterialIcons
            name={focused ? "home" : "home"}
            size={26}
            color={color}
          />
        )}
        {label === "البحث" && (
          <MaterialIcons name="search" size={26} color={color} />
        )}
        {label === "المفضلة" && (
          <MaterialIcons
            name={focused ? "favorite" : "favorite-border"}
            size={26}
            color={color}
          />
        )}
        {label === "الملف الشخصي" && (
          <MaterialIcons name="account-circle" size={26} color={color} />
        )}
      </View>
    </View>
  );
}

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 70 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.muted,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingTop: 12,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          elevation: 12,
          shadowColor: colors.foreground,
          shadowOpacity: 0.15,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: -4 },
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          marginTop: 6,
          letterSpacing: 0.5,
        },
        tabBarItemStyle: {
          paddingVertical: 8,
          paddingHorizontal: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "الاستكشاف",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused} label="الاستكشاف" />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "البحث",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused} label="البحث" />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: "المفضلة",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused} label="المفضلة" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "الملف الشخصي",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused} label="الملف الشخصي" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconBackground: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
