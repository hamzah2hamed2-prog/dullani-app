import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";

export interface Message {
  id: number;
  senderId: number;
  recipientId: number;
  content: string;
  isRead: boolean;
  createdAt: Date;
}

export interface Conversation {
  id: number;
  participantId: number;
  participantName: string;
  participantAvatar?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
}

/**
 * Hook to fetch user's conversations
 */
export function useConversations(userId?: number) {
  return useQuery({
    queryKey: ["conversations", userId],
    queryFn: async () => {
      if (!userId) return [];
      try {
        const result = await trpc.messages.getConversations.query({ userId });
        return result;
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
        return [];
      }
    },
    enabled: !!userId,
  });
}

/**
 * Hook to fetch messages in a conversation
 */
export function useConversation(conversationId: number) {
  return useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: async () => {
      try {
        const result = await trpc.messages.getConversation.query({
          conversationId,
        });
        return result;
      } catch (error) {
        console.error("Failed to fetch conversation:", error);
        return [];
      }
    },
    enabled: !!conversationId,
    refetchInterval: 3000, // Auto-refresh every 3 seconds
  });
}

/**
 * Hook to send a message
 */
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      recipientId: number;
      content: string;
    }) => {
      try {
        const result = await trpc.messages.send.mutate(data);
        return result;
      } catch (error) {
        console.error("Failed to send message:", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate conversations and messages queries
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["conversation"] });
    },
  });
}

/**
 * Hook to mark message as read
 */
export function useMarkMessageAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: number) => {
      try {
        await trpc.messages.markAsRead.mutate({ messageId });
      } catch (error) {
        console.error("Failed to mark message as read:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["conversation"] });
    },
  });
}

/**
 * Hook to get unread message count
 */
export function useUnreadMessageCount(userId?: number) {
  return useQuery({
    queryKey: ["unreadMessageCount", userId],
    queryFn: async () => {
      if (!userId) return 0;
      try {
        const result = await trpc.messages.getUnreadCount.query({ userId });
        return result;
      } catch (error) {
        console.error("Failed to fetch unread count:", error);
        return 0;
      }
    },
    enabled: !!userId,
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  });
}

/**
 * Hook to search conversations
 */
export function useSearchConversations(
  userId: number,
  searchTerm: string
) {
  return useQuery({
    queryKey: ["searchConversations", userId, searchTerm],
    queryFn: async () => {
      if (!searchTerm.trim()) return [];
      try {
        const conversations = await trpc.messages.getConversations.query({
          userId,
        });
        return conversations.filter((conv) =>
          conv.participantName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
      } catch (error) {
        console.error("Failed to search conversations:", error);
        return [];
      }
    },
    enabled: !!userId && searchTerm.length > 0,
  });
}
