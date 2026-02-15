import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { IconSymbol } from "./ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface ScreenHeaderProps {
  title: string;
  showBackButton?: boolean;
  rightAction?: {
    icon: string;
    onPress: () => void;
  };
  subtitle?: string;
}

export function ScreenHeader({
  title,
  showBackButton = false,
  rightAction,
  subtitle,
}: ScreenHeaderProps) {
  const router = useRouter();
  const colors = useColors();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.content}>
        {/* Left Side */}
        <View style={styles.leftSection}>
          {showBackButton && (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <View
                style={[
                  styles.iconButton,
                  { backgroundColor: colors.surface },
                ]}
              >
                <IconSymbol
                  size={20}
                  name="chevron.left"
                  color={colors.foreground}
                />
              </View>
            </TouchableOpacity>
          )}
          <View style={styles.titleSection}>
            <Text style={[styles.title, { color: colors.foreground }]}>
              {title}
            </Text>
            {subtitle && (
              <Text style={[styles.subtitle, { color: colors.muted }]}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>

        {/* Right Side */}
        {rightAction && (
          <TouchableOpacity
            onPress={rightAction.onPress}
            style={styles.rightButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View
              style={[
                styles.iconButton,
                { backgroundColor: colors.primary + "15" },
              ]}
            >
              <IconSymbol
                size={20}
                name={rightAction.icon as any}
                color={colors.primary}
              />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  backButton: {
    marginRight: 12,
  },
  rightButton: {
    marginLeft: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
});
