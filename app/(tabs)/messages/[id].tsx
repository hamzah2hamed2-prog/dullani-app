import { ScrollView, View, Text, TouchableOpacity, TextInput, FlatList, Image, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useState, useEffect, useRef } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useConversation, useSendMessage, useMarkMessageAsRead } from "@/hooks/use-messages";
import { useAuth } from "@/hooks/use-auth";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function ConversationScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colors = useColors();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const flatListRef = useRef<FlatList>(null);

  // Fetch conversation messages from API
  const { data: messages = [], isLoading } = useConversation(Number(id));
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();
  const { mutate: markAsRead } = useMarkMessageAsRead();

  // Mark messages as read when viewing
  useEffect(() => {
    if (messages.length > 0) {
      messages.forEach((msg: any) => {
        if (!msg.isRead && msg.recipientId === user?.id) {
          markAsRead(msg.id);
        }
      });
    }
  }, [messages, user?.id, markAsRead]);

  const handleSendMessage = () => {
    if (newMessage.trim().length === 0) return;

    sendMessage(
      {
        recipientId: Number(id),
        content: newMessage,
      },
      {
        onSuccess: () => {
          setNewMessage("");
          // Scroll to bottom
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }, 100);
        },
      }
    );
  };

  const renderMessageItem = ({ item }: any) => {
    const isMe = item.senderId === user?.id;
    return (
      <View style={[styles.messageContainer, { justifyContent: isMe ? "flex-end" : "flex-start" }]}>
        <View
          style={[
            styles.messageBubble,
            {
              backgroundColor: isMe ? colors.primary : colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.messageText, { color: isMe ? colors.background : colors.foreground }]}>
            {item.content}
          </Text>
          <Text style={[styles.messageTime, { color: isMe ? colors.background : colors.muted }]}>
            {new Date(item.createdAt).toLocaleTimeString("ar-SA", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <ScreenContainer style={{ alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScreenContainer style={{ padding: 0 }}>
        <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
            <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>محادثة</Text>
            <Text style={[styles.headerStatus, { color: colors.muted }]}>{messages.length} رسالة</Text>
          </View>
          <TouchableOpacity style={{ padding: 4 }}>
            <IconSymbol name="info.circle" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {messages.length > 0 ? (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessageItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 48 }}>💬</Text>
            <Text style={[styles.emptyText, { color: colors.foreground }]}>لا توجد رسائل</Text>
          </View>
        )}

        <View style={[styles.inputContainer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
          <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              placeholder="اكتب رسالة..."
              placeholderTextColor={colors.muted}
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.attachButton, { backgroundColor: colors.primary }]}
              onPress={() => {}}
            >
              <Text style={{ color: colors.background }}>📎</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: colors.primary }]}
            onPress={handleSendMessage}
            disabled={isSending}
          >
            {isSending ? (
              <ActivityIndicator size="small" color={colors.background} />
            ) : (
              <Text style={{ color: colors.background }}>➤</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 14,
    marginTop: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  headerInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  headerStatus: {
    fontSize: 12,
    marginTop: 2,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexGrow: 1,
  },
  messageContainer: {
    flexDirection: "row",
    marginVertical: 6,
    alignItems: "flex-end",
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 0.5,
    gap: 4,
  },
  messageText: {
    fontSize: 13,
  },
  messageTime: {
    fontSize: 10,
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 0.5,
    gap: 8,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 0.5,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 13,
    maxHeight: 100,
  },
  attachButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
