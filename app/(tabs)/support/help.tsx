import { ScrollView, View, Text, TouchableOpacity, FlatList, StyleSheet, Linking } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

export default function HelpScreen() {
  const router = useRouter();
  const colors = useColors();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const categories = [
    { id: "account", name: "الحساب", icon: "👤" },
    { id: "products", name: "المنتجات", icon: "📦" },
    { id: "orders", name: "الطلبات", icon: "🛒" },
    { id: "payments", name: "الدفع", icon: "💳" },
    { id: "shipping", name: "التوصيل", icon: "🚚" },
    { id: "returns", name: "الاسترجاع", icon: "↩️" },
  ];

  const faqs = [
    {
      id: 1,
      category: "account",
      question: "كيف أنشئ حساباً جديداً؟",
      answer:
        "اضغط على زر التسجيل، أدخل بريدك الإلكتروني وكلمة المرور، ثم اتبع التعليمات لتأكيد حسابك.",
    },
    {
      id: 2,
      category: "account",
      question: "كيف أغير كلمة المرور؟",
      answer:
        "انتقل إلى الإعدادات > الأمان > تغيير كلمة المرور، ثم أدخل كلمتك الحالية والجديدة.",
    },
    {
      id: 3,
      category: "products",
      question: "كيف أبحث عن منتج معين؟",
      answer:
        "استخدم شريط البحث في الأعلى، أدخل اسم المنتج أو الفئة، ثم استخدم الفلاتر لتضييق النتائج.",
    },
    {
      id: 4,
      category: "products",
      question: "كيف أضيف منتج إلى قائمة الرغبات؟",
      answer:
        "افتح صفحة المنتج، اضغط على أيقونة القلب، سيتم إضافة المنتج إلى قائمة رغباتك.",
    },
    {
      id: 5,
      category: "payments",
      question: "ما طرق الدفع المتاحة؟",
      answer:
        "نقبل بطاقات الائتمان والخصم، التحويل البنكي، والمحافظ الرقمية.",
    },
    {
      id: 6,
      category: "shipping",
      question: "كم تستغرق عملية التوصيل؟",
      answer:
        "عادة ما تستغرق 2-3 أيام عمل حسب موقعك والمتجر.",
    },
  ];

  const renderFaqItem = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.faqItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => setExpandedFaq(expandedFaq === item.id ? null : item.id)}
    >
      <View style={styles.faqHeader}>
        <Text style={[styles.faqQuestion, { color: colors.foreground }]} numberOfLines={2}>
          {item.question}
        </Text>
        <Text style={{ fontSize: 16, color: colors.primary }}>
          {expandedFaq === item.id ? "−" : "+"}
        </Text>
      </View>
      {expandedFaq === item.id && (
        <View style={[styles.faqAnswer, { borderTopColor: colors.border }]}>
          <Text style={[styles.answerText, { color: colors.muted }]}>{item.answer}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const filteredFaqs = faqs;

  return (
    <ScreenContainer style={{ padding: 0 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
            <Text style={{ color: colors.foreground }}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>المساعدة والدعم</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* Contact Support */}
        <View style={[styles.contactSection, { backgroundColor: colors.background }]}>
          <View style={[styles.contactCard, { backgroundColor: colors.primary }]}>
            <Text style={[styles.contactTitle, { color: colors.background }]}>هل تحتاج إلى مساعدة فورية؟</Text>
            <Text style={[styles.contactDescription, { color: colors.background }]}>
              تواصل مع فريق الدعم الخاص بنا
            </Text>
            <TouchableOpacity
              style={[styles.contactButton, { backgroundColor: colors.background }]}
              onPress={() => Linking.openURL("mailto:support@dullani.com")}
            >
              <Text style={[styles.contactButtonText, { color: colors.primary }]}>تواصل معنا الآن</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Links */}
        <View style={[styles.quickLinksSection, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>روابط سريعة</Text>
          <View style={styles.quickLinksGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.quickLink, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <Text style={styles.quickLinkIcon}>{category.icon}</Text>
                <Text style={[styles.quickLinkText, { color: colors.foreground }]}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* FAQs */}
        <View style={[styles.faqsSection, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>الأسئلة الشائعة</Text>
          <FlatList
            data={filteredFaqs}
            renderItem={renderFaqItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.faqsList}
          />
        </View>

        {/* Contact Methods */}
        <View style={[styles.contactMethodsSection, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>طرق التواصل</Text>
          <TouchableOpacity
            style={[styles.contactMethod, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => Linking.openURL("mailto:support@dullani.com")}
          >
            <Text style={{ fontSize: 20 }}>📧</Text>
            <View style={{ marginLeft: 12 }}>
              <Text style={[styles.methodTitle, { color: colors.foreground }]}>البريد الإلكتروني</Text>
              <Text style={[styles.methodValue, { color: colors.muted }]}>support@dullani.com</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.contactMethod, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => Linking.openURL("tel:+966501234567")}
          >
            <Text style={{ fontSize: 20 }}>📱</Text>
            <View style={{ marginLeft: 12 }}>
              <Text style={[styles.methodTitle, { color: colors.foreground }]}>الهاتف</Text>
              <Text style={[styles.methodValue, { color: colors.muted }]}>+966 50 123 4567</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.contactMethod, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => Linking.openURL("https://wa.me/966501234567")}
          >
            <Text style={{ fontSize: 20 }}>💬</Text>
            <View style={{ marginLeft: 12 }}>
              <Text style={[styles.methodTitle, { color: colors.foreground }]}>واتساب</Text>
              <Text style={[styles.methodValue, { color: colors.muted }]}>+966 50 123 4567</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Info Box */}
        <View style={[styles.infoBox, { backgroundColor: colors.background }]}>
          <View style={[styles.infoContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={{ fontSize: 20 }}>⏰</Text>
            <View style={{ marginLeft: 12 }}>
              <Text style={[styles.infoTitle, { color: colors.foreground }]}>ساعات العمل</Text>
              <Text style={[styles.infoText, { color: colors.muted }]}>
                السبت - الخميس: 9:00 ص - 6:00 م
              </Text>
              <Text style={[styles.infoText, { color: colors.muted }]}>
                الجمعة: 2:00 م - 6:00 م
              </Text>
            </View>
          </View>
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
  contactSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  contactCard: {
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  contactDescription: {
    fontSize: 13,
    marginBottom: 12,
  },
  contactButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  contactButtonText: {
    fontSize: 13,
    fontWeight: "bold",
  },
  quickLinksSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 12,
  },
  quickLinksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickLink: {
    flex: 1,
    minWidth: "30%",
    borderRadius: 8,
    borderWidth: 0.5,
    paddingVertical: 12,
    alignItems: "center",
  },
  quickLinkIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  quickLinkText: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  faqsSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  faqsList: {
    gap: 8,
  },
  faqItem: {
    borderRadius: 8,
    borderWidth: 0.5,
    overflow: "hidden",
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  faqQuestion: {
    fontSize: 12,
    fontWeight: "600",
    flex: 1,
  },
  faqAnswer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderTopWidth: 0.5,
  },
  answerText: {
    fontSize: 11,
    lineHeight: 16,
  },
  contactMethodsSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  contactMethod: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 0.5,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
  },
  methodTitle: {
    fontSize: 12,
    fontWeight: "600",
  },
  methodValue: {
    fontSize: 11,
    marginTop: 2,
  },
  infoBox: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  infoContent: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 0.5,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 11,
    marginTop: 2,
  },
});
