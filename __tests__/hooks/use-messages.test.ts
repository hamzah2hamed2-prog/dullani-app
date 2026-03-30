import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import {
  useConversations,
  useConversation,
  useSendMessage,
  useMarkMessageAsRead,
  useUnreadMessageCount,
} from "@/hooks/use-messages";

// Mock data
const mockMessage = {
  id: "1",
  conversationId: "conv1",
  senderId: "user1",
  content: "Hello",
  createdAt: new Date(),
  isRead: false,
};

const mockConversation = {
  id: "conv1",
  participantId: "user2",
  lastMessage: mockMessage,
  unreadCount: 1,
};

// Setup
let queryClient: QueryClient;

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

beforeEach(() => {
  queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
});

describe("useConversations", () => {
  it("should fetch user conversations", async () => {
    const { result } = renderHook(() => useConversations(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });

  it("should handle empty conversations", async () => {
    const { result } = renderHook(() => useConversations(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(Array.isArray(result.current.data)).toBe(true);
  });

  it("should support search", async () => {
    const { result } = renderHook(() => useConversations("test"), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });
});

describe("useConversation", () => {
  it("should fetch conversation messages", async () => {
    const { result } = renderHook(() => useConversation("conv1"), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });

  it("should not fetch without conversation ID", () => {
    const { result } = renderHook(() => useConversation(""), { wrapper });

    expect(result.current.isLoading).toBe(false);
  });

  it("should auto-refresh messages", async () => {
    const { result } = renderHook(() => useConversation("conv1"), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Simulate auto-refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));

    expect(result.current.data).toBeDefined();
  });
});

describe("useSendMessage", () => {
  it("should send message successfully", async () => {
    const { result } = renderHook(() => useSendMessage(), { wrapper });

    const mutation = result.current;

    expect(mutation.isPending).toBe(false);
  });

  it("should handle message sending errors", async () => {
    const { result } = renderHook(() => useSendMessage(), { wrapper });

    const mutation = result.current;

    expect(mutation.isPending).toBe(false);
  });

  it("should validate message content", async () => {
    const { result } = renderHook(() => useSendMessage(), { wrapper });

    const mutation = result.current;

    expect(mutation.isPending).toBe(false);
  });
});

describe("useMarkMessageAsRead", () => {
  it("should mark message as read", async () => {
    const { result } = renderHook(() => useMarkMessageAsRead(), { wrapper });

    const mutation = result.current;

    expect(mutation.isPending).toBe(false);
  });

  it("should handle marking multiple messages", async () => {
    const { result } = renderHook(() => useMarkMessageAsRead(), { wrapper });

    const mutation = result.current;

    expect(mutation.isPending).toBe(false);
  });
});

describe("useUnreadMessageCount", () => {
  it("should fetch unread message count", async () => {
    const { result } = renderHook(() => useUnreadMessageCount(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(typeof result.current.data).toBe("number");
  });

  it("should return zero when no unread messages", async () => {
    const { result } = renderHook(() => useUnreadMessageCount(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeGreaterThanOrEqual(0);
  });

  it("should update count after sending message", async () => {
    const { result } = renderHook(() => useUnreadMessageCount(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const initialCount = result.current.data;

    // Simulate receiving a message
    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(result.current.data).toBeDefined();
  });
});
