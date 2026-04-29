import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, StyleSheet, Platform } from "react-native";
import { useColors } from "@/hooks/use-colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { CustomTabBar } from "@/components/custom-tab-bar";
import { useState } from "react";

export default function TabLayout() {
  const colors = useColors();
  const [activeTab, setActiveTab] = useState(0);

  // Tab configuration
  const tabs = [
    {
      name: "index",
      icon: "home",
      iconFocused: "home",
      label: "الرئيسية",
    },
    {
      name: "search",
      icon: "search",
      iconFocused: "search",
      label: "بحث",
    },
    {
      name: "wishlist",
      icon: "favorite-border",
      iconFocused: "favorite",
      label: "المفضلة",
    },
    {
      name: "following",
      icon: "people-outline",
      iconFocused: "people",
      label: "المتابعون",
    },
    {
      name: "profile",
      icon: "account-circle",
      iconFocused: "account-circle",
      label: "الملف",
    },
  ];

  const handleTabPress = (index: number) => {
    setActiveTab(index);
    // Navigate to the tab
    const tabNames = ["index", "search", "wishlist", "following", "profile"];
    // This will be handled by Tabs component
  };

  const tabConfig = [
    {
      name: "index",
      icon: "home",
      iconFocused: "home",
      label: "الرئيسية",
    },
    {
      name: "search",
      icon: "search",
      iconFocused: "search",
      label: "بحث",
    },
    {
      name: "wishlist",
      icon: "favorite-border",
      iconFocused: "favorite",
      label: "المفضلة",
    },
    {
      name: "following",
      icon: "people-outline",
      iconFocused: "people",
      label: "المتابعون",
    },
    {
      name: "profile",
      icon: "account-circle",
      iconFocused: "account-circle",
      label: "الملف",
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            display: "none", // Hide default tab bar
          },
        }}
        screenListeners={{
          state: (e) => {
            // Update active tab based on route
            const tabNames = ["index", "search", "wishlist", "following", "profile"];
            const currentRoute = e.data.state.routes[e.data.state.index]?.name;
            const tabIndex = tabNames.indexOf(currentRoute);
            if (tabIndex !== -1) {
              setActiveTab(tabIndex);
            }
          },
        }}
      >
        {/* Main tab screens */}
        <Tabs.Screen name="index" />
        <Tabs.Screen name="search" />
        <Tabs.Screen name="wishlist" />
        <Tabs.Screen name="following" />
        <Tabs.Screen name="profile" />
        
        {/* Additional screens (hidden from tab bar) */}
        <Tabs.Screen name="merchant/dashboard" options={{ href: null }} />
        <Tabs.Screen name="merchant/add-product" options={{ href: null }} />
        <Tabs.Screen name="merchant/edit-store" options={{ href: null }} />
        <Tabs.Screen name="merchant/edit-product/[id]" options={{ href: null }} />
        <Tabs.Screen name="product/[id]" options={{ href: null }} />
        <Tabs.Screen name="store/[id]" options={{ href: null }} />
        <Tabs.Screen name="store/[id]/map" options={{ href: null }} />
        <Tabs.Screen name="image-search" options={{ href: null }} />
        <Tabs.Screen name="notifications" options={{ href: null }} />
        <Tabs.Screen name="profile-edit" options={{ href: null }} />
        <Tabs.Screen name="profile-setup" options={{ href: null }} />
        <Tabs.Screen name="search-results" options={{ href: null }} />
        <Tabs.Screen name="stores-map" options={{ href: null }} />
        <Tabs.Screen name="product/[id]/comments" options={{ href: null }} />
      </Tabs>

      {/* Custom Tab Bar */}
      <CustomTabBar
        tabs={tabConfig}
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
    </View>
  );
}


