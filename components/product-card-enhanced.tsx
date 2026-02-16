import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { IconSymbol } from "./ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";
import { StarRating } from "./star-rating";

interface ProductCardEnhancedProps {
  id: number;
  name: string;
  price: string;
  image: string;
  storeName: string;
  category: string;
  onWishlistToggle?: (id: number, isWishlisted: boolean) => void;
  isWishlisted?: boolean;
  rating?: number;
  ratingCount?: number;
}

export function ProductCardEnhanced({
  id,
  name,
  price,
  image,
  storeName,
  category,
  onWishlistToggle,
  isWishlisted = false,
  rating = 0,
  ratingCount = 0,
}: ProductCardEnhancedProps) {
  const colors = useColors();
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/(tabs)/product/[id]",
      params: { id: id.toString() },
    });
  };

  const handleWishlist = () => {
    onWishlistToggle?.(id, !isWishlisted);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.foreground,
        },
      ]}
    >
      {/* Image Container */}
      <View style={[styles.imageContainer, { backgroundColor: colors.muted }]}>
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Category Badge */}
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: colors.primary },
          ]}
        >
          <Text style={styles.categoryText}>{category}</Text>
        </View>

        {/* Wishlist Button */}
        <TouchableOpacity
          onPress={handleWishlist}
          style={[
            styles.wishlistButton,
            {
              backgroundColor: isWishlisted
                ? colors.error
                : "rgba(255,255,255,0.95)",
            },
          ]}
          activeOpacity={0.7}
        >
          <IconSymbol
            size={18}
            name="heart.fill"
            color={isWishlisted ? "white" : colors.error}
          />
        </TouchableOpacity>
      </View>

      {/* Content Container */}
      <View style={styles.content}>
        {/* Product Name */}
        <Text
          numberOfLines={2}
          style={[styles.productName, { color: colors.foreground }]}
        >
          {name}
        </Text>

        {/* Store Name */}
        <View style={styles.storeSection}>
          <IconSymbol size={12} name="storefront.fill" color={colors.muted} />
          <Text
            numberOfLines={1}
            style={[styles.storeName, { color: colors.muted }]}
          >
            {storeName}
          </Text>
        </View>

        {/* Rating */}
        {rating > 0 && (
          <View style={styles.ratingSection}>
            <StarRating rating={rating} size={11} showCount={true} count={ratingCount} />
          </View>
        )}

        {/* Price and Action */}
        <View style={styles.footer}>
          <Text style={[styles.price, { color: colors.primary }]}>
            {price} ر.س
          </Text>
          <TouchableOpacity
            onPress={handlePress}
            style={[
              styles.actionButton,
              { backgroundColor: `${colors.primary}15` },
            ]}
            activeOpacity={0.7}
          >
            <IconSymbol size={14} name="chevron.right" color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 160,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  categoryBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryText: {
    color: "white",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  wishlistButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 12,
    paddingBottom: 10,
  },
  productName: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
    lineHeight: 17,
  },
  storeSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 5,
  },
  storeName: {
    fontSize: 10,
    fontWeight: "500",
    flex: 1,
  },
  ratingSection: {
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  actionButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
});
