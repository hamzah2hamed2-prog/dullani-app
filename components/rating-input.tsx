import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { IconSymbol } from "./ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { ButtonEnhanced } from "./button-enhanced";
import { useState } from "react";

interface RatingInputProps {
  onSubmit: (rating: number, review: string) => void;
  loading?: boolean;
  onCancel?: () => void;
}

export function RatingInput({
  onSubmit,
  loading = false,
  onCancel,
}: RatingInputProps) {
  const colors = useColors();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmit = () => {
    if (rating === 0) {
      alert("يرجى اختيار تقييم");
      return;
    }
    onSubmit(rating, review);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= rating;
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => setRating(i)}
          activeOpacity={0.7}
          className="p-2"
        >
          <IconSymbol
            size={32}
            name="star.fill"
            color={isFilled ? colors.warning : `${colors.muted}40`}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <ScrollView
      className="flex-1 bg-background p-4"
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      {/* Title */}
      <Text className="text-xl font-bold text-foreground mb-4">
        أضف تقييمك
      </Text>

      {/* Rating Stars */}
      <View className="mb-6">
        <Text className="text-sm font-semibold text-foreground mb-3">
          التقييم
        </Text>
        <View className="flex-row justify-center gap-2">
          {renderStars()}
        </View>
        {rating > 0 && (
          <Text className="text-center text-sm text-muted mt-2">
            {rating} من 5 نجوم
          </Text>
        )}
      </View>

      {/* Review Text */}
      <View className="mb-6">
        <Text className="text-sm font-semibold text-foreground mb-2">
          رأيك (اختياري)
        </Text>
        <TextInput
          value={review}
          onChangeText={setReview}
          placeholder="شارك رأيك عن هذا المنتج..."
          placeholderTextColor={colors.muted}
          multiline
          numberOfLines={4}
          className="border border-border rounded-lg p-3 text-foreground"
          style={{
            borderColor: colors.border,
            color: colors.foreground,
            backgroundColor: colors.surface,
            textAlignVertical: "top",
          }}
        />
      </View>

      {/* Buttons */}
      <View className="gap-2">
        <ButtonEnhanced
          label="إرسال التقييم"
          onPress={handleSubmit}
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          disabled={rating === 0}
        />
        {onCancel && (
          <ButtonEnhanced
            label="إلغاء"
            onPress={onCancel}
            variant="outline"
            size="lg"
            fullWidth
          />
        )}
      </View>
    </ScrollView>
  );
}
