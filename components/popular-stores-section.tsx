import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";
import { StarRating } from "./star-rating";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface Store {
  id: number;
  name: string;
  logo: string;
  rating: number;
  ratingCount: number;
  category?: string;
}

interface PopularStoresSectionProps {
  stores: Store[];
  onViewAll?: () => void;
  isLoading?: boolean;
}

export function PopularStoresSection({
  stores,
  onViewAll,
  isLoading = false,
}: PopularStoresSectionProps) {
  const colors = useColors();
  const router = useRouter();

  const handleStorePress = (storeId: number) => {
    router.push({
      pathname: "/(tabs)/store/[id]",
      params: { id: storeId.toString() },
    });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          المتاجر المشهورة
        </Text>
        <Text style={[styles.loadingText, { color: colors.muted }]}>
          جاري التحميل...
        </Text>
      </View>
    );
  }

  if (stores.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          المتاجر المشهورة
        </Text>
        {onViewAll && (
          <TouchableOpacity
            onPress={onViewAll}
            style={styles.viewAllButton}
            activeOpacity={0.7}
          >
            <Text style={[styles.viewAllText, { color: colors.primary }]}>
              عرض الكل
            </Text>
            <MaterialIcons
              name="chevron-right"
              size={16}
              color={colors.primary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Stores Horizontal List */}
      <FlatList
        data={stores}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleStorePress(item.id)}
            style={[
              styles.storeCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
            activeOpacity={0.8}
          >
            {/* Store Logo */}
            <View
              style={[
                styles.logoContainer,
                { backgroundColor: colors.muted },
              ]}
            >
              <Image
                source={{ uri: item.logo }}
                style={styles.logo}
                resizeMode="cover"
              />
            </View>

            {/* Store Info */}
            <View style={styles.storeInfo}>
              <Text
                numberOfLines={1}
                style={[styles.storeName, { color: colors.foreground }]}
              >
                {item.name}
              </Text>

              {/* Rating */}
              <View style={styles.ratingContainer}>
                <StarRating rating={item.rating} size={10} />
                <Text style={[styles.ratingCount, { color: colors.muted }]}>
                  ({item.ratingCount})
                </Text>
              </View>

              {/* Category */}
              {item.category && (
                <Text
                  numberOfLines={1}
                  style={[styles.category, { color: colors.muted }]}
                >
                  {item.category}
                </Text>
              )}
            </View>

            {/* Arrow Icon */}
            <MaterialIcons
              name="chevron-right"
              size={16}
              color={colors.primary}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: "600",
  },
  loadingText: {
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    paddingVertical: 20,
  },
  listContent: {
    gap: 12,
    paddingRight: 4,
  },
  storeCard: {
    width: 160,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 8,
    flexDirection: "column",
  },
  logoContainer: {
    width: "100%",
    height: 100,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 4,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  storeInfo: {
    gap: 4,
    flex: 1,
  },
  storeName: {
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 16,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingCount: {
    fontSize: 10,
    fontWeight: "500",
  },
  category: {
    fontSize: 10,
    fontWeight: "500",
  },
  arrowIcon: {
    position: "absolute",
    top: 12,
    right: 12,
  },
});
