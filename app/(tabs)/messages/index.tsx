import { ScrollView, View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function MessagesScreen() {
  const router = useRouter();
  const colors = useColors();
  const [conversations, setConversations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock conversations data
  useEffect(() => {
    setConversations([
      {
        id: 1,
        participantName: "متجر الملابس الفاخرة",
        participantImage: "https://via.placeholder.com/50",
        lastMessage: "شكراً على اهتمامك بمنتجاتنا",
        timestamp: "قبل ساعة",
        unreadCount: 2,
        isOnline: true,
      },
      {
        id: 2,
        participantName: "أحمد محمد",
        participantImage: "https://via.placeholder.com/50",
        lastMessage: "هل المنتج متوفر الآن؟",
        timestamp: "قبل 3 ساعات",
        unreadCount: 0,
        isOnline: false,
      },
      {
        id: 3,
        participantName: "متجر الإلكترونيات",
        participantImage: "https://via.placeholder.com/50",
        lastMessage: "تم استقبال طلبك بنجاح",
        timestamp: "أمس",
        unreadCount: 1,
        isOnline: true,
      },
      {
        id: 4,
        participantName: "فاطمة علي",
        participantImage: "https://via.placeholder.com/50",
        lastMessage: "شكراً على الخدمة الممتازة",
        timestamp: "قبل يومين",
        unreadCount: 0,
        isOnline: false,
      },
    ]);
  }, []);

  const handleNewMessage = () => {
    router.push("/(tabs)/messages/new");
  };

  const handleConversationPress = (conversationId: number) => {
    router.push(`/(tabs)/messages/${conversationId}`);
  };

  const renderConversationItem = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.conversationItem, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}
      onPress={() => handleConversationPress(item.id)}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.participantImage }} style={styles.avatar} />
        {item.isOnline && <View style={[styles.onlineIndicator, { backgroundColor: colors.success }]} />}
      </View>

      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={[styles.participantName, { color: colors.foreground }]} numberOfLines={1}>
            {item.participantName}
          </Text>
          <Text style={[styles.timestamp, { color: colors.muted }]}>{item.timestamp}</Text>
        </View>
        <Text style={[styles.lastMessage, { color: colors.muted }]} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>

      {item.unreadCount > 0 && (
        <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
          <Text style={[styles.unreadCount, { color: colors.background }]}>
            {item.unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <ScreenContainer style={{ padding: 0 }}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>الرسائل</Text>
        <TouchableOpacity
          style={[styles.newMessageButton, { backgroundColor: colors.primary }]}
          onPress={handleNewMessage}
        >
          <IconSymbol name="pencil" size={18} color={colors.background} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <IconSymbol name="magnifyingglass" size={16} color={colors.muted} />
        <Text style={[styles.searchPlaceholder, { color: colors.muted }]}>ابحث عن محادثة...</Text>
      </View>

      {/* Conversations List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : conversations.length > 0 ? (
        <FlatList
          data={conversations}
          renderItem={renderConversationItem}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={true}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <IconSymbol name="bubble.left" size={48} color={colors.muted} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>لا توجد محادثات</Text>
          <Text style={[styles.emptyDescription, { color: colors.muted }]}>
            ابدأ محادثة جديدة مع التجار والمستخدمين
          </Text>
          <TouchableOpacity
            style={[styles.emptyButton, { backgroundColor: colors.primary }]}
            onPress={handleNewMessage}
          >
            <Text style={[styles.emptyButtonText, { color: colors.background }]}>رسالة جديدة</Text>
          </TouchableOpacity>
        </View>
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
    borderBottomWidth: 0.5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  newMessageButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderBottomWidth: 0.5,
    gap: 8,
  },
  searchPlaceholder: {
    fontSize: 13,
    flex: 1,
  },
  conversationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    gap: 12,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "white",
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  participantName: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
  },
  lastMessage: {
    fontSize: 12,
  },
  unreadBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadCount: {
    fontSize: 11,
    fontWeight: "bold",
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
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
  },
  emptyDescription: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
  },
  emptyButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
