import { TouchableOpacity, Text, View } from "react-native";
import { IconSymbol } from "./ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonEnhancedProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  iconPosition?: "left" | "right";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export function ButtonEnhanced({
  label,
  onPress,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "right",
  disabled = false,
  loading = false,
  fullWidth = false,
}: ButtonEnhancedProps) {
  const colors = useColors();

  const getBackgroundColor = () => {
    if (disabled) return colors.muted;
    switch (variant) {
      case "primary":
        return colors.primary;
      case "secondary":
        return colors.surface;
      case "outline":
        return "transparent";
      case "danger":
        return colors.error;
      default:
        return colors.primary;
    }
  };

  const getTextColor = () => {
    if (variant === "secondary" || variant === "outline") {
      return colors.foreground;
    }
    return "white";
  };

  const getPadding = () => {
    switch (size) {
      case "sm":
        return "px-3 py-2";
      case "md":
        return "px-4 py-3";
      case "lg":
        return "px-6 py-4";
      default:
        return "px-4 py-3";
    }
  };

  const getFontSize = () => {
    switch (size) {
      case "sm":
        return "text-sm";
      case "md":
        return "text-base";
      case "lg":
        return "text-lg";
      default:
        return "text-base";
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      className={`rounded-lg flex-row items-center justify-center ${getPadding()} ${
        fullWidth ? "w-full" : ""
      } ${variant === "outline" ? "border-2" : ""}`}
      style={{
        backgroundColor: getBackgroundColor(),
        borderColor: variant === "outline" ? colors.primary : undefined,
      }}
    >
      {loading && (
        <View className="mr-2">
          <Text style={{ color: getTextColor() }}>⏳</Text>
        </View>
      )}

      {icon && iconPosition === "left" && (
        <IconSymbol
          size={size === "sm" ? 16 : size === "md" ? 18 : 20}
          name={icon as any}
          color={getTextColor()}
        />
      )}

      <Text
        className={`font-semibold ${getFontSize()} ${
          icon ? (iconPosition === "left" ? "ml-2" : "mr-2") : ""
        }`}
        style={{ color: getTextColor() }}
      >
        {label}
      </Text>

      {icon && iconPosition === "right" && (
        <IconSymbol
          size={size === "sm" ? 16 : size === "md" ? 18 : 20}
          name={icon as any}
          color={getTextColor()}
        />
      )}
    </TouchableOpacity>
  );
}
