import { View, Text, StyleSheet, ScrollView, FlatList } from "react-native";
import { StarRating } from "./star-rating";
import { useColors } from "@/hooks/use-colors";

interface Review {
  id: number;
  userId: number;
  rating: number;
  review?: string;
  createdAt: string;
  userName?: string;
}

interface ReviewsDisplayProps {
  reviews: Review[];
  averageRating: number;
  totalCount: number;
  isLoading?: boolean;
}

export function ReviewsDisplay({
  reviews,
  averageRating,
  totalCount,
  isLoading = false,
}: ReviewsDisplayProps) {
  const colors = useColors();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={[styles.loadingText, { color: colors.muted }]}>
          جاري تحميل التقييمات...
        </Text>
      </View>
    );
  }

  if (totalCount === 0) {
    return (
      <View style={styles.container}>
        <Text style={[styles.emptyText, { color: colors.muted }]}>
          لا توجد تقييمات حتى الآن
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Rating Summary */}
      <View
        style={[
          styles.summaryContainer,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View style={styles.summaryLeft}>
          <Text style={[styles.averageRating, { color: colors.foreground }]}>
            {averageRating.toFixed(1)}
          </Text>
          <StarRating rating={averageRating} size={14} />
          <Text style={[styles.totalCount, { color: colors.muted }]}>
            {totalCount} تقييم
          </Text>
        </View>
      </View>

      {/* Reviews List */}
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View
            style={[
              styles.reviewItem,
              { borderBottomColor: colors.border },
            ]}
          >
            <View style={styles.reviewHeader}>
              <StarRating rating={item.rating} size={12} />
              <Text style={[styles.reviewDate, { color: colors.muted }]}>
                {new Date(item.createdAt).toLocaleDateString("ar-SA")}
              </Text>
            </View>
            {item.review && (
              <Text style={[styles.reviewText, { color: colors.foreground }]}>
                {item.review}
              </Text>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    paddingVertical: 20,
  },
  summaryContainer: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  summaryLeft: {
    alignItems: "center",
    gap: 6,
  },
  averageRating: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  totalCount: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },
  reviewItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 11,
    fontWeight: "500",
  },
  reviewText: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
  },
});
