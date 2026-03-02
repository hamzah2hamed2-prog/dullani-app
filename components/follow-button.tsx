import { Pressable, Text } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import * as Haptics from "expo-haptics";

interface FollowButtonProps {
  storeId: number;
  size?: number;
}

export function FollowButton({ storeId, size = 16 }: FollowButtonProps) {
  const colors = useColors();
  const [isFollowing, setIsFollowing] = useState(false);

  const followStoreMutation = trpc.social.followStore.useMutation();
  const unfollowStoreMutation = trpc.social.unfollowStore.useMutation();
  const isFollowingQuery = trpc.social.isFollowingStore.useQuery({ storeId });

  useEffect(() => {
    if (isFollowingQuery.data !== undefined) {
      setIsFollowing(isFollowingQuery.data as boolean);
    }
  }, [isFollowingQuery.data]);

  const handleFollow = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      if (isFollowing) {
        await unfollowStoreMutation.mutateAsync({ storeId });
        setIsFollowing(false);
      } else {
        await followStoreMutation.mutateAsync({ storeId });
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Failed to follow store:", error);
    }
  };

  return (
    <Pressable
      onPress={handleFollow}
      style={({ pressed }) => [
        {
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 20,
          backgroundColor: isFollowing ? colors.primary : colors.surface,
          borderWidth: 1,
          borderColor: isFollowing ? colors.primary : colors.border,
          opacity: pressed ? 0.7 : 1,
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
        },
      ]}
    >
      <MaterialIcons
        name={isFollowing ? "check" : "add"}
        size={size}
        color={isFollowing ? "white" : colors.primary}
      />
      <Text
        style={{
          color: isFollowing ? "white" : colors.primary,
          fontSize: 12,
          fontWeight: "600",
        }}
      >
        {isFollowing ? "متابع" : "متابعة"}
      </Text>
    </Pressable>
  );
}
