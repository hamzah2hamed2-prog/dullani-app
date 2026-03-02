import { Pressable, View, Text } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import * as Haptics from "expo-haptics";

interface LikeButtonProps {
  productId: number;
  size?: number;
  showCount?: boolean;
}

export function LikeButton({ productId, size = 24, showCount = true }: LikeButtonProps) {
  const colors = useColors();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const likeProductMutation = trpc.social.likeProduct.useMutation();
  const unlikeProductMutation = trpc.social.unlikeProduct.useMutation();
  const isLikedQuery = trpc.social.isLikedByUser.useQuery({ productId });
  const likesCountQuery = trpc.social.getProductLikesCount.useQuery({ productId });

  useEffect(() => {
    if (isLikedQuery.data !== undefined) {
      setIsLiked(isLikedQuery.data as boolean);
    }
  }, [isLikedQuery.data]);

  useEffect(() => {
    if (typeof likesCountQuery.data === "number") {
      setLikesCount(likesCountQuery.data);
    }
  }, [likesCountQuery.data]);

  const handleLike = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      if (isLiked) {
        await unlikeProductMutation.mutateAsync({ productId });
        setIsLiked(false);
        setLikesCount(Math.max(0, likesCount - 1));
      } else {
        await likeProductMutation.mutateAsync({ productId });
        setIsLiked(true);
        setLikesCount(likesCount + 1);
      }
    } catch (error) {
      console.error("Failed to like product:", error);
    }
  };

  return (
    <Pressable
      onPress={handleLike}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.7 : 1,
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
        },
      ]}
    >
      <MaterialIcons
        name={isLiked ? "favorite" : "favorite-border"}
        size={size}
        color={isLiked ? colors.error : colors.foreground}
      />
      {showCount && (
        <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: "500" }}>
          {likesCount > 0 ? likesCount : ""}
        </Text>
      )}
    </Pressable>
  );
}
