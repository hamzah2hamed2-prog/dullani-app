import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useColors } from "@/hooks/use-colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface NotificationItemProps {
  id: number;
  title: string;
  message: string;
  icon?: string;
  image?: string;
  read: boolean;
  createdAt: string;
  onPress?: () => void;
  onDelete?: () => void;
}

export function NotificationItem({
  id,
  title,
  message,
  icon,
  image,
  read,
  createdAt,
  onPress,
  onDelete,
}: NotificationItemProps) {
  const colors = useColors();

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "الآن";
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays < 7) return `منذ ${diffDays} يوم`;
    
    return date.toLocaleDateString("ar-SA");
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: read ? colors.background : `${colors.primary}10`,
          borderColor: colors.border,
        },
      ]}
      activeOpacity={0.7}
    >
      {/* Icon or Image */}
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: colors.surface },
        ]}
      >
        {image ? (
          <Image
            source={{ uri: image }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <MaterialIcons
            name={(icon || "notifications") as any}
            size={24}
            color={colors.primary}
          />
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text
            numberOfLines={1}
            style={[
              styles.title,
              {
                color: colors.foreground,
                fontWeight: read ? "600" : "700",
              },
            ]}
          >
            {title}
          </Text>
          {!read && (
            <View
              style={[styles.unreadDot, { backgroundColor: colors.primary }]}
            />
          )}
        </View>

        <Text
          numberOfLines={2}
          style={[styles.message, { color: colors.muted }]}
        >
          {message}
        </Text>

        <Text style={[styles.time, { color: colors.muted }]}>
          {formatTime(createdAt)}
        </Text>
      </View>

      {/* Delete Button */}
      <TouchableOpacity
        onPress={onDelete}
        style={styles.deleteButton}
        activeOpacity={0.6}
      >
        <MaterialIcons
          name="close"
          size={18}
          color={colors.muted}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    gap: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 13,
    letterSpacing: 0.3,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  message: {
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
  },
  time: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
    marginRight: -8,
  },
});
