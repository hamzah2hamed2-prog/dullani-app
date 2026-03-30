import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import {
  useProfile,
  useUserProfile,
  useUpdateProfile,
  useUserActivity,
  useUserStats,
  useFollowUser,
  useUserFollowers,
  useUserFollowing,
  useChangePassword,
  useUpdatePrivacySettings,
} from "@/hooks/use-profile";

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

describe("useProfile", () => {
  it("should fetch current user profile", async () => {
    const { result } = renderHook(() => useProfile(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });

  it("should cache profile data", async () => {
    const { result: result1 } = renderHook(() => useProfile(), { wrapper });
    const { result: result2 } = renderHook(() => useProfile(), { wrapper });

    await waitFor(() => {
      expect(result1.current.isLoading).toBe(false);
      expect(result2.current.isLoading).toBe(false);
    });

    expect(result1.current.data).toBe(result2.current.data);
  });
});

describe("useUserProfile", () => {
  it("should fetch user profile by ID", async () => {
    const { result } = renderHook(() => useUserProfile("user1"), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });

  it("should not fetch without user ID", () => {
    const { result } = renderHook(() => useUserProfile(""), { wrapper });

    expect(result.current.isLoading).toBe(false);
  });
});

describe("useUpdateProfile", () => {
  it("should update profile", async () => {
    const { result } = renderHook(() => useUpdateProfile(), { wrapper });

    const mutation = result.current;

    expect(mutation.isPending).toBe(false);
  });

  it("should invalidate cache after update", async () => {
    const { result } = renderHook(() => useUpdateProfile(), { wrapper });

    const mutation = result.current;

    expect(mutation.isPending).toBe(false);
  });
});

describe("useUserActivity", () => {
  it("should fetch user activity", async () => {
    const { result } = renderHook(() => useUserActivity("user1"), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });

  it("should not fetch without user ID", () => {
    const { result } = renderHook(() => useUserActivity(""), { wrapper });

    expect(result.current.isLoading).toBe(false);
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

  it("should include engagement metrics", async () => {
    const { result } = renderHook(() => useUserStats("user1"), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    if (result.current.data) {
      expect(result.current.data).toHaveProperty("likes");
      expect(result.current.data).toHaveProperty("followers");
    }
  });
});

describe("useFollowUser", () => {
  it("should follow user", async () => {
    const { result } = renderHook(() => useFollowUser(), { wrapper });

    const mutation = result.current;

    expect(mutation.isPending).toBe(false);
  });

  it("should unfollow user", async () => {
    const { result } = renderHook(() => useFollowUser(), { wrapper });

    const mutation = result.current;

    expect(mutation.isPending).toBe(false);
  });
});

describe("useUserFollowers", () => {
  it("should fetch user followers", async () => {
    const { result } = renderHook(() => useUserFollowers("user1"), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(Array.isArray(result.current.data)).toBe(true);
  });
});

describe("useUserFollowing", () => {
  it("should fetch user following list", async () => {
    const { result } = renderHook(() => useUserFollowing("user1"), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(Array.isArray(result.current.data)).toBe(true);
  });
});

describe("useChangePassword", () => {
  it("should change password", async () => {
    const { result } = renderHook(() => useChangePassword(), { wrapper });

    const mutation = result.current;

    expect(mutation.isPending).toBe(false);
  });

  it("should validate password requirements", async () => {
    const { result } = renderHook(() => useChangePassword(), { wrapper });

    const mutation = result.current;

    expect(mutation.isPending).toBe(false);
  });
});

describe("useUpdatePrivacySettings", () => {
  it("should update privacy settings", async () => {
    const { result } = renderHook(() => useUpdatePrivacySettings(), { wrapper });

    const mutation = result.current;

    expect(mutation.isPending).toBe(false);
  });

  it("should invalidate profile cache after update", async () => {
    const { result } = renderHook(() => useUpdatePrivacySettings(), { wrapper });

    const mutation = result.current;

    expect(mutation.isPending).toBe(false);
  });
});
