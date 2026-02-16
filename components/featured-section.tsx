import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";
import { ProductCardEnhanced } from "./product-card-enhanced";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  storeName: string;
  category: string;
  rating?: number;
  ratingCount?: number;
}

interface FeaturedSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  onViewAll?: () => void;
  isLoading?: boolean;
}

export function FeaturedSection({
  title,
  subtitle,
  products,
  onViewAll,
  isLoading = false,
}: FeaturedSectionProps) {
  const colors = useColors();
  const router = useRouter();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          {title}
        </Text>
        <Text style={[styles.loadingText, { color: colors.muted }]}>
          جاري التحميل...
        </Text>
      </View>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: colors.muted }]}>
              {subtitle}
            </Text>
          )}
        </View>
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

      {/* Products Grid */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <ProductCardEnhanced
              id={item.id}
              name={item.name}
              price={item.price}
              image={item.image}
              storeName={item.storeName}
              category={item.category}
              rating={item.rating}
              ratingCount={item.ratingCount}
            />
          </View>
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
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
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
  columnWrapper: {
    gap: 12,
  },
  cardWrapper: {
    flex: 1,
    maxWidth: "50%",
  },
});
