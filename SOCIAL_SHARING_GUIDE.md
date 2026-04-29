# ميزة المشاركة الاجتماعية - دليل شامل

## نظرة عامة

توفر ميزة المشاركة الاجتماعية للمستخدمين القدرة على مشاركة المنتجات عبر قنوات متعددة مثل WhatsApp و Telegram و البريد الإلكتروني وغيرها.

## المكونات الرئيسية

### 1. ShareButton Component

مكون زر المشاركة الأساسي مع 3 أنماط مختلفة:

```tsx
import { ShareButton } from "@/components/share-button";

// نمط الأيقونة (الافتراضي)
<ShareButton
  data={{
    title: "منتج رائع",
    description: "وصف المنتج",
    url: "https://dullani.app/product/123",
    image: "https://...",
  }}
  variant="icon"
  onShare={(platform) => console.log(`Shared via ${platform}`)}
/>

// نمط الزر
<ShareButton
  data={shareData}
  variant="button"
/>

// نمط القائمة
<ShareButton
  data={shareData}
  variant="menu"
/>
```

### 2. ShareModal Component

نموذج شامل لعرض خيارات المشاركة مع معاينة المنتج:

```tsx
import { ShareModal } from "@/components/share-modal";
import { useState } from "react";

export function ProductDetail() {
  const [shareModalVisible, setShareModalVisible] = useState(false);

  return (
    <>
      <ShareModal
        visible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
        data={{
          title: "منتج رائع",
          description: "وصف المنتج",
          url: "https://dullani.app/product/123",
          image: "https://...",
        }}
        onShare={(platform) => {
          // تتبع المشاركة
          trackShare("product-123", platform);
        }}
      />
    </>
  );
}
```

### 3. Share Service

خدمة شاملة لتتبع المشاركات والإحصائيات:

```tsx
import {
  trackShare,
  getShareStats,
  getShareHistory,
  getMostSharedProducts,
  generateShareUrl,
  generateShareMessage,
} from "@/lib/share-service";

// تتبع مشاركة
await trackShare("product-123", "whatsapp", userId);

// الحصول على إحصائيات المنتج
const stats = await getShareStats("product-123");
console.log(stats);
// {
//   productId: "product-123",
//   totalShares: 15,
//   sharesByPlatform: { whatsapp: 10, telegram: 3, email: 2 },
//   lastShared: 1704067200000,
//   uniqueUsers: 8
// }

// الحصول على سجل المشاركات
const history = await getShareHistory();

// الحصول على أكثر المنتجات مشاركة
const topProducts = await getMostSharedProducts(10);

// توليد رابط المشاركة
const shareUrl = generateShareUrl("product-123");

// توليد رسالة المشاركة
const message = generateShareMessage(
  "منتج رائع",
  "وصف المنتج"
);
```

## خيارات المشاركة المدعومة

### 1. المشاركة السريعة (Native Share)
- استخدام نظام المشاركة الافتراضي للجهاز
- يعمل على iOS و Android و Web

### 2. WhatsApp
- مشاركة مع رسالة مخصصة
- يتطلب تطبيق WhatsApp مثبت

### 3. Telegram
- مشاركة عبر Telegram
- يتطلب تطبيق Telegram مثبت

### 4. البريد الإلكتروني
- إرسال الرابط عبر البريد الإلكتروني
- يفتح تطبيق البريد الافتراضي

### 5. نسخ الرابط
- نسخ رابط المشاركة إلى الحافظة
- يعمل على جميع المنصات

## التكامل مع صفحات المنتجات

### في صفحة تفاصيل المنتج

```tsx
import { ShareButton } from "@/components/share-button";
import { ShareModal } from "@/components/share-modal";
import { useState } from "react";
import { trackShare } from "@/lib/share-service";

export function ProductDetailScreen({ productId }) {
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const product = useProduct(productId);

  const shareData = {
    title: product.name,
    description: product.description,
    url: `https://dullani.app/product/${productId}`,
    image: product.image,
  };

  return (
    <View>
      {/* Product content */}

      {/* Share button */}
      <ShareButton
        data={shareData}
        variant="button"
        onShare={(platform) => {
          trackShare(productId, platform);
          setShareModalVisible(true);
        }}
      />

      {/* Share modal */}
      <ShareModal
        visible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
        data={shareData}
        onShare={(platform) => trackShare(productId, platform)}
      />
    </View>
  );
}
```

### في بطاقات المنتجات

```tsx
import { ShareButton } from "@/components/share-button";
import { trackShare } from "@/lib/share-service";

