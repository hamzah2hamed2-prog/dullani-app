# توثيق نقاط نهاية المصادقة (Authentication API Endpoints)

## نظرة عامة

هذا المستند يوضح نقاط النهاية المطلوبة لنظام المصادقة في تطبيق دلني.

---

## 1. تسجيل الدخول (Login)

### المسار
```
POST /api/auth/login
```

### الطلب (Request)

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### الاستجابة الناجحة (Success Response - 200)

```json
{
  "success": true,
  "sessionToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "openId": "user-123",
    "name": "أحمد محمد",
    "email": "user@example.com",
    "loginMethod": "email",
    "lastSignedIn": "2026-04-01T03:20:00Z",
    "accountType": "consumer"
  }
}
```

### الاستجابة الفاشلة (Error Response - 401)

```json
{
  "success": false,
  "error": "بيانات المصادقة غير صحيحة",
  "message": "البريد الإلكتروني أو كلمة المرور غير صحيحة"
}
```

### رموز الأخطاء

| الرمز | الرسالة | الوصف |
|------|--------|-------|
| 400 | بيانات غير صحيحة | البريد الإلكتروني أو كلمة المرور مفقودة |
| 401 | بيانات المصادقة غير صحيحة | البريد الإلكتروني أو كلمة المرور غير صحيحة |
| 429 | محاولات كثيرة جداً | تم تجاوز عدد محاولات تسجيل الدخول |
| 500 | خطأ في الخادم | حدث خطأ في معالجة الطلب |

---

## 2. إنشاء حساب جديد (Sign Up)

### المسار
```
POST /api/auth/signup
```

### الطلب (Request)

```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "accountType": "consumer"
}
```

### الاستجابة الناجحة (Success Response - 201)

```json
{
  "success": true,
  "sessionToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "openId": "user-456",
    "name": null,
    "email": "newuser@example.com",
    "loginMethod": "email",
    "lastSignedIn": "2026-04-01T03:20:00Z",
    "accountType": "consumer"
  }
}
```

### الاستجابة الفاشلة (Error Response - 400)

```json
{
  "success": false,
  "error": "البريد الإلكتروني موجود بالفعل",
  "message": "هذا البريد الإلكتروني مسجل بالفعل في النظام"
}
```

### رموز الأخطاء

| الرمز | الرسالة | الوصف |
|------|--------|-------|
| 400 | بيانات غير صحيحة | البريد الإلكتروني أو كلمة المرور غير صحيحة |
| 400 | البريد الإلكتروني موجود | البريد الإلكتروني مسجل بالفعل |
| 400 | كلمة المرور ضعيفة | كلمة المرور لا تفي بمتطلبات الأمان |
| 500 | خطأ في الخادم | حدث خطأ في معالجة الطلب |

---

## 3. تسجيل الخروج (Logout)

### المسار
```
POST /api/auth/logout
```

### المصادقة
```
Authorization: Bearer {sessionToken}
```

### الاستجابة الناجحة (Success Response - 200)

```json
{
  "success": true,
  "message": "تم تسجيل الخروج بنجاح"
}
```

---

## 4. الحصول على بيانات المستخدم الحالي (Get Current User)

### المسار
```
GET /api/auth/me
```

### المصادقة
```
Authorization: Bearer {sessionToken}
```

أو (للويب):
```
Cookie: session={sessionToken}
```

### الاستجابة الناجحة (Success Response - 200)

```json
{
  "user": {
    "id": 1,
    "openId": "user-123",
    "name": "أحمد محمد",
    "email": "user@example.com",
    "loginMethod": "email",
    "lastSignedIn": "2026-04-01T03:20:00Z",
    "accountType": "consumer"
  }
}
```

### الاستجابة الفاشلة (Error Response - 401)

```json
{
  "success": false,
  "error": "غير مصرح",
  "message": "جلسة غير صحيحة أو منتهية"
}
```

---

## 5. تحديث كلمة المرور (Update Password)

### المسار
```
POST /api/auth/password/update
```

### المصادقة
```
Authorization: Bearer {sessionToken}
```

### الطلب (Request)

```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

### الاستجابة الناجحة (Success Response - 200)

```json
{
  "success": true,
  "message": "تم تحديث كلمة المرور بنجاح"
}
```

---

## 6. استرجاع كلمة المرور (Forgot Password)

### المسار
```
POST /api/auth/password/reset
```

### الطلب (Request)

```json
{
  "email": "user@example.com"
}
```

### الاستجابة الناجحة (Success Response - 200)

```json
{
  "success": true,
  "message": "تم إرسال رابط استرجاع كلمة المرور إلى بريدك الإلكتروني"
}
```

---

## 7. تأكيد استرجاع كلمة المرور (Confirm Password Reset)

### المسار
```
POST /api/auth/password/reset/confirm
```

### الطلب (Request)

```json
{
  "token": "reset-token-from-email",
  "newPassword": "newpassword456"
}
```

### الاستجابة الناجحة (Success Response - 200)

```json
{
  "success": true,
  "message": "تم تحديث كلمة المرور بنجاح"
}
```

---

## 8. تحديث بيانات المستخدم (Update User Profile)

### المسار
```
PUT /api/auth/profile
```

### المصادقة
```
Authorization: Bearer {sessionToken}
```

### الطلب (Request)

```json
{
  "name": "أحمد محمد علي",
  "phone": "+966501234567",
  "bio": "مرحباً بك في ملفي الشخصي"
}
```

### الاستجابة الناجحة (Success Response - 200)

```json
{
  "success": true,
  "user": {
    "id": 1,
    "openId": "user-123",
    "name": "أحمد محمد علي",
    "email": "user@example.com",
    "loginMethod": "email",
    "lastSignedIn": "2026-04-01T03:20:00Z",
    "accountType": "consumer"
  }
}
```

---

## متطلبات الأمان

### كلمة المرور
- الحد الأدنى: 6 أحرف
- يجب أن تحتوي على أحرف كبيرة وصغيرة وأرقام (اختياري لكن موصى به)
- لا يجب أن تحتوي على بيانات شخصية

### البريد الإلكتروني
- يجب أن يكون صيغة بريد إلكتروني صحيحة
- يجب أن يكون فريداً في النظام

### جلسة العمل (Session)
- صلاحية الجلسة: 30 يوم
- يجب تحديث الجلسة عند كل استخدام
- يجب حذف الجلسة عند تسجيل الخروج

---

## معالجة الأخطاء

### رموز الأخطاء العامة

| الرمز | الرسالة | الوصف |
|------|--------|-------|
| 400 | Bad Request | بيانات الطلب غير صحيحة |
| 401 | Unauthorized | المستخدم غير مصرح |
| 403 | Forbidden | الوصول مرفوض |
| 404 | Not Found | المورد غير موجود |
| 429 | Too Many Requests | تم تجاوز عدد الطلبات المسموح |
| 500 | Internal Server Error | خطأ في الخادم |

---

## أمثلة الاستخدام

### مثال 1: تسجيل الدخول

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### مثال 2: إنشاء حساب جديد

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "password123",
    "accountType": "consumer"
  }'
```

### مثال 3: الحصول على بيانات المستخدم

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer {sessionToken}"
```

---

## الخلاصة

تم توثيق جميع نقاط النهاية المطلوبة لنظام المصادقة. يجب على فريق الخادم تنفيذ هذه النقاط النهائية حسب المواصفات المذكورة أعلاه.
