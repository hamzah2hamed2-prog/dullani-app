import { useInfiniteQuery, UseInfiniteQueryResult } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { useMemo } from "react";

/**
 * Hook for infinite scrolling messages with pagination
 * Loads older messages as user scrolls up
 */
export function useMessagesPagination(
  conversationId: string,
  limit: number = 30
): UseInfiniteQueryResult<any, unknown> {
  return useInfiniteQuery({
    queryKey: ["messages", conversationId],
    queryFn: async ({ pageParam = 0 }) => {
      const offset = pageParam * limit;
      const data = await trpc.messages.getConversation.query({
        conversationId,
        limit,
        offset,
      });
      return data;
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < limit) return undefined;
      return pages.length;
    },
    initialPageParam: 0,
    enabled: !!conversationId,
  });
}

/**
 * Hook for infinite scrolling conversations with pagination
 * Loads more conversations as user scrolls
 */
export function useConversationsPagination(
  limit: number = 20
): UseInfiniteQueryResult<any, unknown> {
  return useInfiniteQuery({
    queryKey: ["conversations"],
    queryFn: async ({ pageParam = 0 }) => {
      const offset = pageParam * limit;
      const data = await trpc.messages.getConversations.query({
        limit,
        offset,
      });
      return data;
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < limit) return undefined;
      return pages.length;
    },
    initialPageParam: 0,
  });
}

/**
 * Hook for infinite scrolling search conversations with pagination
 */
export function useSearchConversationsPagination(
  query: string,
  limit: number = 20
): UseInfiniteQueryResult<any, unknown> {
  return useInfiniteQuery({
    queryKey: ["conversations", "search", query],
    queryFn: async ({ pageParam = 0 }) => {
      const offset = pageParam * limit;
      const data = await trpc.messages.getConversations.query({
        limit,
        offset,
        search: query,
      });
      return data;
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < limit) return undefined;
      return pages.length;
    },
    initialPageParam: 0,
    enabled: !!query,
  });
}

/**
 * Utility hook to flatten paginated messages
 * Reverses the order so newest messages are at bottom
 */
export function useFlattenedMessages(pages: any[] | undefined) {
  return useMemo(() => {
    if (!pages) return [];
    const flattened = pages.flatMap((page) => page);
    // Reverse so oldest messages are first (for chat UI)
    return flattened.reverse();
  }, [pages]);
}

/**
 * Utility hook to check if there are more messages to load
 */
export function useHasMoreMessages(
  hasNextPage: boolean | undefined,
  isFetchingNextPage: boolean
) {
  return useMemo(() => {
    return hasNextPage && !isFetchingNextPage;
  }, [hasNextPage, isFetchingNextPage]);
}
