import { View, Text, TextInput, Pressable, FlatList, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import * as Haptics from "expo-haptics";

interface CommentsSectionProps {
  productId: number;
  currentUserId?: number;
}

export function CommentsSection({ productId, currentUserId }: CommentsSectionProps) {
  const colors = useColors();
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [commentsCount, setCommentsCount] = useState(0);

  const addCommentMutation = trpc.social.addComment.useMutation();
  const deleteCommentMutation = trpc.social.deleteComment.useMutation();
  const commentsQuery = trpc.social.getProductComments.useQuery({
    productId,
    limit: 20,
    offset: 0,
  });
  const commentsCountQuery = trpc.social.getProductCommentsCount.useQuery({ productId });

  useEffect(() => {
    if (Array.isArray(commentsQuery.data)) {
      setComments(commentsQuery.data);
    }
  }, [commentsQuery.data]);

  useEffect(() => {
    if (typeof commentsCountQuery.data === "number") {
      setCommentsCount(commentsCountQuery.data);
    }
  }, [commentsCountQuery.data]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      await addCommentMutation.mutateAsync({
        productId,
        content: newComment,
      });

      setNewComment("");
      setCommentsCount(commentsCount + 1);
      // Refetch comments
      commentsQuery.refetch();
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteCommentMutation.mutateAsync({ commentId });
      setComments(comments.filter((c) => c.id !== commentId));
      setCommentsCount(Math.max(0, commentsCount - 1));
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  return (
    <View style={{ gap: 12 }}>
      {/* Comments Header */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <MaterialIcons name="comment" size={20} color={colors.primary} />
        <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
          التعليقات ({commentsCount})
        </Text>
      </View>

      {/* Add Comment Input */}
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          alignItems: "flex-end",
          backgroundColor: colors.surface,
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <TextInput
          placeholder="أضف تعليق..."
          placeholderTextColor={colors.muted}
          value={newComment}
          onChangeText={setNewComment}
          style={{
            flex: 1,
            color: colors.foreground,
            fontSize: 14,
            paddingVertical: 8,
          }}
          multiline
          maxLength={500}
        />
        <Pressable
          onPress={handleAddComment}
          disabled={!newComment.trim() || addCommentMutation.isPending}
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.7 : 1,
              padding: 4,
            },
          ]}
        >
          <MaterialIcons
            name="send"
            size={20}
            color={newComment.trim() ? colors.primary : colors.muted}
          />
        </Pressable>
      </View>

      {/* Comments List */}
      <View style={{ gap: 8, maxHeight: 300 }}>
        {comments.length > 0 ? (
          <ScrollView>
            {comments.map((comment) => (
              <View
                key={comment.id}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 8,
                  padding: 10,
                  marginBottom: 8,
                  borderLeftWidth: 3,
                  borderLeftColor: colors.primary,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 4,
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: "600", color: colors.foreground }}>
                    مستخدم
                  </Text>
                  {currentUserId === comment.userId && (
                    <Pressable
                      onPress={() => handleDeleteComment(comment.id)}
                      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                    >
                      <MaterialIcons name="close" size={16} color={colors.error} />
                    </Pressable>
                  )}
                </View>
                <Text style={{ fontSize: 13, color: colors.foreground, lineHeight: 18 }}>
                  {comment.content}
                </Text>
                <Text style={{ fontSize: 11, color: colors.muted, marginTop: 4 }}>
                  {new Date(comment.createdAt).toLocaleDateString("ar-SA")}
                </Text>
              </View>
            ))}
          </ScrollView>
        ) : (
          <Text style={{ fontSize: 13, color: colors.muted, textAlign: "center", paddingVertical: 16 }}>
            لا توجد تعليقات حتى الآن
          </Text>
        )}
      </View>
    </View>
  );
}
