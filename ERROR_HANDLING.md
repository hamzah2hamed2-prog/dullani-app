# معالجة الأخطاء المتقدمة - دليل شامل

## نظرة عامة

يوفر تطبيق دلني نظام معالجة أخطاء متقدم يشمل:

- **Error Boundaries** - لالتقاط الأخطاء في الشاشات والمكونات
- **Error Messages** - رسائل خطأ ودية وموحدة
- **Retry Logic** - إعادة محاولة تلقائية للعمليات الفاشلة
- **Error Display** - عرض الأخطاء بطرق مختلفة (toast, inline, banner)

---

## 1. Error Boundary Components

### الاستخدام الأساسي

```tsx
import { ErrorBoundary } from "@/components/error-boundary";

export default function MyScreen() {
  return (
    <ErrorBoundary>
      <ScreenContent />
    </ErrorBoundary>
  );
}
```

### مع Custom Fallback

```tsx
<ErrorBoundary
  fallback={(error, retry) => (
    <View className="flex-1 items-center justify-center">
      <Text>{error.message}</Text>
      <Button onPress={retry} title="حاول مرة أخرى" />
    </View>
  )}
  onError={(error) => {
    console.error("Screen error:", error);
    // Send to error tracking service
  }}
>
  <ScreenContent />
</ErrorBoundary>
```

### مع مستويات مختلفة

```tsx
// Global Error Boundary
<ErrorBoundary level="global">
  <App />
</ErrorBoundary>

// Screen-level Error Boundary
<ErrorBoundary level="screen">
  <HomeScreen />
</ErrorBoundary>

// Component-level Error Boundary
<ErrorBoundary level="component">
  <ProductCard />
</ErrorBoundary>
```

---

## 2. Error Messages Constants

### الاستخدام

```tsx
import { ERROR_MESSAGES, getErrorMessage } from "@/constants/error-messages";

// استخدام رسالة محددة
const message = ERROR_MESSAGES.NETWORK_ERROR;

// الحصول على رسالة من error object
const error = new Error("Network failed");
const userMessage = getErrorMessage(error);
```

### الرسائل المتاحة

| الفئة | الرسائل |
|-------|--------|
| **Network** | `NETWORK_ERROR`, `NETWORK_TIMEOUT`, `NO_INTERNET` |
| **Auth** | `UNAUTHORIZED`, `FORBIDDEN`, `SESSION_EXPIRED` |
| **Validation** | `INVALID_EMAIL`, `INVALID_PASSWORD`, `REQUIRED_FIELD` |
| **Server** | `SERVER_ERROR`, `SERVICE_UNAVAILABLE` |
| **Resource** | `NOT_FOUND`, `ALREADY_EXISTS`, `CONFLICT` |
| **Generic** | `UNKNOWN_ERROR`, `SOMETHING_WENT_WRONG` |

### دوال مساعدة

```tsx
import {
  getErrorMessage,
  isNetworkError,
  isAuthError,
  isRetryableError,
} from "@/constants/error-messages";

const error = new Error("Network timeout");

// الحصول على رسالة ودية
const message = getErrorMessage(error); // "فشل الاتصال بالخادم..."

// التحقق من نوع الخطأ
if (isNetworkError(error)) {
  // معالجة خطأ الشبكة
}

if (isAuthError(error)) {
  // إعادة توجيه لشاشة تسجيل الدخول
}

if (isRetryableError(error)) {
  // إعادة محاولة العملية
}
```

---

## 3. useRetry Hook

### الاستخدام الأساسي

```tsx
import { useRetry } from "@/hooks/use-retry";

export function MyComponent() {
  const { executeWithRetry, isRetrying, retryCount } = useRetry({
    maxRetries: 3,
    initialDelayMs: 1000,
  });

  const handleFetch = async () => {
    try {
      const data = await executeWithRetry(() => fetchData());
      setData(data);
    } catch (error) {
      setError(error);
    }
  };

  return (
    <View>
      <Button
        onPress={handleFetch}
        disabled={isRetrying}
        title={isRetrying ? `جاري المحاولة ${retryCount}...` : "جلب البيانات"}
      />
    </View>
  );
}
```

### مع Callbacks

```tsx
const { executeWithRetry } = useRetry({
  maxRetries: 3,
  onRetry: (attempt, error) => {
    console.log(`محاولة ${attempt}: ${error.message}`);
  },
  onMaxRetriesExceeded: (error) => {
    console.error("فشلت جميع المحاولات:", error);
  },
});
```

### الخيارات المتاحة

```tsx
interface UseRetryOptions {
  maxRetries?: number;           // الحد الأقصى للمحاولات (افتراضي: 3)
  initialDelayMs?: number;       // التأخير الأولي بالميلي ثانية (افتراضي: 1000)
  maxDelayMs?: number;           // الحد الأقصى للتأخير (افتراضي: 10000)
  backoffMultiplier?: number;    // مضاعف التأخير الأسي (افتراضي: 2)
  onRetry?: (attempt, error) => void;
  onMaxRetriesExceeded?: (error) => void;
}
```

