import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, StyleSheet, ActivityIndicator, Image } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { CommentItem } from "@/components/comment-item";
import { useAuth } from "@/hooks/use-auth";

export default function CommentsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colors = useColors();
  const { user, isAuthenticated } = useAuth();
  const [commentText, setCommentText] = useState("");

  const productId = parseInt(id as string);

  // Fetch comments
  const { data: comments = [], isLoading, refetch } = trpc.comments.list.useQuery(
    { productId, limit: 50 },
    { enabled: !!productId }
  );

  // Add comment mutation
  const addCommentMutation = trpc.comments.add.useMutation({
    onSuccess: () => {
      setCommentText("");
      refetch();
    },
  });

  const handlePostComment = () => {
    if (!isAuthenticated) {
      router.push("/login"); // Redirect to login
      return;
    }

    if (!commentText.trim()) return;

    addCommentMutation.mutate({
      productId,
      content: commentText.trim(),
    });
  };

  return (
    <ScreenContainer edges={["top"]} style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>التعليقات</Text>
        <View style={{ width: 32 }} /> {/* Placeholder for balance */}
      </View>

      {/* Comments List */}
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : comments.length > 0 ? (
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <CommentItem
                id={item.id}
                userName={item.userName || "مستخدم"}
                content={item.content}
                createdAt={new Date(item.createdAt)}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          <View style={styles.centered}>
            <IconSymbol name="bubble.right" size={48} color={colors.muted} />
            <Text style={[styles.emptyText, { color: colors.foreground }]}>لا توجد تعليقات بعد</Text>
            <Text style={[styles.emptySubText, { color: colors.muted }]}>كن أول من يشارك رأيه!</Text>
          </View>
        )}

        {/* Input Area */}
        <View style={[styles.inputContainer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
          <View style={[styles.avatarContainer, { borderColor: colors.border }]}>
            <Image
              source={{ uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=random` }}
              style={styles.avatar}
            />
          </View>
          <TextInput
            style={[styles.input, { color: colors.foreground }]}
            placeholder="إضافة تعليق..."
            placeholderTextColor={colors.muted}
            value={commentText}
            onChangeText={setCommentText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            onPress={handlePostComment} 
            disabled={!commentText.trim() || addCommentMutation.isPending}
            style={styles.postButton}
          >
            <Text 
              style={[
                styles.postButtonText, 
                { color: commentText.trim() ? colors.primary : colors.muted }
              ]}
            >
              {addCommentMutation.isPending ? "جاري..." : "نشر"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 0.5,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    padding: 1,
    marginRight: 12,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    fontSize: 15,
    paddingTop: 8,
    paddingBottom: 8,
    textAlign: 'right', // For Arabic
  },
  postButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  postButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});
