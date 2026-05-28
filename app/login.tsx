import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ScreenContainer } from "@/components/screen-container";
import * as Auth from "@/lib/_core/auth";
import { useAuth } from "@/hooks/use-auth";
import * as Haptics from "expo-haptics";

export default function LoginScreen() {
  const colors = useColors();
  const router = useRouter();
  const { refresh } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [accountType, setAccountType] = useState<"consumer" | "merchant">("consumer");
  const [error, setError] = useState<string>("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Validation functions
  const validateEmail = (emailToCheck: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailToCheck);
  };

  const validatePassword = (passwordToCheck: string): string | null => {
    if (passwordToCheck.length < 6) {
      return "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }
    if (passwordToCheck.length < 8 && isLogin === false) {
      return "كلمة المرور يجب أن تكون 8 أحرف على الأقل للأمان";
    }
    return null;
  };

  const handleAuth = async () => {
    setError("");

    // Validation
    if (!email || !password) {
      setError("الرجاء إدخال البريد الإلكتروني وكلمة المرور");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (!validateEmail(email)) {
      setError("الرجاء إدخال بريد إلكتروني صحيح");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
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

      // Show success feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Navigate back or to home
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "حدث خطأ أثناء المصادقة";
      setError(errorMessage);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      console.error("[Login] Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError("");

    if (!forgotEmail) {
      setError("الرجاء إدخال بريدك الإلكتروني");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (!validateEmail(forgotEmail)) {
      setError("الرجاء إدخال بريد إلكتروني صحيح");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setForgotLoading(true);
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000"}/api/auth/password/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "فشل الطلب");
      }

      setForgotSuccess(true);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotEmail("");
        setForgotSuccess(false);
      }, 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "حدث خطأ أثناء الطلب";
      setError(errorMessage);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      console.error("[Forgot Password] Error:", error);
    } finally {
      setForgotLoading(false);
    }
  };

  // Forgot Password Modal
  if (showForgotPassword) {
    return (
      <ScreenContainer style={{ flex: 1, backgroundColor: colors.background }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => {
              setShowForgotPassword(false);
              setError("");
              setForgotSuccess(false);
            }}
          >
            <IconSymbol name="xmark" size={24} color={colors.foreground} />
          </TouchableOpacity>

          <View style={styles.content}>
            <Text style={[styles.logo, { color: colors.foreground }]}>استرجاع كلمة المرور</Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>
              أدخل بريدك الإلكتروني لاستقبال رابط الاسترجاع
            </Text>

            {forgotSuccess ? (
              <View style={[styles.successContainer, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
                <IconSymbol name="checkmark.circle.fill" size={48} color={colors.primary} />
                <Text style={[styles.successText, { color: colors.foreground }]}>
                  تم إرسال رابط الاسترجاع إلى بريدك الإلكتروني
                </Text>
                <Text style={[styles.successSubtext, { color: colors.muted }]}>
                  تحقق من بريدك الإلكتروني واتبع التعليمات
                </Text>
              </View>
            ) : (
              <View style={styles.form}>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground }]}
                  placeholder="البريد الإلكتروني"
                  placeholderTextColor={colors.muted}
                  value={forgotEmail}
                  onChangeText={setForgotEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  textAlign="right"
                  editable={!forgotLoading}
                />

                {error && (
                  <View style={[styles.errorContainer, { backgroundColor: colors.error }]}>
                    <Text style={[styles.errorText, { color: "white" }]}>{error}</Text>
                  </View>
                )}

                <TouchableOpacity 
                  style={[styles.mainButton, { backgroundColor: colors.primary }]}
                  onPress={handleForgotPassword}
                  disabled={forgotLoading}
                >
                  {forgotLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.mainButtonText}>إرسال رابط الاسترجاع</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </ScreenContainer>
    );
  }

  // Main Login/Signup Screen
  return (
    <ScreenContainer style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
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
                style={[styles.input, { backgroundColor: colors.surface, borderColor: error ? colors.error : colors.border, color: colors.foreground }]}
                placeholder="البريد الإلكتروني"
                placeholderTextColor={colors.muted}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                textAlign="right"
                editable={!isLoading}
              />
              
              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, borderColor: error ? colors.error : colors.border, color: colors.foreground }]}
                placeholder="كلمة المرور"
                placeholderTextColor={colors.muted}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError("");
                }}
                secureTextEntry
                textAlign="right"
                editable={!isLoading}
              />

              {error && (
                <View style={[styles.errorContainer, { backgroundColor: colors.error }]}>
                  <IconSymbol name="exclamationmark.circle.fill" size={20} color="white" />
                  <Text style={[styles.errorText, { color: "white" }]}>{error}</Text>
                </View>
              )}

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
                      disabled={isLoading}
                    >
                      <Text style={{ color: accountType === "consumer" ? "white" : colors.foreground, fontWeight: "bold" }}>مستخدم عادي</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[
                        styles.typeButton, 
                        accountType === "merchant" && { backgroundColor: colors.primary, borderColor: colors.primary }
                      ]}
                      onPress={() => setAccountType("merchant")}
                      disabled={isLoading}
                    >
                      <Text style={{ color: accountType === "merchant" ? "white" : colors.foreground, fontWeight: "bold" }}>تاجر (صاحب متجر)</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <TouchableOpacity 
                style={[styles.mainButton, { backgroundColor: colors.primary, opacity: isLoading ? 0.7 : 1 }]}
                onPress={handleAuth}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.mainButtonText}>{isLogin ? "تسجيل الدخول" : "إنشاء حساب"}</Text>
                )}
              </TouchableOpacity>

              {isLogin && (
                <TouchableOpacity 
                  style={styles.forgotPasswordButton}
                  onPress={() => setShowForgotPassword(true)}
                  disabled={isLoading}
                >
                  <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>هل نسيت كلمة المرور؟</Text>
                </TouchableOpacity>
              )}
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
              <TouchableOpacity onPress={() => {
                setIsLogin(!isLogin);
                setError("");
                setEmail("");
                setPassword("");
              }} disabled={isLoading}>
                <Text style={[styles.toggleText, { color: colors.primary }]}>
                  {isLogin ? "إنشاء حساب" : "تسجيل الدخول"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
    alignSelf: "flex-end",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingBottom: 40,
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
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
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
  forgotPasswordButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "500",
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
  successContainer: {
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: "center",
    gap: 16,
  },
  successText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  successSubtext: {
    fontSize: 14,
    textAlign: "center",
  },
});
