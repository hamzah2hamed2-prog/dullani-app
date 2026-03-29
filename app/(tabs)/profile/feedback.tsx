import { ScrollView, View, Text, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

export default function FeedbackScreen() {
  const router = useRouter();
  const colors = useColors();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating > 0 && feedback.trim().length > 0) {
      setSubmitted(true);
      setTimeout(() => {
        setRating(0);
        setFeedback("");
        setSubmitted(false);
      }, 2000);
    }
  };

  const feedbackCategories = [
    { id: 1, icon: "😍", label: "ممتاز", value: 5 },
    { id: 2, icon: "😊", label: "جيد جداً", value: 4 },
    { id: 3, icon: "😐", label: "جيد", value: 3 },
    { id: 4, icon: "😕", label: "سيء", value: 2 },
    { id: 5, icon: "😞", label: "سيء جداً", value: 1 },
  ];

  const recentFeedback = [
    {
      id: 1,
      rating: 5,
      text: "التطبيق رائع جداً وسهل الاستخدام",
      date: "قبل يومين",
    },
    {
      id: 2,
      rating: 4,
      text: "جيد لكن يحتاج بعض التحسينات",
      date: "قبل 3 أيام",
    },
    {
      id: 3,
      rating: 5,
      text: "أفضل تطبيق للتسوق الاجتماعي",
      date: "قبل أسبوع",
    },
  ];

  return (
    <ScreenContainer style={{ padding: 0 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
            <Text style={{ color: colors.foreground }}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>التقييمات والآراء</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* Feedback Form */}
        <View style={[styles.formSection, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>شارك رأيك معنا</Text>

          {/* Rating Selection */}
          <View style={styles.ratingContainer}>
            {feedbackCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.ratingButton,
                  {
                    backgroundColor: rating === category.value ? colors.primary : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setRating(category.value)}
              >
                <Text style={styles.ratingEmoji}>{category.icon}</Text>
                <Text
                  style={[
                    styles.ratingLabel,
                    {
                      color: rating === category.value ? colors.background : colors.foreground,
                    },
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Feedback Input */}
          <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              placeholder="أخبرنا برأيك..."
              placeholderTextColor={colors.muted}
              multiline
              numberOfLines={5}
              value={feedback}
              onChangeText={setFeedback}
              maxLength={500}
            />
            <Text style={[styles.charCount, { color: colors.muted }]}>
              {feedback.length}/500
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              {
                backgroundColor: rating > 0 && feedback.trim().length > 0 ? colors.primary : colors.border,
              },
            ]}
            onPress={handleSubmit}
            disabled={rating === 0 || feedback.trim().length === 0}
          >
            <Text
              style={[
                styles.submitButtonText,
                {
                  color: rating > 0 && feedback.trim().length > 0 ? colors.background : colors.muted,
                },
              ]}
            >
              {submitted ? "✓ تم الإرسال" : "إرسال التقييم"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats Section */}
        <View style={[styles.statsSection, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>إحصائيات التقييمات</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.statValue, { color: colors.primary }]}>4.8</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>متوسط التقييم</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.statValue, { color: colors.primary }]}>2,543</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>إجمالي التقييمات</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.statValue, { color: colors.primary }]}>96%</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>رضا المستخدمين</Text>
            </View>
          </View>
        </View>

        {/* Rating Distribution */}
        <View style={[styles.distributionSection, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>توزيع التقييمات</Text>
          {[5, 4, 3, 2, 1].map((stars) => (
            <View key={stars} style={styles.ratingRow}>
              <Text style={[styles.ratingStars, { color: colors.muted }]}>{"⭐".repeat(stars)}</Text>
              <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${stars === 5 ? 85 : stars === 4 ? 10 : stars === 3 ? 3 : stars === 2 ? 1 : 1}%`,
                      backgroundColor: colors.primary,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.ratingCount, { color: colors.muted }]}>
                {stars === 5 ? "2,165" : stars === 4 ? "404" : stars === 3 ? "121" : stars === 2 ? "32" : "21"}
              </Text>
            </View>
          ))}
        </View>

        {/* Recent Feedback */}
        <View style={[styles.recentSection, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>آراء المستخدمين</Text>
          {recentFeedback.map((item) => (
            <View
              key={item.id}
              style={[styles.feedbackCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <View style={styles.feedbackHeader}>
                <Text style={{ fontSize: 14 }}>{"⭐".repeat(item.rating)}</Text>
                <Text style={[styles.feedbackDate, { color: colors.muted }]}>{item.date}</Text>
              </View>
              <Text style={[styles.feedbackText, { color: colors.foreground }]}>{item.text}</Text>
            </View>
          ))}
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
  formSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  ratingButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 0.5,
    alignItems: "center",
  },
  ratingEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  ratingLabel: {
    fontSize: 10,
    fontWeight: "600",
  },
  inputContainer: {
    borderRadius: 8,
    borderWidth: 0.5,
    padding: 12,
    marginBottom: 12,
  },
  input: {
    fontSize: 13,
    textAlignVertical: "top",
    marginBottom: 8,
  },
  charCount: {
    fontSize: 11,
    textAlign: "right",
  },
  submitButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 13,
    fontWeight: "bold",
  },
  statsSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 0.5,
    paddingVertical: 16,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 10,
    marginTop: 4,
  },
  distributionSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  ratingStars: {
    fontSize: 12,
    width: 60,
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
    fontSize: 11,
    width: 50,
    textAlign: "right",
  },
  recentSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  feedbackCard: {
    borderRadius: 8,
    borderWidth: 0.5,
    padding: 12,
    marginBottom: 8,
  },
  feedbackHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  feedbackDate: {
    fontSize: 10,
  },
  feedbackText: {
    fontSize: 12,
    lineHeight: 16,
  },
});
