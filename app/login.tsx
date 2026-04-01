import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ScreenContainer } from "@/components/screen-container";
import * as Auth from "@/lib/_core/auth";
import { useAuth } from "@/hooks/use-auth";
import { ErrorDisplay } from "@/components/error-display";

export default function LoginScreen() {
  const colors = useColors();
  const router = useRouter();
  const { refresh } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [accountType, setAccountType] = useState<"consumer" | "merchant">("consumer");

  const handleAuth = async () => {
    if (!email || !password) {
      alert("الرجاء إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("الرجاء إدخال بريد إلكتروني صحيح");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      alert("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
      const payload = {
        email,
        password,
        ...(isLogin ? {} : { accountType }),
      };

      console.log("[Login] Calling", endpoint, "with:", { email, accountType: isLogin ? "N/A" : accountType });

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000"}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "فشل المصادقة");
      }

      // Handle response
      if (data.sessionToken) {
        await Auth.setSessionToken(data.sessionToken);
      }

      if (data.user) {
        const user: Auth.User = {
          id: data.user.id,
          openId: data.user.openId,
          name: data.user.name,
          email: data.user.email,
          loginMethod: data.user.loginMethod || "email",
          lastSignedIn: new Date(data.user.lastSignedIn),
          accountType: data.user.accountType || "consumer",
        };
        await Auth.setUserInfo(user);
      }

      // Refresh global auth state
      await refresh();

      // Show success message
      alert(isLogin ? "تم تسجيل الدخول بنجاح" : "تم إنشاء الحساب بنجاح");

      // Navigate back or to home
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "حدث خطأ أثناء المصادقة";
      alert(errorMessage);
      console.error("[Login] Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => router.back()}
        >
          <IconSymbol name="xmark" size={24} color={colors.foreground} />
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={[styles.logo, { color: colors.foreground }]}>دلني</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            {isLogin ? "تسجيل الدخول للمتابعة" : "إنشاء حساب جديد"}
          </Text>

          <View style={styles.form}>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground }]}
              placeholder="البريد الإلكتروني"
              placeholderTextColor={colors.muted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              textAlign="right"
            />
            
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground }]}
              placeholder="كلمة المرور"
              placeholderTextColor={colors.muted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              textAlign="right"
            />

            {!isLogin && (
              <View style={styles.accountTypeContainer}>
                <Text style={[styles.accountTypeLabel, { color: colors.foreground }]}>نوع الحساب:</Text>
                <View style={styles.accountTypeButtons}>
                  <TouchableOpacity 
                    style={[
                      styles.typeButton, 
                      accountType === "consumer" && { backgroundColor: colors.primary, borderColor: colors.primary }
                    ]}
                    onPress={() => setAccountType("consumer")}
                  >
                    <Text style={{ color: accountType === "consumer" ? "white" : colors.foreground, fontWeight: "bold" }}>مستخدم عادي</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.typeButton, 
                      accountType === "merchant" && { backgroundColor: colors.primary, borderColor: colors.primary }
                    ]}
                    onPress={() => setAccountType("merchant")}
                  >
                    <Text style={{ color: accountType === "merchant" ? "white" : colors.foreground, fontWeight: "bold" }}>تاجر (صاحب متجر)</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <TouchableOpacity 
              style={[styles.mainButton, { backgroundColor: colors.primary }]}
              onPress={handleAuth}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.mainButtonText}>{isLogin ? "تسجيل الدخول" : "إنشاء حساب"}</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.dividerContainer}>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.muted }]}>أو</Text>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
          </View>

          <View style={styles.toggleContainer}>
            <Text style={{ color: colors.muted }}>
              {isLogin ? "ليس لديك حساب؟" : "لديك حساب بالفعل؟"}
            </Text>
            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
              <Text style={[styles.toggleText, { color: colors.primary }]}>
                {isLogin ? "إنشاء حساب" : "تسجيل الدخول"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButton: {
    padding: 16,
    alignSelf: "flex-end", // Adjust for RTL
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingBottom: 40, // Offset for keyboard
  },
  logo: {
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
  },
  form: {
    gap: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  mainButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  mainButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  toggleText: {
    fontWeight: "bold",
  },
  accountTypeContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  accountTypeLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "right",
  },
  accountTypeButtons: {
    flexDirection: "row",
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    alignItems: "center",
  },
});
