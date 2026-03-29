import { ScrollView, View, Text, TouchableOpacity, TextInput, FlatList, Image, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function NewMessageScreen() {
  const router = useRouter();
  const { storeId } = useLocalSearchParams();
  const colors = useColors();
  const [searchText, setSearchText] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState<any>(null);
  const [messageText, setMessageText] = useState("");
  const [recipients, setRecipients] = useState<any[]>([]);

  useEffect(() => {
    setRecipients([
      {
        id: 1,
        name: "متجر الملابس الفاخرة",
        image: "https://via.placeholder.com/50",
        type: "store",
      },
      {
        id: 2,
        name: "أحمد محمد",
        image: "https://via.placeholder.com/50",
        type: "user",
      },
      {
        id: 3,
        name: "متجر الإلكترونيات",
        image: "https://via.placeholder.com/50",
        type: "store",
      },
      {
        id: 4,
        name: "فاطمة علي",
        image: "https://via.placeholder.com/50",
        type: "user",
      },
    ]);

    if (storeId) {
      const store = recipients.find((r) => r.id === parseInt(storeId as string));
      if (store) {
        setSelectedRecipient(store);
      }
    }
  }, []);

  const filteredRecipients = recipients.filter((r) =>
    r.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSendMessage = () => {
    if (selectedRecipient && messageText.trim()) {
      router.push(`/(tabs)/messages/${selectedRecipient.id}`);
    }
  };

  const renderRecipientItem = ({ item }: any) => (
    <TouchableOpacity
      style={[
        styles.recipientItem,
        {
          backgroundColor: selectedRecipient?.id === item.id ? colors.primary : colors.surface,
          borderColor: colors.border,
        },
      ]}
      onPress={() => setSelectedRecipient(item)}
    >
      <Image source={{ uri: item.image }} style={styles.recipientImage} />
      <View style={styles.recipientInfo}>
        <Text
          style={[
            styles.recipientName,
            {
              color: selectedRecipient?.id === item.id ? colors.background : colors.foreground,
            },
          ]}
        >
          {item.name}
        </Text>
        <Text
          style={[
            styles.recipientType,
            {
              color: selectedRecipient?.id === item.id ? colors.background : colors.muted,
            },
          ]}
        >
          {item.type === "store" ? "متجر" : "مستخدم"}
        </Text>
      </View>
      {selectedRecipient?.id === item.id && (
        <IconSymbol name="checkmark.circle.fill" size={20} color={colors.background} />
      )}
    </TouchableOpacity>
  );

  return (
    <ScreenContainer style={{ padding: 0 }}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>رسالة جديدة</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
          <IconSymbol name="magnifyingglass" size={16} color={colors.muted} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="ابحث عن متجر أو مستخدم..."
            placeholderTextColor={colors.muted}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Recipients List */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>اختر المستقبل</Text>
          <FlatList
            data={filteredRecipients}
            renderItem={renderRecipientItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.recipientsList}
          />
        </View>

        {/* Message Input */}
        {selectedRecipient && (
          <View style={[styles.section, { backgroundColor: colors.background }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>الرسالة</Text>
            <View style={[styles.messageInputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <TextInput
                style={[styles.messageInput, { color: colors.foreground }]}
                placeholder="اكتب رسالتك هنا..."
                placeholderTextColor={colors.muted}
                value={messageText}
                onChangeText={setMessageText}
                multiline
                maxLength={500}
              />
              <Text style={[styles.charCount, { color: colors.muted }]}>
                {messageText.length}/500
              </Text>
            </View>

            {/* Send Button */}
            <TouchableOpacity
              style={[
                styles.sendButton,
                {
                  backgroundColor: messageText.trim() ? colors.primary : colors.border,
                },
              ]}
              onPress={handleSendMessage}
              disabled={!messageText.trim()}
            >
              <Text style={[styles.sendButtonText, { color: colors.background }]}>إرسال الرسالة</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
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
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  recipientsList: {
    gap: 8,
  },
  recipientItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 0.5,
    gap: 12,
  },
  recipientImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  recipientInfo: {
    flex: 1,
  },
  recipientName: {
    fontSize: 13,
    fontWeight: "600",
  },
  recipientType: {
    fontSize: 11,
    marginTop: 2,
  },
  messageInputContainer: {
    borderRadius: 8,
    borderWidth: 0.5,
    padding: 12,
    marginBottom: 12,
  },
  messageInput: {
    fontSize: 13,
    minHeight: 100,
    maxHeight: 200,
  },
  charCount: {
    fontSize: 11,
    marginTop: 8,
    textAlign: "right",
  },
  sendButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  sendButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
