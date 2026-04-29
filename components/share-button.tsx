/**
 * Share Button Component
 * Allows users to share products via various social platforms
 */

import React, { useState } from "react";
import { Pressable, View, StyleSheet, Platform, Alert } from "react-native";
import * as Sharing from "expo-sharing";
import * as Clipboard from "expo-clipboard";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/use-colors";

export interface ShareData {
  title: string;
  description?: string;
  url: string;
  image?: string;
}

interface ShareButtonProps {
  data: ShareData;
  variant?: "icon" | "button" | "menu";
  onShare?: (platform: string) => void;
}

export function ShareButton({
  data,
  variant = "icon",
  onShare,
}: ShareButtonProps) {
  const colors = useColors();
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async (platform: string) => {
    if (Platform.OS === "web") {
      setIsSharing(true);
      try {
        // For web, use native share API if available
        if (navigator.share) {
          await navigator.share({
            title: data.title,
            text: data.description || data.title,
            url: data.url,
          });
        } else {
          // Fallback: copy to clipboard
          await Clipboard.setStringAsync(data.url);
          Alert.alert("تم النسخ", "تم نسخ الرابط إلى الحافظة");
        }
      } catch (error) {
        console.error("Share error:", error);
      } finally {
        setIsSharing(false);
      }
      return;
    }

    // Haptic feedback
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setIsSharing(true);

    try {
      const message = `${data.title}\n${data.description || ""}\n${data.url}`;

      switch (platform) {
        case "whatsapp":
          await shareViaWhatsApp(message);
          break;
        case "telegram":
          await shareViaTelegram(message);
          break;
        case "email":
          await shareViaEmail(data);
          break;
        case "copy":
          await shareViaCopy(data.url);
          break;
        case "native":
          await shareViaNative(message);
          break;
        default:
          break;
      }

      onShare?.(platform);
    } catch (error) {
      console.error(`Share via ${platform} error:`, error);
      Alert.alert("خطأ", `فشل المشاركة عبر ${platform}`);
    } finally {
      setIsSharing(false);
    }
  };

  if (variant === "icon") {
    return (
      <Pressable
        onPress={() => handleShare("native")}
        disabled={isSharing}
        style={({ pressed }) => [
          styles.iconButton,
          pressed && { opacity: 0.7 },
        ]}
      >
        <MaterialIcons name="share" size={24} color={colors.primary} />
      </Pressable>
    );
  }

  if (variant === "button") {
    return (
      <Pressable
        onPress={() => handleShare("native")}
        disabled={isSharing}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: colors.primary },
          pressed && { opacity: 0.8 },
        ]}
      >
        <MaterialIcons name="share" size={20} color="#FFFFFF" />
      </Pressable>
    );
  }

  return (
    <View style={styles.menuContainer}>
      <ShareOption
        icon="share"
        label="مشاركة"
        onPress={() => handleShare("native")}
        disabled={isSharing}
        colors={colors}
      />
      <ShareOption
        icon="chat"
        label="WhatsApp"
        onPress={() => handleShare("whatsapp")}
        disabled={isSharing}
        colors={colors}
      />
      <ShareOption
        icon="send"
        label="Telegram"
        onPress={() => handleShare("telegram")}
        disabled={isSharing}
        colors={colors}
      />
      <ShareOption
        icon="email"
        label="البريد الإلكتروني"
        onPress={() => handleShare("email")}
        disabled={isSharing}
        colors={colors}
      />
      <ShareOption
        icon="content-copy"
        label="نسخ الرابط"
        onPress={() => handleShare("copy")}
        disabled={isSharing}
        colors={colors}
      />
    </View>
  );
}

interface ShareOptionProps {
  icon: string;
  label: string;
  onPress: () => void;
  disabled: boolean;
  colors: any;
}

function ShareOption({
  icon,
  label,
  onPress,
  disabled,
  colors,
}: ShareOptionProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.shareOption,
        pressed && { backgroundColor: colors.surface },
      ]}
    >
      <View style={styles.shareOptionContent}>
        <MaterialIcons name={icon} size={24} color={colors.primary} />
        <View style={styles.shareOptionText}>
          <View style={styles.shareOptionLabel}>{label}</View>
        </View>
      </View>
    </Pressable>
  );
}

// Share implementations
async function shareViaWhatsApp(message: string) {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `whatsapp://send?text=${encodedMessage}`;

  if (Platform.OS === "ios" || Platform.OS === "android") {
    try {
      const canOpen = await Sharing.isAvailableAsync();
      if (canOpen) {
        // Use linking for WhatsApp
        const { Linking } = require("react-native");
        await Linking.openURL(whatsappUrl);
      }
    } catch (error) {
      throw new Error("WhatsApp is not installed");
    }
  }
}

async function shareViaTelegram(message: string) {
  const encodedMessage = encodeURIComponent(message);
  const telegramUrl = `tg://msg?text=${encodedMessage}`;

  if (Platform.OS === "ios" || Platform.OS === "android") {
    try {
      const { Linking } = require("react-native");
      await Linking.openURL(telegramUrl);
    } catch (error) {
      throw new Error("Telegram is not installed");
    }
  }
}

async function shareViaEmail(data: ShareData) {
  const subject = encodeURIComponent(data.title);
  const body = encodeURIComponent(
    `${data.description || ""}\n\n${data.url}`
  );
  const emailUrl = `mailto:?subject=${subject}&body=${body}`;

  if (Platform.OS === "ios" || Platform.OS === "android") {
    try {
      const { Linking } = require("react-native");
      await Linking.openURL(emailUrl);
    } catch (error) {
      throw new Error("Email is not available");
    }
  }
}

async function shareViaCopy(url: string) {
  await Clipboard.setStringAsync(url);
  Alert.alert("تم النسخ", "تم نسخ الرابط إلى الحافظة بنجاح");
}

async function shareViaNative(message: string) {
  if (Platform.OS === "ios" || Platform.OS === "android") {
    try {
      await Sharing.shareAsync(message, {
        mimeType: "text/plain",
        UTI: "public.plain-text",
      });
    } catch (error) {
      // Fallback to copy
      await Clipboard.setStringAsync(message);
      Alert.alert("تم النسخ", "تم نسخ الرابط إلى الحافظة");
    }
  }
}

const styles = StyleSheet.create({
  iconButton: {
    padding: 8,
    borderRadius: 8,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  menuContainer: {
    gap: 0,
  },
  shareOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  shareOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  shareOptionText: {
    flex: 1,
  },
  shareOptionLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
});
