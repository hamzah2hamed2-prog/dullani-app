/**
 * Custom Tab Bar Component
 * Modern, animated bottom navigation with enhanced UX
 */

import React, { useEffect } from "react";
import { View, Pressable, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/use-colors";

export interface TabItem {
  name: string;
  icon: string;
  iconFocused: string;
  label: string;
}

interface CustomTabBarProps {
  tabs: TabItem[];
  activeTab: number;
  onTabPress: (index: number) => void;
}

export function CustomTabBar({
  tabs,
  activeTab,
  onTabPress,
}: CustomTabBarProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);

  // Animated values for each tab
  const animatedScales = tabs.map(() => useSharedValue(1));
  const animatedOpacities = tabs.map(() => useSharedValue(0.6));

  useEffect(() => {
    // Animate active tab
    animatedScales[activeTab].value = withSpring(1.1, {
      damping: 10,
      mass: 1,
      overshootClamping: false,
    });
    animatedOpacities[activeTab].value = withSpring(1, {
      damping: 10,
      mass: 1,
    });

    // Reset other tabs
    tabs.forEach((_, index) => {
      if (index !== activeTab) {
        animatedScales[index].value = withSpring(1, {
          damping: 10,
          mass: 1,
        });
        animatedOpacities[index].value = withSpring(0.6, {
          damping: 10,
          mass: 1,
        });
      }
    });
  }, [activeTab]);

  const handleTabPress = (index: number) => {
    if (index !== activeTab) {
      // Haptic feedback
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onTabPress(index);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          paddingBottom: bottomPadding,
          height: 70 + bottomPadding,
        },
      ]}
    >
      {/* Background gradient effect */}
      <View
        style={[
          styles.backgroundGradient,
          {
            backgroundColor: colors.surface,
            opacity: 0.3,
          },
        ]}
      />

      {/* Tab items */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab, index) => (
          <TabBarItem
            key={tab.name}
            tab={tab}
            isActive={index === activeTab}
            onPress={() => handleTabPress(index)}
            animatedScale={animatedScales[index]}
            animatedOpacity={animatedOpacities[index]}
            colors={colors}
          />
        ))}
      </View>

      {/* Bottom indicator line */}
      <View
        style={[
          styles.indicatorLine,
          {
            backgroundColor: colors.primary,
            opacity: 0.2,
          },
        ]}
      />
    </View>
  );
}

interface TabBarItemProps {
  tab: TabItem;
  isActive: boolean;
  onPress: () => void;
  animatedScale: Animated.Shared<number>;
  animatedOpacity: Animated.Shared<number>;
  colors: any;
}

function TabBarItem({
  tab,
  isActive,
  onPress,
  animatedScale,
  animatedOpacity,
  colors,
}: TabBarItemProps) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: animatedScale.value }],
      opacity: animatedOpacity.value,
    };
  });

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tabItem,
        pressed && { opacity: 0.7 },
      ]}
    >
      <Animated.View style={animatedStyle}>
        <View
          style={[
            styles.iconContainer,
            isActive && {
              backgroundColor: colors.primary,
              opacity: 0.15,
            },
          ]}
        >
          <MaterialIcons
            name={isActive ? tab.iconFocused : tab.icon}
            size={28}
            color={isActive ? colors.primary : colors.muted}
          />
        </View>
      </Animated.View>

      {/* Label for active tab */}
      {isActive && (
        <Animated.Text
          style={[
            styles.label,
            {
              color: colors.primary,
              fontSize: 11,
              marginTop: 2,
            },
          ]}
        >
          {tab.label}
        </Animated.Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    position: "relative",
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  tabsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  label: {
    fontWeight: "600",
    textAlign: "center",
    maxWidth: 50,
  },
  indicatorLine: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
  },
});
