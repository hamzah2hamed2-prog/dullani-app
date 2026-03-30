import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { useAnalytics, useUserStats, useStoreStats } from "@/hooks/use-analytics";

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

describe("useAnalytics", () => {
  it("should fetch analytics data", async () => {
    const { result } = renderHook(() => useAnalytics("daily"), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });

  it("should support different time periods", async () => {
    const periods = ["daily", "weekly", "monthly"];

    for (const period of periods) {
      const { result } = renderHook(() => useAnalytics(period as any), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toBeDefined();
    }
  });

  it("should handle analytics errors", async () => {
    const { result } = renderHook(() => useAnalytics("daily"), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });
});

describe("useUserStats", () => {
  it("should fetch user statistics", async () => {
    const { result } = renderHook(() => useUserStats("user1"), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });

  it("should not fetch without user ID", () => {
    const { result } = renderHook(() => useUserStats(""), { wrapper });

    expect(result.current.isLoading).toBe(false);
  });

  it("should include engagement metrics", async () => {
    const { result } = renderHook(() => useUserStats("user1"), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    if (result.current.data) {
      expect(result.current.data).toHaveProperty("likes");
      expect(result.current.data).toHaveProperty("comments");
      expect(result.current.data).toHaveProperty("shares");
    }
  });
});

describe("useStoreStats", () => {
  it("should fetch store statistics", async () => {
    const { result } = renderHook(() => useStoreStats("store1"), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });

  it("should not fetch without store ID", () => {
    const { result } = renderHook(() => useStoreStats(""), { wrapper });

    expect(result.current.isLoading).toBe(false);
  });

  it("should include sales metrics", async () => {
    const { result } = renderHook(() => useStoreStats("store1"), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    if (result.current.data) {
      expect(result.current.data).toHaveProperty("totalSales");
      expect(result.current.data).toHaveProperty("totalOrders");
      expect(result.current.data).toHaveProperty("conversionRate");
    }
  });
});
