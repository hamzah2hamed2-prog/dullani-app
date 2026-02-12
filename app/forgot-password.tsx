import { ScrollView, Text, View, TouchableOpacity, TextInput, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSendReset = async () => {
    if (!email.trim()) {
      Alert.alert("خطأ", "يرجى إدخال بريدك الإلكتروني");
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, you would call an API to send password reset email
      // For now, we'll just simulate the process
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setEmailSent(true);
      Alert.alert(
        "نجح",
        "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني"
      );
    } catch (error) {
      console.error("Error sending reset email:", error);
      Alert.alert("خطأ", "فشل في إرسال رابط إعادة التعيين");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="flex-row items-center mb-6 pb-4 border-b border-border">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-xl">←</Text>
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-foreground flex-1 text-center">
            إعادة تعيين كلمة المرور
          </Text>
          <View className="w-6" />
        </View>

        {!emailSent ? (
          <>
            {/* Description */}
            <View className="mb-8">
              <Text className="text-sm text-muted leading-relaxed">
                أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور
              </Text>
            </View>

            {/* Email Input */}
            <View className="mb-6 gap-2">
              <Text className="text-sm font-semibold text-foreground">
                البريد الإلكتروني
              </Text>
              <TextInput
                placeholder="أدخل بريدك الإلكتروني"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                placeholderTextColor="#687076"
              />
            </View>

            {/* Send Button */}
            <TouchableOpacity
              onPress={handleSendReset}
              disabled={isLoading}
              className={`px-4 py-3 rounded-lg mb-3 ${
                isLoading ? "bg-muted" : "bg-primary"
              }`}
            >
              <Text className="text-white font-semibold text-center">
                {isLoading ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}
              </Text>
            </TouchableOpacity>

            {/* Back to Login */}
            <TouchableOpacity
              onPress={() => router.back()}
              disabled={isLoading}
            >
              <Text className="text-primary text-center text-sm font-semibold">
                العودة إلى تسجيل الدخول
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Success Message */}
            <View className="flex-1 items-center justify-center gap-4">
              <Text className="text-5xl">✅</Text>
              <Text className="text-lg font-semibold text-foreground text-center">
                تم إرسال البريد بنجاح
              </Text>
              <Text className="text-sm text-muted text-center">
                تحقق من بريدك الإلكتروني واتبع التعليمات لإعادة تعيين كلمة المرور
              </Text>

              <TouchableOpacity
                onPress={() => router.back()}
                className="bg-primary px-6 py-3 rounded-lg mt-4 w-full"
              >
                <Text className="text-white font-semibold text-center">
                  العودة
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
