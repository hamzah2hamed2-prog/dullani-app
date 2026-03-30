import { ScrollView, Text, View, TouchableOpacity, Image, Linking, StyleSheet, ActivityIndicator, Dimensions, Share, Pressable, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { LikeButton } from "@/components/like-button";
import { useProduct, useSimilarProducts, useWishlist } from "@/hooks/use-products";

const { width } = Dimensions.get("window");

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colors = useColors();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showReportOptions, setShowReportOptions] = useState(false);
  const [showSimilarProducts, setShowSimilarProducts] = useState(true);

  // Fetch product data
  const { data: product, isLoading } = useProduct(id as string);

  // Fetch store data
  const { data: store } = trpc.stores.getById.useQuery(
    { id: product?.storeId || 0 },
    { enabled: !!product?.storeId }
  );

  // Fetch comments
  const { data: comments = [] } = trpc.comments.list.useQuery(
    { productId: parseInt(id as string), limit: 5 },
    { enabled: !!id }
  );

  // Fetch similar products
  const { data: similarProductsData = [] } = useSimilarProducts(id as string, 6);
  const similarProducts = similarProductsData;

  // Check if in wishlist
  const { data: inWishlist } = trpc.wishlist.isInWishlist.useQuery(
    { productId: parseInt(id as string) },
    { enabled: !!id }
  );

  // Wishlist mutation
  const wishlistMutation = useWishlist();

  useEffect(() => {
    if (inWishlist !== undefined) {
      setIsInWishlist(inWishlist);
    }
  }, [inWishlist]);

  const handleWishlistToggle = async () => {
    const nextState = !isInWishlist;
    setIsInWishlist(nextState);
    try {
      await wishlistMutation.mutateAsync({
        productId: id as string,
        inWishlist: isInWishlist,
      });
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

  const handleDirectMessage = () => {
    if (store?.id) {
      router.push(`/(tabs)/messages/new?storeId=${store.id}`);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `تحقق من هذا المنتج: ${product?.name}\n${product?.description}\nالسعر: ${product?.price} ريال\nعلى تطبيق دلني 🛍️`,
        title: product?.name,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleReport = (reason: string) => {
    alert(`تم إرسال البلاغ: ${reason}`);
    setShowReportOptions(false);
  };

  if (isLoading) {
    return (
      <ScreenContainer>
        <View style={[styles.centered, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  if (!product) {
    return (
      <ScreenContainer>
        <View style={[styles.centered, { backgroundColor: colors.background }]}>
          <Text style={{ color: colors.foreground }}>المنتج غير موجود</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={["top"]}>
      <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>تفاصيل المنتج</Text>
          <TouchableOpacity onPress={() => setShowReportOptions(!showReportOptions)}>
            <IconSymbol name="ellipsis" size={24} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        {/* Report Options */}
        {showReportOptions && (
          <View style={[styles.reportPanel, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => handleReport("محتوى غير مناسب")}>
              <Text style={[styles.reportOption, { color: colors.foreground }]}>محتوى غير مناسب</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleReport("منتج مزيف")}>
              <Text style={[styles.reportOption, { color: colors.foreground }]}>منتج مزيف</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleReport("سعر خاطئ")}>
              <Text style={[styles.reportOption, { color: colors.foreground }]}>سعر خاطئ</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleReport("محتوى مسيء")}>
              <Text style={[styles.reportOption, { color: colors.foreground }]}>محتوى مسيء</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Product Image */}
        <Image
          source={{ uri: product.image || "https://via.placeholder.com/400" }}
          style={{ width, height: 300 }}
          resizeMode="cover"
        />

        {/* Store Header */}
        {store && (
          <View style={[styles.storeHeader, { borderBottomColor: colors.border }]}>
            <View style={styles.storeInfo}>
              <Text style={[styles.storeName, { color: colors.foreground }]}>{store.name}</Text>
              <Text style={[styles.storeRating, { color: colors.muted }]}>⭐ 4.5 (120 تقييم)</Text>
            </View>
            <TouchableOpacity
              style={[styles.followButton, { backgroundColor: colors.primary }]}
              onPress={() => alert("تمت المتابعة")}
            >
              <Text style={{ color: colors.background, fontWeight: "600" }}>متابعة</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Product Info */}
        <View style={[styles.infoSection, { borderBottomColor: colors.border }]}>
          <Text style={[styles.productName, { color: colors.foreground }]}>{product.name}</Text>
          <Text style={[styles.productPrice, { color: colors.primary }]}>{product.price} ريال</Text>
          <Text style={[styles.productDescription, { color: colors.muted }]}>{product.description}</Text>
        </View>

        {/* Action Buttons */}
        <View style={[styles.actionButtons, { borderBottomColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={handleWishlistToggle}
          >
            <IconSymbol name={isInWishlist ? "heart.fill" : "heart"} size={20} color={colors.primary} />
            <Text style={[styles.actionButtonText, { color: colors.foreground }]}>
              {isInWishlist ? "محفوظ" : "حفظ"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={handleShare}
          >
            <IconSymbol name="square.and.arrow.up" size={20} color={colors.primary} />
            <Text style={[styles.actionButtonText, { color: colors.foreground }]}>مشاركة</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={handleDirectMessage}
          >
            <IconSymbol name="paperplane" size={20} color={colors.primary} />
            <Text style={[styles.actionButtonText, { color: colors.foreground }]}>رسالة</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Store Button */}
        <TouchableOpacity
          style={[styles.contactButton, { backgroundColor: colors.primary }]}
          onPress={handleContactStore}
        >
          <IconSymbol name="phone.fill" size={18} color={colors.background} />
          <Text style={[styles.contactButtonText, { color: colors.background }]}>تواصل عبر واتساب</Text>
        </TouchableOpacity>

        {/* Comments Section */}
        <View style={[styles.commentsSection, { borderTopColor: colors.border }]}>
          <View style={styles.commentsHeader}>
            <Text style={[styles.commentsTitle, { color: colors.foreground }]}>التعليقات ({comments.length})</Text>
            <TouchableOpacity onPress={() => setShowComments(!showComments)}>
              <IconSymbol
                name={showComments ? "chevron.up" : "chevron.down"}
                size={20}
                color={colors.foreground}
              />
            </TouchableOpacity>
          </View>

          {showComments && (
            <View>
              {comments.length > 0 ? (
                comments.map((comment: any) => (
                  <View key={comment.id} style={[styles.commentItem, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.commentAuthor, { color: colors.foreground }]}>
                      {comment.userName}
                    </Text>
                    <Text style={[styles.commentText, { color: colors.muted }]}>{comment.text}</Text>
                  </View>
                ))
              ) : (
                <Text style={[styles.noComments, { color: colors.muted }]}>لا توجد تعليقات حتى الآن</Text>
              )}

              <TouchableOpacity
                style={[styles.addCommentButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => router.push(`/(tabs)/product/${id}/comments`)}
              >
                <Text style={[styles.addCommentText, { color: colors.primary }]}>أضف تعليقك</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <View style={[styles.similarSection, { borderTopColor: colors.border }]}>
            <View style={styles.similarHeader}>
              <Text style={[styles.similarTitle, { color: colors.foreground }]}>منتجات مشابهة</Text>
              <TouchableOpacity onPress={() => setShowSimilarProducts(!showSimilarProducts)}>
                <IconSymbol
                  name={showSimilarProducts ? "chevron.up" : "chevron.down"}
                  size={20}
                  color={colors.foreground}
                />
              </TouchableOpacity>
            </View>

            {showSimilarProducts && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.similarList}>
                {similarProducts.slice(0, 5).map((item: any) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.similarItem, { backgroundColor: colors.surface }]}
                    onPress={() => router.push(`/(tabs)/product/${item.id}`)}
                  >
                    <Image
                      source={{ uri: item.image || "https://via.placeholder.com/100" }}
                      style={styles.similarImage}
                      resizeMode="cover"
                    />
                    <Text style={[styles.similarName, { color: colors.foreground }]} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <Text style={[styles.similarPrice, { color: colors.primary }]}>{item.price} ريال</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  reportPanel: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
  },
  reportOption: {
    paddingVertical: 10,
    fontSize: 14,
  },
  storeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  storeRating: {
    fontSize: 12,
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  infoSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  productDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 0.5,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "500",
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingVertical: 12,
    borderRadius: 8,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  commentsSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 0.5,
  },
  commentsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  commentsTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  commentItem: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  commentAuthor: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  commentText: {
    fontSize: 13,
  },
  noComments: {
    fontSize: 13,
    textAlign: "center",
    paddingVertical: 10,
  },
  addCommentButton: {
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 0.5,
    marginTop: 10,
  },
  addCommentText: {
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
  },
  similarSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 0.5,
  },
  similarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  similarTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  similarList: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  similarItem: {
    width: 100,
    marginRight: 12,
    borderRadius: 8,
    overflow: "hidden",
  },
  similarImage: {
    width: "100%",
    height: 100,
  },
  similarName: {
    fontSize: 12,
    fontWeight: "500",
    paddingHorizontal: 8,
    paddingTop: 6,
  },
  similarPrice: {
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingBottom: 6,
  },
});
