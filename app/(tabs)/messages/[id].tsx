import { ScrollView, View, Text, TouchableOpacity, TextInput, FlatList, Image, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useState, useEffect, useRef } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function ConversationScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colors = useColors();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    setMessages([
      {
        id: 1,
        sender: "other",
        text: "مرحباً، كيف حالك؟",
        timestamp: "10:30 AM",
        senderName: "متجر الملابس الفاخرة",
      },
      {
        id: 2,
        sender: "me",
        text: "مرحباً، أنا بخير شكراً",
        timestamp: "10:31 AM",
      },
      {
        id: 3,
        sender: "other",
        text: "هل تريد معرفة المزيد عن منتجاتنا الجديدة؟",
        timestamp: "10:32 AM",
        senderName: "متجر الملابس الفاخرة",
      },
      {
        id: 4,
        sender: "me",
        text: "نعم، أود معرفة المزيد",
        timestamp: "10:33 AM",
      },
      {
        id: 5,
        sender: "other",
        text: "رائع! لدينا مجموعة جديدة من الفساتين الفاخرة",
        timestamp: "10:34 AM",
        senderName: "متجر الملابس الفاخرة",
      },
    ]);
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: "me",
        text: newMessage,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages([...messages, message]);
      setNewMessage("");
      
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const renderMessageItem = ({ item }: any) => {
    const isMe = item.sender === "me";
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
            {item.text}
          </Text>
          <Text style={[styles.messageTime, { color: isMe ? colors.background : colors.muted }]}>
            {item.timestamp}
          </Text>
        </View>
      </View>
    );
  };

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
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>متجر الملابس الفاخرة</Text>
            <Text style={[styles.headerStatus, { color: colors.muted }]}>نشط الآن</Text>
          </View>
          <TouchableOpacity style={{ padding: 4 }}>
            <IconSymbol name="info.circle" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

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
          >
            <Text style={{ color: colors.background }}>➤</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
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
  },
  messageContainer: {
    flexDirection: "row",
    marginVertical: 6,
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 0.5,
  },
  messageText: {
    fontSize: 13,
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
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
