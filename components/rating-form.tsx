import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { StarRating } from "./star-rating";
import { useColors } from "@/hooks/use-colors";

interface RatingFormProps {
  onSubmit: (rating: number, review?: string) => Promise<void>;
  isLoading?: boolean;
  placeholder?: string;
}

export function RatingForm({
  onSubmit,
  isLoading = false,
  placeholder = "شارك تقييمك (اختياري)...",
}: RatingFormProps) {
  const colors = useColors();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("يرجى اختيار تقييم");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(rating, review || undefined);
      setRating(0);
      setReview("");
    } catch (error) {
      console.error("Error submitting rating:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <Text style={[styles.title, { color: colors.foreground }]}>
        أضف تقييمك
      </Text>

      {/* Star Rating */}
      <View style={styles.ratingSection}>
        <StarRating
          rating={rating}
          size={28}
          onRatingChange={setRating}
          interactive={true}
        />
        {rating > 0 && (
          <Text style={[styles.ratingLabel, { color: colors.muted }]}>
            {rating === 1 && "سيء"}
            {rating === 2 && "مقبول"}
            {rating === 3 && "جيد"}
            {rating === 4 && "جيد جداً"}
            {rating === 5 && "ممتاز"}
          </Text>
        )}
      </View>

      {/* Review Text */}
      <TextInput
        value={review}
        onChangeText={setReview}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        multiline
        numberOfLines={3}
        maxLength={500}
        style={[
          styles.reviewInput,
          {
            backgroundColor: colors.background,
            borderColor: colors.border,
            color: colors.foreground,
          },
        ]}
      />

      {/* Character Count */}
      <Text style={[styles.charCount, { color: colors.muted }]}>
        {review.length}/500
      </Text>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={submitting || isLoading || rating === 0}
        style={[
          styles.submitButton,
          {
            backgroundColor: colors.primary,
            opacity: submitting || isLoading || rating === 0 ? 0.6 : 1,
          },
        ]}
        activeOpacity={0.7}
      >
        {submitting || isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.submitText}>إرسال التقييم</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 12,
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  ratingSection: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
  },
  ratingLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  reviewInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontWeight: "500",
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 11,
    fontWeight: "500",
    textAlign: "right",
  },
  submitButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  submitText: {
    color: "white",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
