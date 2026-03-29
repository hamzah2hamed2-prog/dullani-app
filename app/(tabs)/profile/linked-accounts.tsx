import { ScrollView, View, Text, TouchableOpacity, Switch, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

export default function LinkedAccountsScreen() {
  const router = useRouter();
  const colors = useColors();

  const [linkedAccounts, setLinkedAccounts] = useState([
    { id: 1, name: "Google", icon: "🔵", connected: true, email: "user@gmail.com" },
    { id: 2, name: "Facebook", icon: "📘", connected: false, email: null },
    { id: 3, name: "Apple", icon: "🍎", connected: false, email: null },
    { id: 4, name: "Twitter", icon: "🐦", connected: true, email: "user_twitter" },
  ]);

  const [deviceSessions, setDeviceSessions] = useState<any[]>([
    {
      id: 1,
      device: "iPhone 12",
      browser: "Safari",
      location: "الرياض، السعودية",
      lastActive: "الآن",
      isCurrent: true,
    },
    {
      id: 2,
      device: "Samsung Galaxy S21",
      browser: "Chrome",
      location: "جدة، السعودية",
      lastActive: "قبل ساعة",
      isCurrent: false,
    },
    {
      id: 3,
      device: "MacBook Pro",
      browser: "Safari",
      location: "الدمام، السعودية",
      lastActive: "قبل يومين",
      isCurrent: false,
    },
  ]);

  const toggleAccount = (id: number): void => {
    setLinkedAccounts(
      linkedAccounts.map((account) =>
        account.id === id ? { ...account, connected: !account.connected } : account
      )
    );
  };

  const disconnectSession = (id: number) => {
    setDeviceSessions(deviceSessions.filter((session) => session.id !== id));
  };

  return (
    <ScreenContainer style={{ padding: 0 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
            <Text style={{ color: colors.foreground }}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>الحسابات المرتبطة</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* Social Accounts Section */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>حسابات وسائل التواصل</Text>
          <Text style={[styles.sectionDescription, { color: colors.muted }]}>
            ربط حسابات وسائل التواصل الاجتماعي لتسهيل عملية تسجيل الدخول والمشاركة
          </Text>

          {linkedAccounts.map((account) => (
            <View
              key={account.id}
              style={[styles.accountCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <View style={styles.accountInfo}>
                <Text style={{ fontSize: 24 }}>{account.icon}</Text>
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={[styles.accountName, { color: colors.foreground }]}>{account.name}</Text>
                  {account.connected && (
                    <Text style={[styles.accountEmail, { color: colors.muted }]}>{account.email}</Text>
                  )}
                  {!account.connected && (
                    <Text style={[styles.accountStatus, { color: colors.muted }]}>غير متصل</Text>
                  )}
                </View>
              </View>
              <Switch
                value={account.connected}
                onValueChange={() => toggleAccount(account.id)}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
          ))}
        </View>

        {/* Active Sessions Section */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>الجلسات النشطة</Text>
          <Text style={[styles.sectionDescription, { color: colors.muted }]}>
            إدارة الأجهزة والمتصفحات المتصلة بحسابك
          </Text>

          {deviceSessions.map((session) => (
            <View
              key={session.id}
              style={[styles.sessionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <View style={styles.sessionInfo}>
                <View style={styles.sessionHeader}>
                  <Text style={[styles.sessionDevice, { color: colors.foreground }]}>
                    {session.device}
                  </Text>
                  {session.isCurrent && (
                    <View style={[styles.currentBadge, { backgroundColor: colors.primary }]}>
                      <Text style={[styles.badgeText, { color: colors.background }]}>الجهاز الحالي</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.sessionDetails, { color: colors.muted }]}>
                  {session.browser} • {session.location}
                </Text>
                <Text style={[styles.sessionTime, { color: colors.muted }]}>
                  آخر نشاط: {session.lastActive}
                </Text>
              </View>
              {!session.isCurrent && (
                <TouchableOpacity
                  style={[styles.disconnectButton, { backgroundColor: colors.error }]}
                  onPress={() => disconnectSession(session.id)}
                >
                  <Text style={{ color: "white", fontSize: 12 }}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Security Tips */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>💡 نصائح الأمان</Text>
          <View style={[styles.tipsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.tipItem}>
              <Text style={{ fontSize: 16 }}>🔐</Text>
              <Text style={[styles.tipText, { color: colors.muted }]}>
                استخدم كلمة مرور قوية وفريدة
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={{ fontSize: 16 }}>👁️</Text>
              <Text style={[styles.tipText, { color: colors.muted }]}>
                راجع الجلسات النشطة بانتظام
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={{ fontSize: 16 }}>🔔</Text>
              <Text style={[styles.tipText, { color: colors.muted }]}>
                فعّل إشعارات تسجيل الدخول
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={{ fontSize: 16 }}>📱</Text>
              <Text style={[styles.tipText, { color: colors.muted }]}>
                استخدم المصادقة الثنائية
              </Text>
            </View>
          </View>
        </View>

        {/* Disconnect All Button */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <TouchableOpacity
            style={[styles.disconnectAllButton, { backgroundColor: colors.error }]}
            onPress={() => {}}
          >
            <Text style={[styles.disconnectAllText, { color: "white" }]}>
              قطع جميع الجلسات الأخرى
            </Text>
          </TouchableOpacity>
          <Text style={[styles.warningText, { color: colors.muted }]}>
            سيتم تسجيل الخروج من جميع الأجهزة الأخرى
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
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 11,
    marginBottom: 12,
  },
  accountCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 8,
    borderWidth: 0.5,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
  },
  accountInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  accountName: {
    fontSize: 13,
    fontWeight: "600",
  },
  accountEmail: {
    fontSize: 11,
    marginTop: 2,
  },
  accountStatus: {
    fontSize: 11,
    marginTop: 2,
  },
  sessionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 8,
    borderWidth: 0.5,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 8,
  },
  sessionDevice: {
    fontSize: 13,
    fontWeight: "600",
  },
  currentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  sessionDetails: {
    fontSize: 11,
    marginBottom: 2,
  },
  sessionTime: {
    fontSize: 10,
  },
  disconnectButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  tipsCard: {
    borderRadius: 8,
    borderWidth: 0.5,
    padding: 12,
    gap: 12,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tipText: {
    fontSize: 11,
    flex: 1,
  },
  disconnectAllButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  disconnectAllText: {
    fontSize: 13,
    fontWeight: "bold",
  },
  warningText: {
    fontSize: 11,
    textAlign: "center",
  },
});