---

## 4. useAsyncError Hook

### الاستخدام

```tsx
import { useAsyncError } from "@/hooks/use-async-error";

export function MyComponent() {
  const { execute, error, isLoading, getErrorText, clearError } = useAsyncError({
    onSuccess: () => {
      console.log("نجحت العملية");
    },
    onError: (error) => {
      console.error("فشلت العملية:", error);
    },
  });

  const handleSubmit = async () => {
    const result = await execute(async () => {
      return await submitForm(data);
    });

    if (result) {
      // نجحت العملية
    }
  };

  return (
    <View>
      {error && (
        <Text className="text-error">{getErrorText()}</Text>
      )}
      <Button onPress={handleSubmit} disabled={isLoading} />
    </View>
  );
}
```

---

## 5. Error Display Component

### Variants

#### Toast (الافتراضي)

```tsx
<ErrorDisplay
  error={error}
  variant="toast"
  showRetry={true}
  onRetry={handleRetry}
  onDismiss={handleDismiss}
/>
```

#### Inline

```tsx
<ErrorDisplay
  error={error}
  variant="inline"
  showRetry={true}
  onRetry={handleRetry}
/>
```

#### Banner

```tsx
<ErrorDisplay
  error={error}
  variant="banner"
  showRetry={true}
  onRetry={handleRetry}
/>
```

---

## 6. أمثلة عملية

### مثال 1: شاشة مع معالجة أخطاء شاملة

```tsx
import { ScreenContainer } from "@/components/screen-container";
import { ErrorBoundary } from "@/components/error-boundary";
import { ErrorDisplay } from "@/components/error-display";
import { useAsyncError } from "@/hooks/use-async-error";

export default function ProductScreen() {
  const { execute, error, isLoading, getErrorText, clearError } = useAsyncError();
  const [product, setProduct] = useState(null);

  const loadProduct = async () => {
    const result = await execute(async () => {
      return await fetchProduct(productId);
    });

    if (result) {
      setProduct(result);
    }
  };

  useEffect(() => {
    loadProduct();
  }, []);

  return (
    <ErrorBoundary>
      <ScreenContainer>
        {error && (
          <ErrorDisplay
            error={error}
            variant="inline"
            showRetry={true}
            onRetry={loadProduct}
            onDismiss={clearError}
          />
        )}

        {isLoading && <LoadingSpinner />}
        {product && <ProductDetail product={product} />}
      </ScreenContainer>
    </ErrorBoundary>
  );
}
```

### مثال 2: API Hook مع Retry Logic

```tsx
import { useQuery } from "@tanstack/react-query";
import { useRetry } from "@/hooks/use-retry";

export function useProducts(filters) {
  const { executeWithRetry } = useRetry({
    maxRetries: 3,
    initialDelayMs: 1000,
  });

  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      return executeWithRetry(() => fetchProducts(filters));
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
```

### مثال 3: Form Submission مع معالجة أخطاء

```tsx
export function LoginForm() {
  const { execute, error, isLoading, getErrorText } = useAsyncError();
  const [formData, setFormData] = useState({});

  const handleSubmit = async () => {
    const result = await execute(async () => {
      return await loginUser(formData);
    });

    if (result) {
      // تسجيل الدخول نجح
      router.push("/home");
    }
  };

  return (
    <View>
      {error && (
        <ErrorDisplay
          error={error}
          variant="inline"
          showRetry={false}
          onDismiss={() => {
            // Clear error
          }}
        />
      )}

      <TextInput
        placeholder="البريد الإلكتروني"
        value={formData.email}
        onChangeText={(email) => setFormData({ ...formData, email })}
      />

      <TextInput
        placeholder="كلمة المرور"
        secureTextEntry
        value={formData.password}
        onChangeText={(password) => setFormData({ ...formData, password })}
      />

      <Button
        onPress={handleSubmit}
        disabled={isLoading}
        title={isLoading ? "جاري التحميل..." : "دخول"}
      />
    </View>
  );
}
```

---

## 7. أفضل الممارسات

### ✅ افعل

- استخدم `ErrorBoundary` على مستوى الشاشة على الأقل
- استخدم رسائل خطأ من `ERROR_MESSAGES` للتوحيد
- وفر خيار "حاول مرة أخرى" للأخطاء القابلة للإصلاح
- سجل الأخطاء للتحليل والمراقبة
- تعامل مع أخطاء الشبكة بشكل منفصل

### ❌ لا تفعل

- لا تعرض رسائل خطأ تقنية للمستخدم
- لا تتجاهل الأخطاء بصمت
- لا تحاول إعادة محاولة جميع الأخطاء تلقائياً
- لا تعرض رسائل خطأ متعددة في نفس الوقت
- لا تستخدم `console.error` فقط دون معالجة الخطأ

---

## 8. الخطوات التالية

- [ ] إضافة error tracking service (Sentry, etc.)
- [ ] إضافة offline error handling
- [ ] إضافة error analytics dashboard
- [ ] تحسين رسائل الخطأ بناءً على feedback المستخدمين
