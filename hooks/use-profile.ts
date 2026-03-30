import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";

/**
 * Hook to fetch current user profile
 */
export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const result = await trpc.users.getProfile.query();
      return result;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to fetch user by ID
 */
export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      const result = await trpc.users.getById.query({ id: userId });
      return result;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to update user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name?: string;
      email?: string;
      phone?: string;
      bio?: string;
      avatar?: string;
    }) => {
      return await trpc.users.updateProfile.mutate(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

/**
 * Hook to fetch user activity
 */
export function useUserActivity(userId: string) {
  return useQuery({
    queryKey: ["userActivity", userId],
    queryFn: async () => {
      const result = await trpc.users.getActivity.query({ userId });
      return result;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch user statistics
 */
export function useUserStats(userId: string) {
  return useQuery({
    queryKey: ["userStats", userId],
    queryFn: async () => {
      const result = await trpc.users.getStats.query({ userId });
      return result;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to follow/unfollow a user
 */
export function useFollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, following }: { userId: string; following: boolean }) => {
      if (following) {
        return await trpc.users.unfollow.mutate({ userId });
      } else {
        return await trpc.users.follow.mutate({ userId });
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", variables.userId] });
    },
  });
}

/**
 * Hook to fetch user followers
 */
export function useUserFollowers(userId: string) {
  return useQuery({
    queryKey: ["userFollowers", userId],
    queryFn: async () => {
      const result = await trpc.users.getFollowers.query({ userId });
      return result;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to fetch user following
 */
export function useUserFollowing(userId: string) {
  return useQuery({
    queryKey: ["userFollowing", userId],
    queryFn: async () => {
      const result = await trpc.users.getFollowing.query({ userId });
      return result;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to change password
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }) => {
      return await trpc.users.changePassword.mutate(data);
    },
  });
}

/**
 * Hook to update privacy settings
 */
export function useUpdatePrivacySettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      isPrivate?: boolean;
      allowMessages?: boolean;
      allowFollowing?: boolean;
      showOnlineStatus?: boolean;
    }) => {
      return await trpc.users.updatePrivacySettings.mutate(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
