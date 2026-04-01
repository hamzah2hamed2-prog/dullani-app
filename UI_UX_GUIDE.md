# دليل تحسينات UI/UX - دلني

## نظرة عامة

يوفر تطبيق دلني مجموعة شاملة من مكونات UI/UX المحسّنة التي توفر:

- **Animations** - transitions سلسة وanimations احترافية
- **Visual Design System** - نظام تصميم موحد وقابل للتوسع
- **Responsive Design** - دعم جميع أحجام الشاشات
- **Interactive Feedback** - ردود فعل تفاعلية احترافية
- **Loading & Empty States** - حالات تحميل وفارغة احترافية

---

## 1. Animation Utilities

### الاستخدام الأساسي

```tsx
import { createFadeInAnimation, createSlideInAnimation } from "@/lib/animations";

// إنشاء fade-in animation
const { fadeAnim, animate, reset } = createFadeInAnimation(300);

// تشغيل الـ animation
animate();

// إعادة تعيين الـ animation
reset();
```

### أنواع الـ Animations المتاحة

| النوع | الوصف | الاستخدام |
|-------|-------|----------|
| `fadeIn` | تلاشي سلس من الشفافية | عند ظهور العناصر |
| `slideIn` | انزلاق من اتجاه معين | عند الانتقال بين الشاشات |
| `scale` | تكبير/تصغير سلس | عند الضغط على الأزرار |
| `bounce` | ارتداد احترافي | عند إكمال العملية |
| `rotation` | دوران مستمر | للـ loading indicators |
| `pulse` | نبض متكرر | للعناصر المهمة |

### مثال متقدم

```tsx
import { useAnimation } from "@/hooks/use-animation";

export function MyComponent() {
  const { start, stop, getTransformStyle } = useAnimation({
    type: "slideIn",
    duration: 300,
    delay: 100,
    autoStart: true,
    direction: "up",
  });

  return (
    <Animated.View style={getTransformStyle()}>
      <Text>محتوى مع animation</Text>
    </Animated.View>
  );
}
```

---

## 2. Design System Constants

### الظلال (Shadows)

```tsx
import { SHADOWS } from "@/constants/design-system";

// استخدام الظلال المختلفة
<View style={SHADOWS.SMALL}>
  <Text>محتوى مع ظل صغير</Text>
</View>

<View style={SHADOWS.LARGE}>
  <Text>محتوى مع ظل كبير</Text>
</View>
```

### الحدود المستديرة (Border Radius)

```tsx
import { BORDER_RADIUS } from "@/constants/design-system";

const borderRadius = BORDER_RADIUS.MEDIUM; // 8
const fullRadius = BORDER_RADIUS.FULL;     // 9999
```

### التباعد (Spacing)

```tsx
import { SPACING } from "@/constants/design-system";

<View style={{ padding: SPACING.MD, gap: SPACING.SM }}>
  <Text>محتوى مع تباعد موحد</Text>
</View>
```

### الطباعة (Typography)

```tsx
import { TYPOGRAPHY } from "@/constants/design-system";

<Text style={TYPOGRAPHY.TITLE}>عنوان رئيسي</Text>
<Text style={TYPOGRAPHY.BODY}>نص عادي</Text>
<Text style={TYPOGRAPHY.CAPTION}>نص صغير</Text>
```

---

## 3. Enhanced Components

### ButtonAnimated

```tsx
import { ButtonAnimated } from "@/components/button-animated";

// استخدام أساسي
<ButtonAnimated
  title="اضغط هنا"
  onPress={() => console.log("تم الضغط")}
/>

// مع خيارات متقدمة
<ButtonAnimated
  title="حفظ"
  variant="primary"
  size="large"
  loading={isLoading}
  haptic={true}
  onPress={handleSave}
/>
```

### CardEnhanced

```tsx
import { CardEnhanced } from "@/components/card-enhanced";

// بطاقة عادية
<CardEnhanced>
  <Text>محتوى البطاقة</Text>
</CardEnhanced>

// بطاقة قابلة للضغط
<CardEnhanced
  variant="elevated"
  shadow="medium"
  onPress={handleCardPress}
>
  <Text>محتوى قابل للضغط</Text>
</CardEnhanced>
```

### LoadingState

```tsx
import { LoadingState } from "@/components/loading-state";

// loading بسيط
<LoadingState message="جاري التحميل..." />

// loading بملء الشاشة
<LoadingState
  message="جاري جلب البيانات..."
  size="large"
  fullScreen={true}
/>
```

### EmptyState

