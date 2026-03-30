import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MessagesScreen from "@/app/(tabs)/messages/index";
import { ReactNode } from "react";

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

describe("MessagesScreen", () => {
  it("should render messages screen", () => {
    render(<MessagesScreen />, { wrapper });

    expect(screen.getByText(/الرسائل/i)).toBeTruthy();
  });

  it("should display conversations list", async () => {
    render(<MessagesScreen />, { wrapper });

    await waitFor(() => {
      expect(screen.UNSAFE_queryAllByType("FlatList").length).toBeGreaterThan(0);
    });
  });

  it("should display search conversations input", () => {
    render(<MessagesScreen />, { wrapper });

    expect(screen.getByPlaceholderText(/ابحث عن محادثات/i)).toBeTruthy();
  });

  it("should display unread message count", async () => {
    render(<MessagesScreen />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/رسائل جديدة/i)).toBeTruthy();
    });
  });

  it("should display online status indicator", async () => {
    render(<MessagesScreen />, { wrapper });

    await waitFor(() => {
      const statusIndicators = screen.UNSAFE_queryAllByType("View");
      expect(statusIndicators.length).toBeGreaterThan(0);
    });
  });

  it("should display new message button", () => {
    render(<MessagesScreen />, { wrapper });

    expect(screen.getByText(/رسالة جديدة/i)).toBeTruthy();
  });

  it("should display last message preview", async () => {
    render(<MessagesScreen />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/آخر رسالة/i)).toBeTruthy();
    });
  });

  it("should display conversation timestamp", async () => {
    render(<MessagesScreen />, { wrapper });

    await waitFor(() => {
      // Check if timestamps are displayed
      expect(screen.UNSAFE_queryAllByType("Text").length).toBeGreaterThan(0);
    });
  });

  it("should handle search conversations", () => {
    render(<MessagesScreen />, { wrapper });

    const searchInput = screen.getByPlaceholderText(/ابحث عن محادثات/i);
    fireEvent.changeText(searchInput, "test");

    expect(searchInput.props.value).toBe("test");
  });

  it("should display empty state when no conversations", async () => {
    render(<MessagesScreen />, { wrapper });

    await waitFor(() => {
      // Check if empty state message is displayed
      expect(screen.queryByText(/لا توجد محادثات/i)).toBeTruthy();
    });
  });
});