export function ProductCard({ product }) {
  return (
    <View>
      {/* Product card content */}

      {/* Share icon */}
      <ShareButton
        data={{
          title: product.name,
          description: product.description,
          url: `https://dullani.app/product/${product.id}`,
          image: product.image,
        }}
        variant="icon"
        onShare={(platform) => trackShare(product.id, platform)}
      />
    </View>
  );
}
```

## تحليلات المشاركة

### الحصول على إحصائيات شاملة

```tsx
import { getShareStatsSummary } from "@/lib/share-service";

const summary = await getShareStatsSummary();
console.log(summary);
// {
//   totalShares: 150,
//   uniqueProducts: 45,
//   popularPlatforms: { whatsapp: 80, telegram: 40, email: 30 },
//   lastShareTime: 1704067200000
// }
```

### عرض إحصائيات المنتج

```tsx
import { getShareStats } from "@/lib/share-service";

export function ProductStats({ productId }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getShareStats(productId).then(setStats);
  }, [productId]);

  if (!stats) return null;

  return (
    <View>
      <Text>عدد المشاركات: {stats.totalShares}</Text>
      <Text>آخر مشاركة: {new Date(stats.lastShared).toLocaleString()}</Text>
      <Text>المنصات الشهيرة:</Text>
      {Object.entries(stats.sharesByPlatform).map(([platform, count]) => (
        <Text key={platform}>
          {platform}: {count}
        </Text>
      ))}
    </View>
  );
}
```

## أفضل الممارسات

### 1. تتبع المشاركات
- تتبع كل مشاركة لفهم سلوك المستخدمين
- استخدم البيانات لتحسين التسويق

### 2. رسائل مخصصة
- اجعل رسائل المشاركة جذابة وواضحة
- أضف وصف المنتج الرئيسي

### 3. معالجة الأخطاء
- تعامل مع حالة عدم توفر التطبيقات
- وفر بدائل (مثل نسخ الرابط)

### 4. الأداء
- لا تحمل الصور الكبيرة في المشاركة
- استخدم روابط مختصرة إن أمكن

### 5. الخصوصية
- احترم خصوصية المستخدم
- لا تشارك بيانات شخصية

## استكشاف الأخطاء

### المشاركة لا تعمل

1. تحقق من توفر التطبيق المطلوب
2. تأكد من صحة الرابط
3. تحقق من صلاحيات التطبيق

### الصور لا تظهر في المشاركة

1. تأكد من أن رابط الصورة صحيح
2. تحقق من حجم الصورة
3. جرب صورة أخرى

### الرسالة مقطوعة

1. قلل طول الرسالة
2. استخدم اختصارات
3. أزل الأحرف الخاصة

## أمثلة متقدمة

### مشاركة مع تتبع الحملات

```tsx
import { generateShareUrl } from "@/lib/share-service";

function generateCampaignUrl(productId, campaignId) {
  const baseUrl = generateShareUrl(productId);
  return `${baseUrl}&campaign=${campaignId}`;
}
```

### عرض أكثر المنتجات مشاركة

```tsx
import { getMostSharedProducts } from "@/lib/share-service";

export function TrendingProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getMostSharedProducts(10).then(setProducts);
  }, []);

  return (
    <View>
      {products.map((product) => (
        <Text key={product.productId}>
          {product.productId}: {product.totalShares} مشاركات
        </Text>
      ))}
    </View>
  );
}
```

### تقرير المشاركات الشهري

```tsx
import { getShareHistory } from "@/lib/share-service";

async function getMonthlyShareReport(month, year) {
  const history = await getShareHistory();
  const startDate = new Date(year, month - 1, 1).getTime();
  const endDate = new Date(year, month, 0).getTime();

  return history.filter(
    (event) => event.timestamp >= startDate && event.timestamp <= endDate
  );
}
```

## الخلاصة

ميزة المشاركة الاجتماعية توفر:

- ✅ مشاركة سهلة عبر قنوات متعددة
- ✅ تتبع شامل للمشاركات
- ✅ إحصائيات مفصلة
- ✅ تجربة مستخدم محسّنة
- ✅ دعم كامل للعربية

استخدم هذه الميزة لزيادة الوعي بمنتجاتك وتحسين التفاعل مع المستخدمين!
