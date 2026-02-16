import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { useColors } from "@/hooks/use-colors";
import { ScreenContainer } from "@/components/screen-container";
import { NotificationItem } from "@/components/notification-item";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { trpc } from "@/lib/trpc";

interface Notification {
  id: number;
  title: string;
  message: string;
  icon?: string;
  image?: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationsScreen() {
  const colors = useColors();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const notificationsQuery = trpc.notifications.list.useQuery({
    limit: 50,
    offset: 0,
  });

  const unreadCountQuery = trpc.notifications.unreadCount.useQuery();
  const markAsReadMutation = trpc.notifications.markAsRead.useMutation();
  const markAllAsReadMutation = trpc.notifications.markAllAsRead.useMutation();
  const deleteNotificationMutation = trpc.notifications.delete.useMutation();

  useEffect(() => {
    if (notificationsQuery.data) {
      setNotifications(notificationsQuery.data as any);
      setIsLoading(false);
    }
  }, [notificationsQuery.data]);

  useEffect(() => {
    if (unreadCountQuery.data) {
      setUnreadCount(unreadCountQuery.data as any);
    }
  }, [unreadCountQuery.data]);

  const handleNotificationPress = async (notification: Notification) => {
    if (!notification.read) {
      await markAsReadMutation.mutateAsync({
        notificationId: notification.id,
      });
      setNotifications(
        notifications.map((n) =>
          n.id === notification.id ? { ...n, read: true } : n
        )
      );
      setUnreadCount(Math.max(0, unreadCount - 1));
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsReadMutation.mutateAsync();
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleDeleteNotification = async (notificationId: number) => {
    await deleteNotificationMutation.mutateAsync({
      notificationId,
    });
    setNotifications(notifications.filter((n) => n.id !== notificationId));
  };

  if (isLoading) {
    return (
      <ScreenContainer>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      {/* Header */}
      <View
        style={[
          styles.header,
          { borderBottomColor: colors.border },
        ]}
      >
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            الإشعارات
          </Text>
          {unreadCount > 0 && (
            <View
              style={[
                styles.unreadBadge,
                { backgroundColor: colors.error },
              ]}
            >
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity
            onPress={handleMarkAllAsRead}
            activeOpacity={0.7}
          >
            <Text style={[styles.markAllText, { color: colors.primary }]}>
              وضع علامة على الكل
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons
            name="notifications-none"
            size={48}
            color={colors.muted}
          />
          <Text style={[styles.emptyText, { color: colors.muted }]}>
            لا توجد إشعارات
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <NotificationItem
              {...item}
              onPress={() => handleNotificationPress(item)}
              onDelete={() => handleDeleteNotification(item.id)}
            />
          )}
          scrollEnabled={true}
          contentContainerStyle={styles.listContent}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  unreadBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadBadgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "700",
  },
  markAllText: {
    fontSize: 12,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "600",
  },
  listContent: {
    paddingVertical: 8,
  },
});
