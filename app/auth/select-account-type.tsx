import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";

type AccountType = "consumer" | "merchant";

export default function SelectAccountTypeScreen() {
  const router = useRouter();
  const colors = useColors();
  const [selectedType, setSelectedType] = useState<AccountType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const setAccountTypeMutation = trpc.auth.setAccountType.useMutation();

  const handleContinue = async () => {
    if (!selectedType) return;
    
    setIsLoading(true);
    try {
      await setAccountTypeMutation.mutateAsync({
        accountType: selectedType,
      });
      // Navigate to home after successful account type setting
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Failed to set account type:", error);
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            اختر نوع حسابك
          </Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            اختر نوع الحساب المناسب لك للبدء
          </Text>
        </View>

        {/* Account Type Cards */}
        <View style={styles.cardsContainer}>
          {/* Consumer Card */}
          <TouchableOpacity
            onPress={() => setSelectedType("consumer")}
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                borderColor:
                  selectedType === "consumer" ? colors.primary : colors.border,
                borderWidth: selectedType === "consumer" ? 2 : 1,
              },
            ]}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor:
                    selectedType === "consumer"
                      ? `${colors.primary}20`
                      : `${colors.muted}10`,
                },
              ]}
            >
              <MaterialIcons
                name="shopping-bag"
                size={40}
                color={
                  selectedType === "consumer" ? colors.primary : colors.muted
                }
              />
            </View>

            <Text
              style={[
                styles.cardTitle,
                {
                  color: colors.foreground,
                  fontWeight: selectedType === "consumer" ? "700" : "600",
                },
              ]}
            >
              مستهلك
            </Text>

            <Text style={[styles.cardDescription, { color: colors.muted }]}>
              ابحث عن المنتجات والمتاجر المحلية، وأضف المنتجات إلى المفضلة، وقيّم المنتجات
            </Text>

            {selectedType === "consumer" && (
              <View
                style={[
                  styles.checkmark,
                  { backgroundColor: colors.primary },
                ]}
              >
                <MaterialIcons
                  name="check"
                  size={20}
                  color="white"
                />
              </View>
            )}
          </TouchableOpacity>

          {/* Merchant Card */}
          <TouchableOpacity
            onPress={() => setSelectedType("merchant")}
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                borderColor:
                  selectedType === "merchant" ? colors.primary : colors.border,
                borderWidth: selectedType === "merchant" ? 2 : 1,
              },
            ]}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor:
                    selectedType === "merchant"
                      ? `${colors.primary}20`
                      : `${colors.muted}10`,
                },
              ]}
            >
              <MaterialIcons
                name="storefront"
                size={40}
                color={
                  selectedType === "merchant" ? colors.primary : colors.muted
                }
              />
            </View>

            <Text
              style={[
                styles.cardTitle,
                {
                  color: colors.foreground,
                  fontWeight: selectedType === "merchant" ? "700" : "600",
                },
              ]}
            >
              تاجر
            </Text>

            <Text style={[styles.cardDescription, { color: colors.muted }]}>
              أضف متجرك وأدر منتجاتك، وشاهد إحصائيات المتجر، وتواصل مع العملاء
            </Text>

            {selectedType === "merchant" && (
              <View
                style={[
                  styles.checkmark,
                  { backgroundColor: colors.primary },
                ]}
              >
                <MaterialIcons
                  name="check"
                  size={20}
                  color="white"
                />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Info Box */}
        <View
          style={[
            styles.infoBox,
            { backgroundColor: `${colors.primary}10`, borderColor: colors.primary },
          ]}
        >
          <MaterialIcons
            name="info"
            size={20}
            color={colors.primary}
            style={{ marginRight: 8 }}
          />
          <Text style={[styles.infoText, { color: colors.foreground }]}>
            يمكنك تغيير نوع حسابك لاحقاً من الإعدادات
          </Text>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!selectedType || isLoading}
          style={[
            styles.button,
            {
              backgroundColor: selectedType ? colors.primary : colors.muted,
              opacity: selectedType && !isLoading ? 1 : 0.5,
            },
          ]}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text style={styles.buttonText}>المتابعة</Text>
              <MaterialIcons
                name="arrow-forward"
                size={20}
                color="white"
                style={{ marginLeft: 8 }}
              />
            </>
          )}
        </TouchableOpacity>

        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={[styles.backButtonText, { color: colors.primary }]}>
            العودة
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
    justifyContent: "space-between",
  },
  header: {
    marginBottom: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  cardsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    gap: 12,
    position: "relative",
    minHeight: 220,
    justifyContent: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    marginTop: 8,
  },
  cardDescription: {
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 18,
  },
  checkmark: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  infoBox: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 24,
    alignItems: "center",
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  backButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
