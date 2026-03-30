import { ScrollView, View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator, StyleSheet, TextInput } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useConversations, useUnreadMessageCount, useSearchConversations } from "@/hooks/use-messages";
import { useAuth } from "@/hooks/use-auth";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function MessagesScreen() {
  const router = useRouter();
  const colors = useColors();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch conversations from API
  const { data: conversations = [], isLoading } = useConversations(user?.id);
  const { data: unreadCount = 0 } = useUnreadMessageCount(user?.id);
  const { data: searchResults = [] } = useSearchConversations(user?.id || 0, searchQuery);

  const displayConversations = searchQuery.length > 0 ? searchResults : conversations;



  const renderConversationItem = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.conversationItem, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}
      onPress={() => router.push(`/(tabs)/messages/${item.id}`)}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.participantAvatar || "https://via.placeholder.com/50" }} style={styles.avatar} />
      </View>

      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={[styles.participantName, { color: colors.foreground }]} numberOfLines={1}>
            {item.participantName}
          </Text>
          <Text style={[styles.timestamp, { color: colors.muted }]}>
            {item.lastMessageTime ? new Date(item.lastMessageTime).toLocaleDateString("ar-SA") : ""}
          </Text>
        </View>
        <Text style={[styles.lastMessage, { color: colors.muted }]} numberOfLines={1}>
          {item.lastMessage || "لا توجد رسائل"}
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
        {unreadCount > 0 && (
          <View style={[styles.headerBadge, { backgroundColor: colors.primary }]}>
            <Text style={[styles.badgeText, { color: colors.background }]}>{unreadCount}</Text>
          </View>
        )}
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="ابحث عن محادثة..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Conversations List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : displayConversations.length > 0 ? (
        <FlatList
          data={displayConversations}
          renderItem={renderConversationItem}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={true}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={{ fontSize: 48 }}>💬</Text>
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>لا توجد محادثات</Text>
          <Text style={[styles.emptyDescription, { color: colors.muted }]}>
            ابدأ محادثة جديدة مع متجرك المفضل
          </Text>
          <TouchableOpacity
            style={[styles.emptyButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push("/(tabs)/messages/new")}
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
    backgroundColor: "transparent",
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
