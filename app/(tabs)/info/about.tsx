import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

export default function AboutScreen() {
  const router = useRouter();
  const colors = useColors();

  const sections = [
    {
      title: "عن التطبيق",
      content:
        "دلني هو تطبيق تسوق اجتماعي مبتكر يجمع بين قوة وسائل التواصل الاجتماعي وتجربة التسوق. اكتشف المنتجات من متاجرك المفضلة، شارك تجاربك، وتابع أحدث العروض.",
    },
    {
      title: "مهمتنا",
      content:
        "نهدف إلى تحويل تجربة التسوق المحلية من خلال توفير منصة آمنة وسهلة الاستخدام تربط المستهلكين بالمتاجر المحلية والعالمية.",
    },
    {
      title: "رؤيتنا",
      content:
        "أن نكون المنصة الأولى للتسوق الاجتماعي في المنطقة، حيث يمكن للمستخدمين اكتشاف واستكشاف وشراء المنتجات بطريقة ممتعة وآمنة.",
    },
  ];

  const features = [
    { icon: "📱", title: "تطبيق حديث", description: "واجهة سهلة الاستخدام وسريعة" },
    { icon: "🔒", title: "آمن", description: "حماية بيانات المستخدم والخصوصية" },
    { icon: "⚡", title: "سريع", description: "أداء عالي وتحميل فوري" },
    { icon: "🌍", title: "محلي وعالمي", description: "متاجر محلية وعالمية" },
  ];

  const handleOpenLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScreenContainer style={{ padding: 0 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
            <Text style={{ color: colors.foreground }}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>عن التطبيق</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* App Logo and Version */}
        <View style={[styles.logoSection, { backgroundColor: colors.background }]}>
          <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
            <Text style={styles.logoText}>دلني</Text>
          </View>
          <Text style={[styles.appName, { color: colors.foreground }]}>دلني</Text>
          <Text style={[styles.version, { color: colors.muted }]}>الإصدار 1.0.0</Text>
        </View>

        {/* About Sections */}
        <View style={[styles.sectionsContainer, { backgroundColor: colors.background }]}>
          {sections.map((section, index) => (
            <View key={index} style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{section.title}</Text>
              <Text style={[styles.sectionContent, { color: colors.muted }]}>{section.content}</Text>
            </View>
          ))}
        </View>

        {/* Features */}
        <View style={[styles.featuresContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.containerTitle, { color: colors.foreground }]}>المميزات الرئيسية</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View
                key={index}
                style={[styles.featureCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <Text style={[styles.featureTitle, { color: colors.foreground }]}>{feature.title}</Text>
                <Text style={[styles.featureDescription, { color: colors.muted }]}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Links */}
        <View style={[styles.linksContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.containerTitle, { color: colors.foreground }]}>الروابط المهمة</Text>
          <TouchableOpacity
            style={[styles.linkButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => handleOpenLink("https://example.com/privacy")}
          >
            <Text style={[styles.linkText, { color: colors.foreground }]}>سياسة الخصوصية</Text>
            <Text style={{ color: colors.muted }}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.linkButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => handleOpenLink("https://example.com/terms")}
          >
            <Text style={[styles.linkText, { color: colors.foreground }]}>شروط الاستخدام</Text>
            <Text style={{ color: colors.muted }}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.linkButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => handleOpenLink("https://example.com/contact")}
          >
            <Text style={[styles.linkText, { color: colors.foreground }]}>تواصل معنا</Text>
            <Text style={{ color: colors.muted }}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Info */}
        <View style={[styles.contactContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.containerTitle, { color: colors.foreground }]}>تواصل معنا</Text>
          <View style={[styles.contactCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.contactItem}>
              <Text style={{ fontSize: 16 }}>📧</Text>
              <View style={{ marginLeft: 12 }}>
                <Text style={[styles.contactLabel, { color: colors.muted }]}>البريد الإلكتروني</Text>
                <Text style={[styles.contactValue, { color: colors.foreground }]}>support@dullani.com</Text>
              </View>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.contactItem}>
              <Text style={{ fontSize: 16 }}>📱</Text>
              <View style={{ marginLeft: 12 }}>
                <Text style={[styles.contactLabel, { color: colors.muted }]}>رقم الهاتف</Text>
                <Text style={[styles.contactValue, { color: colors.foreground }]}>+966 50 123 4567</Text>
              </View>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.contactItem}>
              <Text style={{ fontSize: 16 }}>🌐</Text>
              <View style={{ marginLeft: 12 }}>
                <Text style={[styles.contactLabel, { color: colors.muted }]}>الموقع الإلكتروني</Text>
                <Text style={[styles.contactValue, { color: colors.foreground }]}>www.dullani.com</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={[styles.footer, { backgroundColor: colors.background }]}>
          <Text style={[styles.footerText, { color: colors.muted }]}>
            © 2024 دلني. جميع الحقوق محفوظة
          </Text>
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
  logoSection: {
    alignItems: "center",
    paddingVertical: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
  },
  version: {
    fontSize: 12,
    marginTop: 4,
  },
  sectionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  section: {
    borderRadius: 8,
    borderWidth: 0.5,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 12,
    lineHeight: 18,
  },
  featuresContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  containerTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 12,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  featureCard: {
    flex: 1,
    minWidth: "45%",
    borderRadius: 8,
    borderWidth: 0.5,
    padding: 12,
    alignItems: "center",
  },
  featureIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 10,
    textAlign: "center",
  },
  linksContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  linkButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 0.5,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  linkText: {
    fontSize: 13,
    fontWeight: "500",
  },
  contactContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  contactCard: {
    borderRadius: 8,
    borderWidth: 0.5,
    overflow: "hidden",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  contactLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 12,
    fontWeight: "600",
  },
  divider: {
    height: 0.5,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  footerText: {
    fontSize: 11,
  },
});
