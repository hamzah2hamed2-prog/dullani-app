import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

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

  const timeAgo = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
    locale: ar,
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: read ? colors.background : `${colors.primary}10`,
          borderBottomColor: colors.border,
        },
      ]}
      activeOpacity={0.7}
    >
      {/* Icon or Image */}
      <View
        style={[
          styles.iconContainer,
          { borderColor: colors.border },
        ]}
      >
        {image ? (
          <Image
            source={{ uri: image }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <IconSymbol
            name={(icon as any) || "bell.fill"}
            size={24}
            color={colors.primary}
          />
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text
            numberOfLines={2}
            style={[
              styles.message,
              {
                color: colors.foreground,
                fontWeight: read ? "normal" : "bold",
              },
            ]}
          >
            <Text style={{ fontWeight: "bold" }}>{title} </Text>
            {message}
          </Text>
        </View>

        <Text style={[styles.time, { color: colors.muted }]}>
          {timeAgo}
        </Text>
      </View>

      {/* Product Image / Action (Optional Instagram Style) */}
      <View style={styles.actionContainer}>
         {!read && (
            <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
         )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    marginRight: 12,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
  },
  actionContainer: {
    marginLeft: 12,
    alignItems: "center",
    justifyContent: "center",
    width: 24,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
