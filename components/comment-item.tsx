import { View, Text, StyleSheet, Image } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

interface CommentItemProps {
  id: number;
  userName: string;
  content: string;
  createdAt: Date;
}

export function CommentItem({ userName, content, createdAt }: CommentItemProps) {
  const colors = useColors();

  const timeAgo = formatDistanceToNow(new Date(createdAt || Date.now()), {
    addSuffix: true,
    locale: ar,
  });

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      <View style={[styles.avatarContainer, { borderColor: colors.border }]}>
        <Image
          source={{ uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random` }}
          style={styles.avatar}
        />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={[styles.userName, { color: colors.foreground }]}>{userName}</Text>
          <Text style={[styles.timeAgo, { color: colors.muted }]}>{timeAgo}</Text>
        </View>
        <Text style={[styles.content, { color: colors.foreground }]}>{content}</Text>
        <Text style={[styles.replyButton, { color: colors.muted }]}>رد</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    padding: 1,
    marginRight: 12, // Space between avatar and text (RTL adjusted implicitly by flexDirection)
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  userName: {
    fontSize: 13,
    fontWeight: "bold",
  },
  timeAgo: {
    fontSize: 11,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  replyButton: {
    fontSize: 12,
    fontWeight: "600",
  },
});
