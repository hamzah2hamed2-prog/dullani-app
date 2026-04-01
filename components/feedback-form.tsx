import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { StarRating } from "@/components/star-rating";
import { SPACING, BORDER_RADIUS } from "@/constants/design-system";
import * as Haptics from "expo-haptics";

export type FeedbackType = "bug" | "feature" | "improvement" | "general" | "performance";

interface FeedbackFormProps {
  onSubmit: (data: FeedbackFormData) => void;
  onCancel?: () => void;
  loading?: boolean;
}

interface FeedbackFormData {
  type: FeedbackType;
  title: string;
  description: string;
  rating: number;
  email?: string;
  includeDeviceInfo: boolean;
}

/**
 * Feedback Form Component
 * Allows users to submit feedback about the app
 */
export function FeedbackForm({ onSubmit, onCancel, loading = false }: FeedbackFormProps) {
  const colors = useColors();
  const [formData, setFormData] = useState<FeedbackFormData>({
    type: "general",
    title: "",
    description: "",
    rating: 0,
    email: "",
    includeDeviceInfo: true,
  });

  const feedbackTypes: Array<{ id: FeedbackType; label: string; icon: string }> = [
    { id: "bug", label: "مشكلة", icon: "🐛" },
    { id: "feature", label: "ميزة جديدة", icon: "✨" },
    { id: "improvement", label: "تحسين", icon: "📈" },
    { id: "performance", label: "أداء", icon: "⚡" },
    { id: "general", label: "عام", icon: "💬" },
  ];

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    onSubmit(formData);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <ScrollView
      className="flex-1 p-4"
      style={{ backgroundColor: colors.background }}
      showsVerticalScrollIndicator={false}
    >
      {/* Type Selection */}
      <View className="mb-6">
        <Text className="text-sm font-semibold text-foreground mb-3">نوع الملاحظة</Text>
        <View className="flex-row flex-wrap gap-2">
          {feedbackTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              onPress={() => {
                setFormData({ ...formData, type: type.id });
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              className={`px-4 py-2 rounded-full border-2 flex-row items-center gap-2 ${
                formData.type === type.id
                  ? "border-primary"
                  : "border-border"
              }`}
              style={{
                backgroundColor:
                  formData.type === type.id ? colors.primary + "20" : "transparent",
              }}
            >
              <Text>{type.icon}</Text>
              <Text
                className={`text-xs font-semibold ${
                  formData.type === type.id ? "text-primary" : "text-foreground"
                }`}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Rating */}
      <View className="mb-6 items-center">
        <Text className="text-sm font-semibold text-foreground mb-3">التقييم</Text>
        <StarRating
          rating={formData.rating}
          onRatingChange={(rating) => setFormData({ ...formData, rating })}
          size={40}
          interactive={true}
          showLabel={true}
        />
      </View>

      {/* Title */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-foreground mb-2">العنوان *</Text>
        <TextInput
          className="border border-border rounded-lg p-3 text-foreground"
          style={{ backgroundColor: colors.surface }}
          placeholder="أدخل عنوان الملاحظة"
          placeholderTextColor={colors.muted}
          value={formData.title}
          onChangeText={(title) => setFormData({ ...formData, title })}
          maxLength={100}
          editable={!loading}
        />
        <Text className="text-xs text-muted mt-1">{formData.title.length}/100</Text>
      </View>

      {/* Description */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-foreground mb-2">الوصف *</Text>
        <TextInput
          className="border border-border rounded-lg p-3 text-foreground"
          style={{ backgroundColor: colors.surface, minHeight: 120 }}
          placeholder="اشرح الملاحظة بالتفصيل..."
          placeholderTextColor={colors.muted}
          value={formData.description}
          onChangeText={(description) => setFormData({ ...formData, description })}
          multiline={true}
          maxLength={1000}
          textAlignVertical="top"
          editable={!loading}
        />
        <Text className="text-xs text-muted mt-1">{formData.description.length}/1000</Text>
      </View>

      {/* Email */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-foreground mb-2">البريد الإلكتروني (اختياري)</Text>
        <TextInput
          className="border border-border rounded-lg p-3 text-foreground"
          style={{ backgroundColor: colors.surface }}
          placeholder="بريدك الإلكتروني"
          placeholderTextColor={colors.muted}
          value={formData.email}
          onChangeText={(email) => setFormData({ ...formData, email })}
          keyboardType="email-address"
          editable={!loading}
        />
      </View>

      {/* Device Info Toggle */}
      <View className="mb-6 flex-row items-center justify-between py-3 px-4 rounded-lg border border-border"
        style={{ backgroundColor: colors.surface }}>
        <Text className="text-sm text-foreground">إرسال معلومات الجهاز</Text>
        <Switch
          value={formData.includeDeviceInfo}
          onValueChange={(includeDeviceInfo) =>
            setFormData({ ...formData, includeDeviceInfo })
          }
          disabled={loading}
          trackColor={{ false: colors.border, true: colors.primary + "50" }}
          thumbColor={formData.includeDeviceInfo ? colors.primary : colors.muted}
        />
      </View>

      {/* Action Buttons */}
      <View className="flex-row gap-3 mb-6">
        {onCancel && (
          <TouchableOpacity
            onPress={onCancel}
            disabled={loading}
            className="flex-1 py-3 rounded-lg border border-border items-center"
          >
            <Text className="text-sm font-semibold text-foreground">إلغاء</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          className="flex-1 py-3 rounded-lg items-center"
          style={{ backgroundColor: colors.primary, opacity: loading ? 0.6 : 1 }}
        >
          <Text className="text-sm font-semibold text-white">
            {loading ? "جاري الإرسال..." : "إرسال الملاحظة"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default FeedbackForm;
