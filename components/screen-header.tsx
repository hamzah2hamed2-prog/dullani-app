import { View, Text, TouchableOpacity } from "react-native";
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
      className="px-4 py-4 border-b border-border"
      style={{
        backgroundColor: colors.background,
        borderBottomColor: colors.border,
      }}
    >
      <View className="flex-row items-center justify-between">
        {/* Left Side */}
        <View className="flex-row items-center flex-1">
          {showBackButton && (
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-3 p-2"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <IconSymbol
                size={24}
                name="chevron.left"
                color={colors.foreground}
              />
            </TouchableOpacity>
          )}
          <View className="flex-1">
            <Text className="text-xl font-bold text-foreground">{title}</Text>
            {subtitle && (
              <Text className="text-xs text-muted mt-1">{subtitle}</Text>
            )}
          </View>
        </View>

        {/* Right Side */}
        {rightAction && (
          <TouchableOpacity
            onPress={rightAction.onPress}
            className="p-2"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <IconSymbol
              size={24}
              name={rightAction.icon as any}
              color={colors.foreground}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
