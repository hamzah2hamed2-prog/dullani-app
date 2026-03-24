import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import { IconSymbol } from "./ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";
import { LikeButton } from "./like-button";

const { width } = Dimensions.get("window");

interface ProductCardEnhancedProps {
  id: number;
  name: string;
  price: string;
  image: string;
  storeName: string;
  category: string;
  description?: string;
  onWishlistToggle?: (id: number, isWishlisted: boolean) => void;
  isWishlisted?: boolean;
  rating?: number;
  ratingCount?: number;
  likesCount?: number;
  commentsCount?: number;
}

export function ProductCardEnhanced({
  id,
  name,
  price,
  image,
  storeName,
  category,
  description,
  onWishlistToggle,
  isWishlisted = false,
  rating = 0,
  ratingCount = 0,
  likesCount = 0,
  commentsCount = 0,
}: ProductCardEnhancedProps) {
  const colors = useColors();
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/(tabs)/product/[id]",
      params: { id: id.toString() },
    });
  };

  const handleStorePress = () => {
    // Navigate to store profile if we have storeId, for now just a placeholder
    // router.push(`/(tabs)/store/${storeId}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header - Instagram Style */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleStorePress} style={styles.headerLeft}>
          <View style={[styles.avatarContainer, { borderColor: colors.primary }]}>
            <Image
              source={{ uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(storeName)}&background=random` }}
              style={styles.avatar}
            />
          </View>
          <View>
            <Text style={[styles.storeName, { color: colors.foreground }]}>{storeName}</Text>
            <Text style={[styles.location, { color: colors.muted }]}>{category}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreButton}>
          <IconSymbol name="ellipsis.horizontal" size={20} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      {/* Image - Instagram Style (1:1 Aspect Ratio) */}
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
        <View style={[styles.imageContainer, { backgroundColor: colors.muted }]}>
          <Image
            source={{ uri: image }}
            style={styles.image}
            resizeMode="cover"
          />
          {/* Price Tag Overlay */}
          <View style={[styles.priceTag, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
            <Text style={styles.priceText}>{price} ر.س</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Action Bar - Instagram Style */}
      <View style={styles.actionBar}>
        <View style={styles.actionLeft}>
          <LikeButton productId={id} size={26} showCount={false} />
          <TouchableOpacity onPress={handlePress} style={styles.actionItem}>
            <IconSymbol name="bubble.right" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <IconSymbol name="paperplane" size={24} color={colors.foreground} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => onWishlistToggle?.(id, !isWishlisted)}>
          <IconSymbol 
            name={isWishlisted ? "bookmark.fill" : "bookmark"} 
            size={24} 
            color={isWishlisted ? colors.primary : colors.foreground} 
          />
        </TouchableOpacity>
      </View>

      {/* Social Stats & Caption */}
      <View style={styles.content}>
        <Text style={[styles.likesCount, { color: colors.foreground }]}>
          {likesCount || 0} إعجاب
        </Text>
        
        <View style={styles.captionContainer}>
          <Text style={[styles.captionName, { color: colors.foreground }]}>{storeName}</Text>
          <Text style={[styles.captionText, { color: colors.foreground }]}>
            <Text style={{ fontWeight: 'bold' }}>{name}</Text> {description || "اكتشف هذا المنتج الرائع في متجرنا اليوم!"}
          </Text>
        </View>

        {commentsCount > 0 && (
          <TouchableOpacity onPress={handlePress}>
            <Text style={[styles.viewComments, { color: colors.muted }]}>
              عرض جميع التعليقات ({commentsCount})
            </Text>
          </TouchableOpacity>
        )}

        <Text style={[styles.timeAgo, { color: colors.muted }]}>منذ ساعتين</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    marginBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  storeName: {
    fontSize: 13,
    fontWeight: '700',
  },
  location: {
    fontSize: 11,
  },
  moreButton: {
    padding: 4,
  },
  imageContainer: {
    width: width,
    height: width, // 1:1 Aspect Ratio
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  priceTag: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  priceText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionItem: {
    padding: 2,
  },
  content: {
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  likesCount: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  captionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: 6,
  },
  captionName: {
    fontSize: 13,
    fontWeight: '700',
  },
  captionText: {
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  viewComments: {
    fontSize: 13,
    marginBottom: 6,
  },
  timeAgo: {
    fontSize: 10,
    textTransform: 'uppercase',
  },
});

