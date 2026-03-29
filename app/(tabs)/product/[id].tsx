import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, View, TouchableOpacity, Image, Linking, StyleSheet, ActivityIndicator, Dimensions } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { LikeButton } from "@/components/like-button";

const { width } = Dimensions.get("window");

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colors = useColors();
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Fetch product data
  const { data: product, isLoading } = trpc.products.getById.useQuery(
    { id: parseInt(id as string) },
    { enabled: !!id }
  );

  // Fetch store data if product exists
  const { data: store } = trpc.stores.getById.useQuery(
    { id: product?.storeId || 0 },
    { enabled: !!product?.storeId }
  );

  // Check if in wishlist
  const { data: inWishlist } = trpc.wishlist.isInWishlist.useQuery(
    { productId: parseInt(id as string) },
    { enabled: !!id }
  );

  // Wishlist mutations
  const addMutation = trpc.wishlist.add.useMutation({
    onSuccess: () => setIsInWishlist(true),
  });

  const removeMutation = trpc.wishlist.remove.useMutation({
    onSuccess: () => setIsInWishlist(false),
  });

  useEffect(() => {
    if (inWishlist !== undefined) {
      setIsInWishlist(inWishlist);
    }
  }, [inWishlist]);

  const handleWishlistToggle = async () => {
    const nextState = !isInWishlist;
    setIsInWishlist(nextState);
    try {
      if (nextState) {
        await addMutation.mutateAsync({ productId: parseInt(id as string) });
      } else {
        await removeMutation.mutateAsync({ productId: parseInt(id as string) });
      }
    } catch (error) {
      setIsInWishlist(!nextState);
    }
  };

  const handleContactStore = () => {
    if (store?.phone) {
      const message = `مرحبا، رأيت هذا المنتج "${product?.name}" على تطبيق دلني، هل ما زال متوفرا؟`;
      const whatsappUrl = `https://wa.me/${store.phone}?text=${encodeURIComponent(message)}`;
      Linking.openURL(whatsappUrl).catch(() => {
        alert("لا يمكن فتح واتساب");
      });
    }
  };

  const styles = StyleSheet.create({
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderBottomWidth: 0.5,
    },
    headerTitle: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    headerButton: {
      padding: 4,
    },
    storeHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
    },
    avatarContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 1.5,
      padding: 2,
    },
    avatar: {
      width: '100%',
      height: '100%',
      borderRadius: 18,
    },
    storeName: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    storeLocation: {
      fontSize: 12,
    },
    imageContainer: {
      width: width,
      height: width,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    actionBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    actionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
    },
    actionItem: {
      padding: 2,
    },
    priceTag: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
    },
    priceText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    content: {
      paddingHorizontal: 16,
    },
    productName: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    divider: {
      height: 0.5,
      backgroundColor: 'rgba(0,0,0,0.1)',
      marginVertical: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    description: {
      fontSize: 15,
      lineHeight: 22,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8,
    },
    infoText: {
      fontSize: 14,
    },
    stockDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    contactSection: {
      padding: 16,
      gap: 12,
      marginTop: 20,
    },
    contactButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 14,
      borderRadius: 12,
      gap: 10,
    },
    contactButtonText: {
      color: 'white', 
      fontSize: 16,
      fontWeight: 'bold',
    },
    mapButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 14,
      borderRadius: 12,
      gap: 10,
    },
    mapButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  if (isLoading) {
    return (
      <ScreenContainer>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  if (!product) {
    return (
      <ScreenContainer>
        <View style={styles.centered}>
          <Text style={{ color: colors.muted }}>المنتج غير موجود</Text>
          <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
            <Text style={{ color: colors.primary }}>العودة</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={["top"]} style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
            <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>تفاصيل المنتج</Text>
          <TouchableOpacity onPress={handleWishlistToggle} style={styles.headerButton}>
            <IconSymbol 
              name={isInWishlist ? "bookmark.fill" : "bookmark"} 
              size={24} 
              color={isInWishlist ? colors.primary : colors.foreground} 
            />
          </TouchableOpacity>
        </View>

        {/* Store Info Header (Instagram style) */}
        {store && (
          <TouchableOpacity 
            style={styles.storeHeader}
            onPress={() => router.push(`/(tabs)/store/${store.id}`)}
          >
            <View style={[styles.avatarContainer, { borderColor: colors.primary }]}>
              <Image
                source={{ uri: store.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(store.name)}&background=random` }}
                style={styles.avatar}
              />
            </View>
            <View>
              <Text style={[styles.storeName, { color: colors.foreground }]}>{store.name}</Text>
              <Text style={[styles.storeLocation, { color: colors.muted }]}>{store.address || "متجر محلي"}</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Product Image */}
        <View style={[styles.imageContainer, { backgroundColor: colors.muted }]}>
          <Image
            source={{ uri: product.image || "https://via.placeholder.com/600" }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* Action Bar */}
        <View style={styles.actionBar}>
          <View style={styles.actionLeft}>
            <LikeButton productId={product.id} size={28} showCount={false} />
            <TouchableOpacity 
              style={styles.actionItem}
              onPress={() => router.push(`/(tabs)/product/${product.id}/comments`)}
            >
              <IconSymbol name="bubble.right" size={26} color={colors.foreground} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem}>
              <IconSymbol name="paperplane" size={26} color={colors.foreground} />
            </TouchableOpacity>
          </View>
          <View style={[styles.priceTag, { backgroundColor: colors.primary }]}>
            <Text style={styles.priceText}>{product.price} ر.س</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.productName, { color: colors.foreground }]}>{product.name}</Text>
          
          <View style={styles.divider} />
          
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>الوصف</Text>
          <Text style={[styles.description, { color: colors.foreground }]}>
            {product.description || "لا يوجد وصف متوفر لهذا المنتج حالياً."}
          </Text>

          <View style={styles.divider} />

          {/* Additional Info */}
          <View style={styles.infoRow}>
            <IconSymbol name="tag.fill" size={16} color={colors.muted} />
            <Text style={[styles.infoText, { color: colors.muted }]}>الفئة: {product.category || "عام"}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <View style={[styles.stockDot, { backgroundColor: product.inStock ? colors.success : colors.error }]} />
            <Text style={[styles.infoText, { color: colors.muted }]}>
              {product.inStock ? "متوفر حالياً" : "غير متوفر في المخزون"}
            </Text>
          </View>
        </View>

        {/* Contact Store Section */}
        <View style={styles.contactSection}>
          <TouchableOpacity
            onPress={handleContactStore}
            style={[styles.contactButton, { backgroundColor: colors.primary }]}
          >
            <IconSymbol name="phone.fill" size={20} color="white" />
            <Text style={styles.contactButtonText}>تواصل عبر واتساب</Text>
          </TouchableOpacity>
          
          {store?.address && (
            <TouchableOpacity 
              onPress={() => router.push(`/(tabs)/store/${store.id}/map`)}
              style={[styles.mapButton, { borderColor: colors.primary, borderWidth: 1 }]}
            >
              <IconSymbol name="map.fill" size={20} color={colors.primary} />
              <Text style={[styles.mapButtonText, { color: colors.primary }]}>موقع المتجر على الخريطة</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}
