import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { IconSymbol } from "./ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";

interface ProductCardEnhancedProps {
  id: number;
  name: string;
  price: string;
  image: string;
  storeName: string;
  category: string;
  onWishlistToggle?: (id: number, isWishlisted: boolean) => void;
  isWishlisted?: boolean;
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
            size={20}
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
          <IconSymbol size={13} name="storefront.fill" color={colors.muted} />
          <Text
            numberOfLines={1}
            style={[styles.storeName, { color: colors.muted }]}
          >
            {storeName}
          </Text>
        </View>

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
            <IconSymbol size={16} name="chevron.right" color={colors.primary} />
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 180,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  categoryBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  categoryText: {
    color: "white",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  wishlistButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 12,
  },
  productName: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
    lineHeight: 18,
  },
  storeSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 6,
  },
  storeName: {
    fontSize: 11,
    fontWeight: "500",
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
