/**
 * Tab Bar Wrapper Component
 * Integrates custom tab bar with Expo Router Tabs
 */

import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { CustomTabBar } from "./custom-tab-bar";

export interface TabItem {
  name: string;
  icon: string;
  iconFocused: string;
  label: string;
}

interface TabBarWrapperProps {
  children: React.ReactNode;
  tabs: TabItem[];
  onTabChange?: (index: number) => void;
}

export function TabBarWrapper({
  children,
  tabs,
  onTabChange,
}: TabBarWrapperProps) {
  const route = useRoute();
  const [activeTab, setActiveTab] = useState(0);

  // Determine active tab based on current route
  React.useEffect(() => {
    const routeName = route.name as string;
    const tabIndex = tabs.findIndex((tab) => tab.name === routeName);
    if (tabIndex !== -1) {
      setActiveTab(tabIndex);
    }
  }, [route.name, tabs]);

  const handleTabPress = (index: number) => {
    setActiveTab(index);
    onTabChange?.(index);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>{children}</View>
      <CustomTabBar tabs={tabs} activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  content: {
    flex: 1,
  },
});