```tsx
import { EmptyState } from "@/components/empty-state";

// حالة فارغة بسيطة
<EmptyState
  title="لا توجد منتجات"
  description="حاول البحث عن منتجات أخرى"
/>

// مع زر إجراء
<EmptyState
  icon="🛍️"
  title="سلة التسوق فارغة"
  description="ابدأ بإضافة منتجات إلى سلتك"
  actionLabel="استكشف المنتجات"
  onAction={handleExplore}
/>
```

---

## 4. Responsive Design

### useResponsive Hook

```tsx
import { useResponsive } from "@/hooks/use-responsive";

export function MyComponent() {
  const {
    width,
    height,
    isSmall,
    isTablet,
    isPortrait,
    getColumns,
    getResponsivePadding,
  } = useResponsive();

  const columns = getColumns(150); // عدد الأعمدة بناءً على عرض الشاشة
  const padding = getResponsivePadding(); // تباعد موحد

  return (
    <View style={{ padding }}>
      {isTablet ? (
        <Text>عرض الـ tablet</Text>
      ) : (
        <Text>عرض الهاتف</Text>
      )}
    </View>
  );
}
```

### Responsive Grid

```tsx
export function ResponsiveGrid({ items }) {
  const { getColumns, getItemWidth, getResponsiveGap } = useResponsive();

  const columns = getColumns(150);
  const itemWidth = getItemWidth(columns);
  const gap = getResponsiveGap();

  return (
    <View style={{ flexDirection: "row", gap, flexWrap: "wrap" }}>
      {items.map((item) => (
        <View key={item.id} style={{ width: itemWidth }}>
          <CardEnhanced>{item.content}</CardEnhanced>
        </View>
      ))}
    </View>
  );
}
```

---

## 5. Scroll Animations

### ScrollAnimatedView

```tsx
import { ScrollAnimatedView } from "@/components/scroll-animated-view";

export function MyScreen() {
  return (
    <ScrollAnimatedView
      parallaxHeight={200}
      parallaxImage={<Image source={require("./header.png")} />}
      onScroll={(offset) => console.log("Scroll offset:", offset)}
    >
      <View className="p-4">
        <Text>محتوى مع parallax effect</Text>
      </View>
    </ScrollAnimatedView>
  );
}
```

---

## 6. أمثلة عملية متكاملة

### مثال 1: شاشة منتج مع animations

```tsx
import { ScreenContainer } from "@/components/screen-container";
import { CardEnhanced } from "@/components/card-enhanced";
import { ButtonAnimated } from "@/components/button-animated";
import { useAnimation } from "@/hooks/use-animation";
import { Animated } from "react-native";

export default function ProductScreen() {
  const { getTransformStyle } = useAnimation({
    type: "fadeIn",
    duration: 300,
    autoStart: true,
  });

  return (
    <ScreenContainer>
      <Animated.View style={getTransformStyle()}>
        <CardEnhanced variant="elevated" shadow="large">
          <Image source={require("./product.png")} />
          <Text className="text-xl font-bold mt-4">اسم المنتج</Text>
          <Text className="text-muted mt-2">وصف المنتج</Text>
        </CardEnhanced>

        <ButtonAnimated
          title="أضف إلى السلة"
          onPress={handleAddToCart}
          className="mt-6"
        />
      </Animated.View>
    </ScreenContainer>
  );
}
```

### مثال 2: قائمة مع loading و empty states

```tsx
export function ProductList({ products, isLoading }) {
  if (isLoading) {
    return <LoadingState message="جاري تحميل المنتجات..." fullScreen />;
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title="لا توجد منتجات"
        description="حاول تغيير معايير البحث"
        actionLabel="إعادة تعيين"
        onAction={handleReset}
      />
    );
  }

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <CardEnhanced
          onPress={() => navigateToProduct(item.id)}
          className="mb-4"
        >
          <Image source={{ uri: item.image }} />
          <Text className="font-bold mt-2">{item.name}</Text>
        </CardEnhanced>
      )}
      keyExtractor={(item) => item.id}
    />
  );
}
```

---

## 7. أفضل الممارسات

### ✅ افعل

- استخدم Design System constants للتوحيد
- استخدم useResponsive للتخطيطات المرنة
- أضف animations للعمليات المهمة فقط
- استخدم LoadingState و EmptyState دائماً
- وفر haptic feedback للتفاعلات الرئيسية

### ❌ لا تفعل

- لا تستخدم animations مفرطة
- لا تتجاهل الحالات الفارغة والتحميل
- لا تستخدم أحجام ثابتة للعناصر
- لا تنسَ safe area insets
- لا تستخدم ألوان عشوائية

---

## 8. الخطوات التالية

- [ ] اختبار على أجهزة مختلفة
- [ ] تحسين الأداء للقوائم الطويلة
- [ ] إضافة dark mode animations
- [ ] تحسين accessibility
