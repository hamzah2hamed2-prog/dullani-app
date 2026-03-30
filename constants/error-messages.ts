/**
 * Error Messages Constants
 * Centralized error messages for consistent user-friendly error handling
 */

export const ERROR_MESSAGES = {
  // Network Errors
  NETWORK_ERROR: "فشل الاتصال بالخادم. تحقق من اتصالك بالإنترنت.",
  NETWORK_TIMEOUT: "انتهت مهلة الاتصال. حاول مرة أخرى.",
  NO_INTERNET: "لا يوجد اتصال بالإنترنت.",

  // Authentication Errors
  UNAUTHORIZED: "جلستك انتهت. يرجى تسجيل الدخول مرة أخرى.",
  FORBIDDEN: "ليس لديك صلاحية للقيام بهذا الإجراء.",
  INVALID_CREDENTIALS: "بيانات الدخول غير صحيحة.",
  SESSION_EXPIRED: "انتهت جلستك. يرجى تسجيل الدخول مرة أخرى.",

  // Validation Errors
  INVALID_EMAIL: "البريد الإلكتروني غير صحيح.",
  INVALID_PASSWORD: "كلمة المرور غير صحيحة.",
  WEAK_PASSWORD: "كلمة المرور ضعيفة جداً. استخدم أحرفاً وأرقاماً.",
  REQUIRED_FIELD: "هذا الحقل مطلوب.",
  INVALID_PHONE: "رقم الهاتف غير صحيح.",

  // Server Errors
  SERVER_ERROR: "حدث خطأ في الخادم. حاول مرة أخرى لاحقاً.",
  SERVICE_UNAVAILABLE: "الخدمة غير متاحة حالياً. حاول لاحقاً.",
  INTERNAL_ERROR: "حدث خطأ داخلي. يرجى المحاولة مرة أخرى.",

  // Resource Errors
  NOT_FOUND: "لم يتم العثور على المورد المطلوب.",
  RESOURCE_NOT_FOUND: "المورد المطلوب غير موجود.",
  ALREADY_EXISTS: "هذا المورد موجود بالفعل.",
  CONFLICT: "حدث تضارب. حاول مرة أخرى.",

  // Data Errors
  INVALID_DATA: "البيانات المدخلة غير صحيحة.",
  CORRUPTED_DATA: "البيانات تالفة. حاول مرة أخرى.",
  DATA_SYNC_ERROR: "فشل مزامنة البيانات. حاول مرة أخرى.",

  // File Errors
  FILE_TOO_LARGE: "حجم الملف كبير جداً. الحد الأقصى 10 MB.",
  INVALID_FILE_TYPE: "نوع الملف غير مدعوم.",
  FILE_UPLOAD_ERROR: "فشل تحميل الملف. حاول مرة أخرى.",

  // Product Errors
  PRODUCT_NOT_FOUND: "المنتج غير موجود.",
  PRODUCT_OUT_OF_STOCK: "المنتج غير متوفر حالياً.",
  INVALID_PRODUCT_DATA: "بيانات المنتج غير صحيحة.",

  // Store Errors
  STORE_NOT_FOUND: "المتجر غير موجود.",
  STORE_CLOSED: "المتجر مغلق حالياً.",

  // Message Errors
  MESSAGE_NOT_FOUND: "الرسالة غير موجودة.",
  MESSAGE_SEND_ERROR: "فشل إرسال الرسالة. حاول مرة أخرى.",
  CONVERSATION_NOT_FOUND: "المحادثة غير موجودة.",

  // Generic Errors
  UNKNOWN_ERROR: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
  SOMETHING_WENT_WRONG: "حدث شيء خاطئ. يرجى المحاولة مرة أخرى.",
  TRY_AGAIN: "حاول مرة أخرى.",
} as const;

export const ERROR_CODES = {
  // Network
  NETWORK_ERROR: "NETWORK_ERROR",
  TIMEOUT: "TIMEOUT",
  NO_INTERNET: "NO_INTERNET",

  // Auth
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  SESSION_EXPIRED: "SESSION_EXPIRED",

  // Validation
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_EMAIL: "INVALID_EMAIL",
  INVALID_PASSWORD: "INVALID_PASSWORD",

  // Server
  SERVER_ERROR: "SERVER_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",

  // Resource
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",

  // Generic
  UNKNOWN: "UNKNOWN",
} as const;

/**
 * Get user-friendly error message from error object or code
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Check if error message matches a known error
    const message = error.message.toLowerCase();

    if (message.includes("network") || message.includes("fetch")) {
      return ERROR_MESSAGES.NETWORK_ERROR;
    }
    if (message.includes("timeout")) {
      return ERROR_MESSAGES.NETWORK_TIMEOUT;
    }
    if (message.includes("unauthorized")) {
      return ERROR_MESSAGES.UNAUTHORIZED;
    }
    if (message.includes("forbidden")) {
      return ERROR_MESSAGES.FORBIDDEN;
    }
    if (message.includes("not found")) {
      return ERROR_MESSAGES.NOT_FOUND;
    }

    return error.message || ERROR_MESSAGES.UNKNOWN_ERROR;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  return ERROR_MESSAGES.UNKNOWN_ERROR;
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return message.includes("network") || message.includes("fetch") || message.includes("timeout");
  }
  return false;
}

/**
 * Check if error is an auth error
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return message.includes("unauthorized") || message.includes("forbidden") || message.includes("session");
  }
  return false;
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes("network") ||
      message.includes("timeout") ||
      message.includes("500") ||
      message.includes("503") ||
      message.includes("temporarily")
    );
  }
  return false;
}
