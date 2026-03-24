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
import { IconSymbol } from "@/components/ui/icon-symbol";
import { trpc } from "@/lib/trpc";
import { useRouter } from "expo-router";

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
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const notificationsQuery = trpc.notifications.list.useQuery({
    limit: 50,
    offset: 0,
  });

  const markAsReadMutation = trpc.notifications.markAsRead.useMutation();

  useEffect(() => {
    if (notificationsQuery.data) {
      // Temporary mapping until backend returns exactly what we need
      const mapped = notificationsQuery.data.map(n => ({
        ...n,
        read: Boolean(n.read),
        createdAt: n.createdAt.toString()
      }));
      setNotifications(mapped as any);
      setIsLoading(false);
    }
  }, [notificationsQuery.data]);

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
    }
    // Navigate based on notification type (would be handled here in a real app)
  };

  if (isLoading) {
    return (
      <ScreenContainer edges={["top"]} style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={["top"]} style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>الإشعارات</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconContainer, { borderColor: colors.foreground }]}>
            <IconSymbol name="heart" size={48} color={colors.foreground} />
          </View>
          <Text style={[styles.emptyText, { color: colors.foreground }]}>النشاط</Text>
          <Text style={[styles.emptySubText, { color: colors.muted }]}>
            عندما يقوم شخص ما بالإعجاب بمنشوراتك أو التعليق عليها، ستراها هنا.
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
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerButton: {
    padding: 4,
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
    padding: 40,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
});
