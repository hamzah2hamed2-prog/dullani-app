import { View, Text, TouchableOpacity, Image } from "react-native";
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
      activeOpacity={0.7}
      className="bg-surface rounded-2xl overflow-hidden border border-border"
      style={{
        shadowColor: colors.foreground,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      {/* Image Container */}
      <View className="relative w-full h-48 bg-muted overflow-hidden">
        <Image
          source={{ uri: image }}
          className="w-full h-full"
          resizeMode="cover"
        />

        {/* Category Badge */}
        <View
          className="absolute top-3 left-3 bg-primary/90 rounded-full px-3 py-1"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-white text-xs font-semibold">{category}</Text>
        </View>

        {/* Wishlist Button */}
        <TouchableOpacity
          onPress={handleWishlist}
          className="absolute top-3 right-3 bg-white/90 rounded-full p-2"
          style={{
            backgroundColor: isWishlisted ? colors.error : "rgba(255,255,255,0.9)",
          }}
        >
          <IconSymbol
            size={20}
            name="heart.fill"
            color={isWishlisted ? "white" : colors.error}
          />
        </TouchableOpacity>
      </View>

      {/* Content Container */}
      <View className="p-3">
        {/* Product Name */}
        <Text
          numberOfLines={2}
          className="text-sm font-bold text-foreground mb-1"
        >
          {name}
        </Text>

        {/* Store Name */}
        <View className="flex-row items-center mb-2">
          <IconSymbol size={14} name="storefront.fill" color={colors.muted} />
          <Text numberOfLines={1} className="text-xs text-muted ml-1">
            {storeName}
          </Text>
        </View>

        {/* Price and Action */}
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-bold text-primary">{price} ر.س</Text>
          <TouchableOpacity
            onPress={handlePress}
            className="bg-primary/10 rounded-lg px-2 py-1"
            style={{ backgroundColor: `${colors.primary}15` }}
          >
            <IconSymbol size={16} name="chevron.right" color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
