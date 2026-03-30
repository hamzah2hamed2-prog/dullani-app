import { ScrollView, Text, View, TouchableOpacity, Image, FlatList, Linking, ActivityIndicator, StyleSheet, Dimensions } from "react-native";
import { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { FollowButton } from "@/components/follow-button";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useStore, useStoreProducts, useStoreRatings, useFollowStore } from "@/hooks/use-stores";

const { width } = Dimensions.get("window");

export default function StoreProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colors = useColors();
  const [followersCount, setFollowersCount] = useState(0);
  const [showStoreHours, setShowStoreHours] = useState(false);
  const [showRatings, setShowRatings] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);

  const { data: store, isLoading } = useStore(id as string);
  const { data: products = [], isLoading: productsLoading } = useStoreProducts(id as string);
  const { data: ratings } = useStoreRatings(id as string);
  const followMutation = useFollowStore();

  useEffect(() => {
    if (store?.followersCount) {
      setFollowersCount(store.followersCount);
    }
  }, [store?.followersCount]);

  const handleFollowStore = async () => {
    try {
      await followMutation.mutateAsync({
        storeId: id as string,
        following: store?.isFollowing || false,
      });
    } catch (error) {
      console.error("Error following store:", error);
    }
  };

  const handleContactStore = () => {
    if (store?.phone) {
      const message = `مرحبا، أود الاستفسار عن منتجاتك على تطبيق دلني`;
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

  if (isLoading) {
    return (
      <ScreenContainer>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  if (!store) {
    return (
      <ScreenContainer>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
          <Text style={{ color: colors.foreground }}>المتجر غير موجود</Text>
        </View>
      </ScreenContainer>
    );
  }

  const storeHours = {
    saturday: "9:00 - 21:00",
    sunday: "9:00 - 21:00",
    monday: "9:00 - 21:00",
    tuesday: "9:00 - 21:00",
    wednesday: "9:00 - 21:00",
    thursday: "9:00 - 21:00",
    friday: "12:00 - 23:00",
  };

  const storeRatings = [
    { stars: 5, count: 45, percentage: 60 },
    { stars: 4, count: 20, percentage: 27 },
    { stars: 3, count: 8, percentage: 11 },
    { stars: 2, count: 2, percentage: 2 },
    { stars: 1, count: 0, percentage: 0 },
  ];

  return (
    <ScreenContainer style={{ padding: 0 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
            <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>ملف المتجر</Text>
          <View style={{ width: 32 }} />
        </View>

        <View style={[styles.profileSection, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Image
            source={{ uri: store.image || "https://via.placeholder.com/400" }}
            style={styles.storeImage}
          />
          <View style={styles.storeInfoContainer}>
            <Text style={[styles.storeName, { color: colors.foreground }]}>{store.name}</Text>
            <View style={styles.ratingRow}>
              <Text style={[styles.rating, { color: colors.primary }]}>⭐ 4.5</Text>
              <Text style={[styles.reviewCount, { color: colors.muted }]}>(120 تقييم)</Text>
            </View>
            <Text style={[styles.storeDescription, { color: colors.muted }]}>{store.description}</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.primary }]}>{products.length}</Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>منتج</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.primary }]}>{followersCount}</Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>متابع</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.primary }]}>98%</Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>رضا</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.actionButtons, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={handleContactStore}
          >
            <Text style={[styles.actionButtonText, { color: colors.background }]}>واتساب</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 0.5 }]}
            onPress={handleDirectMessage}
          >
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>رسالة</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 0.5 }]}
            onPress={() => router.push(`/(tabs)/store/${store.id}/map`)}
          >
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>الخريطة</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setShowStoreHours(!showStoreHours)}
          >
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>ساعات العمل</Text>
            <IconSymbol
              name={showStoreHours ? "chevron.up" : "chevron.down"}
              size={20}
              color={colors.foreground}
            />
          </TouchableOpacity>

          {showStoreHours && (
            <View style={[styles.hoursContainer, { backgroundColor: colors.surface }]}>
              {Object.entries(storeHours).map(([day, hours]) => (
                <View key={day} style={[styles.hourRow, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.dayName, { color: colors.foreground }]}>
                    {day === "saturday" && "السبت"}
                    {day === "sunday" && "الأحد"}
                    {day === "monday" && "الاثنين"}
                    {day === "tuesday" && "الثلاثاء"}
                    {day === "wednesday" && "الأربعاء"}
                    {day === "thursday" && "الخميس"}
                    {day === "friday" && "الجمعة"}
                  </Text>
                  <Text style={[styles.hours, { color: colors.muted }]}>{hours}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={[styles.section, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setShowContactInfo(!showContactInfo)}
          >
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>معلومات التواصل</Text>
            <IconSymbol
              name={showContactInfo ? "chevron.up" : "chevron.down"}
              size={20}
              color={colors.foreground}
            />
          </TouchableOpacity>

          {showContactInfo && (
            <View style={[styles.contactContainer, { backgroundColor: colors.surface }]}>
              {store.phone && (
                <TouchableOpacity
                  style={[styles.contactItem, { borderBottomColor: colors.border }]}
                  onPress={() => Linking.openURL(`tel:${store.phone}`)}
                >
                  <Text style={[styles.contactText, { color: colors.foreground }]}>{store.phone}</Text>
                </TouchableOpacity>
              )}
              {store.email && (
                <TouchableOpacity
                  style={[styles.contactItem, { borderBottomColor: colors.border }]}
                  onPress={() => Linking.openURL(`mailto:${store.email}`)}
                >
                  <Text style={[styles.contactText, { color: colors.foreground }]}>{store.email}</Text>
                </TouchableOpacity>
              )}
              {store.address && (
                <View style={styles.contactItem}>
                  <Text style={[styles.contactText, { color: colors.foreground }]}>{store.address}</Text>
                </View>
              )}
            </View>
          )}
        </View>

        <View style={[styles.section, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setShowRatings(!showRatings)}
          >
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>التقييمات</Text>
            <IconSymbol
              name={showRatings ? "chevron.up" : "chevron.down"}
              size={20}
              color={colors.foreground}
            />
          </TouchableOpacity>

          {showRatings && (
            <View style={[styles.ratingsContainer, { backgroundColor: colors.surface }]}>
              <View style={styles.overallRating}>
                <Text style={[styles.overallScore, { color: colors.primary }]}>4.5</Text>
                <Text style={[styles.totalReviews, { color: colors.muted }]}>من 75 تقييم</Text>
              </View>

              {storeRatings.map((rating) => (
                <View key={rating.stars} style={styles.ratingBar}>
                  <Text style={[styles.ratingStarText, { color: colors.foreground }]}>
                    {rating.stars} ⭐
                  </Text>
                  <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${rating.percentage}%`,
                          backgroundColor: colors.primary,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.ratingCount, { color: colors.muted }]}>{rating.count}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, paddingHorizontal: 16, paddingTop: 16 }]}>
            منتجات المتجر ({products.length})
          </Text>
          {productsLoading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
          ) : products.length > 0 ? (
            <FlatList
              data={products}
              renderItem={({ item }: any) => (
                <TouchableOpacity
                  style={[styles.productCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  onPress={() => router.push(`/(tabs)/product/${item.id}`)}
                >
                  <Image source={{ uri: item.image }} style={styles.productImage} />
                  <View style={styles.productInfo}>
                    <Text style={[styles.productName, { color: colors.foreground }]} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <Text style={[styles.productPrice, { color: colors.primary }]}>{item.price} ريال</Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item: any) => item.id.toString()}
              scrollEnabled={false}
              numColumns={2}
              columnWrapperStyle={{ gap: 8, paddingHorizontal: 16 }}
              contentContainerStyle={{ paddingVertical: 12, gap: 8 }}
            />
          ) : (
            <Text style={[styles.noProducts, { color: colors.muted }]}>لا توجد منتجات</Text>
          )}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profileSection: {
    borderBottomWidth: 0.5,
  },
  storeImage: {
    width: "100%",
    height: 200,
  },
  storeInfoContainer: {
    padding: 16,
  },
  storeName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
  },
  reviewCount: {
    fontSize: 12,
  },
  storeDescription: {
    fontSize: 13,
    marginBottom: 12,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
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
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 6,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  section: {
    borderBottomWidth: 0.5,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  hoursContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  hourRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
  },
  dayName: {
    fontSize: 13,
    fontWeight: "500",
  },
  hours: {
    fontSize: 13,
  },
  contactContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  contactText: {
    fontSize: 13,
    flex: 1,
  },
  ratingsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  overallRating: {
    alignItems: "center",
    marginBottom: 16,
  },
  overallScore: {
    fontSize: 28,
    fontWeight: "bold",
  },
  totalReviews: {
    fontSize: 12,
    marginTop: 4,
  },
  ratingBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
  },
  ratingCount: {
    fontSize: 12,
    width: 30,
    textAlign: "right",
  },
  productCard: {
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 0.5,
  },
  productImage: {
    width: "100%",
    height: 120,
  },
  productInfo: {
    padding: 8,
  },
  productName: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 12,
    fontWeight: "bold",
  },
  noProducts: {
    textAlign: "center",
    paddingVertical: 20,
    fontSize: 13,
  },
});
