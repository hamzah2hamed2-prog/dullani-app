/**
 * Authentication Routes
 * REST API endpoints for email/password authentication
 */

import { Router, Request, Response } from "express";
import {
  createUserWithPassword,
  authenticateUserWithPassword,
  emailExists,
  requestPasswordReset,
  resetPasswordWithToken,
  updateUserPassword,
  getUserByEmail,
} from "../db-auth";
import {
  isValidEmail,
  isValidPassword,
  generateSessionToken,
} from "./auth-service";
import { COOKIE_NAME } from "../../shared/const";
import { getSessionCookieOptions } from "./cookies"; 
import { getDb } from "../db";

const router = Router();

/**
 * POST /api/auth/login
 * Login with email and password
 */
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "بيانات غير صحيحة",
        message: "البريد الإلكتروني وكلمة المرور مطلوبان",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: "بريد إلكتروني غير صحيح",
        message: "الرجاء إدخال بريد إلكتروني صحيح",
      });
    }

    // Authenticate user
    const result = await authenticateUserWithPassword(email, password);

    if (!result) {
      return res.status(401).json({
        success: false,
        error: "بيانات المصادقة غير صحيحة",
        message: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      });
    }

    // Set session cookie
    const cookieOptions = getSessionCookieOptions(req);
    res.cookie(COOKIE_NAME, result.sessionToken, cookieOptions);

    return res.status(200).json({
      success: true,
      sessionToken: result.sessionToken,
      user: {
        id: result.user.id,
        openId: result.user.openId,
        name: result.user.name,
        email: result.user.email,
        loginMethod: result.user.loginMethod,
        lastSignedIn: result.user.lastSignedIn,
        accountType: result.user.accountType,
      },
    });
  } catch (error) {
    console.error("[Auth] Login error:", error);
    return res.status(500).json({
      success: false,
      error: "خطأ في الخادم",
      message: "حدث خطأ أثناء معالجة الطلب",
    });
  }
});

/**
 * POST /api/auth/signup
 * Create a new account with email and password
 */
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { email, password, accountType = "consumer" } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "بيانات غير صحيحة",
        message: "البريد الإلكتروني وكلمة المرور مطلوبان",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: "بريد إلكتروني غير صحيح",
        message: "الرجاء إدخال بريد إلكتروني صحيح",
      });
    }

    // Validate password
    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        success: false,
        error: "كلمة مرور ضعيفة",
        message: passwordValidation.errors[0],
      });
    }

    // Check if email already exists
    const exists = await emailExists(email);
    if (exists) {
      return res.status(400).json({
        success: false,
        error: "البريد الإلكتروني موجود",
        message: "هذا البريد الإلكتروني مسجل بالفعل في النظام",
      });
    }

    // Validate account type
    if (!["consumer", "merchant"].includes(accountType)) {
      return res.status(400).json({
        success: false,
        error: "نوع حساب غير صحيح",
        message: "نوع الحساب يجب أن يكون 'consumer' أو 'merchant'",
      });
    }

    // Create user
    const result = await createUserWithPassword(email, password, accountType);

    if (!result) {
      return res.status(500).json({
        success: false,
        error: "فشل إنشاء الحساب",
        message: "حدث خطأ أثناء إنشاء الحساب",
      });
    }

    // Set session cookie
    const cookieOptions = getSessionCookieOptions(req);
    res.cookie(COOKIE_NAME, result.sessionToken, cookieOptions);

    return res.status(201).json({
      success: true,
      sessionToken: result.sessionToken,
      user: {
        id: result.user.id,
        openId: result.user.openId,
        name: result.user.name,
        email: result.user.email,
        loginMethod: result.user.loginMethod,
        lastSignedIn: result.user.lastSignedIn,
        accountType: result.user.accountType,
      },
    });
  } catch (error) {
    console.error("[Auth] Signup error:", error);
    return res.status(500).json({
      success: false,
      error: "خطأ في الخادم",
      message: "حدث خطأ أثناء معالجة الطلب",
    });
  }
});

/**
 * POST /api/auth/password/reset
 * Request a password reset
 */
router.post("/password/reset", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "بيانات غير صحيحة",
        message: "البريد الإلكتروني مطلوب",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: "بريد إلكتروني غير صحيح",
        message: "الرجاء إدخال بريد إلكتروني صحيح",
      });
    }

    const result = await requestPasswordReset(email);

    if (!result) {
      // Don't reveal if email exists or not for security
      return res.status(200).json({
        success: true,
        message: "تم إرسال رابط استرجاع كلمة المرور إلى بريدك الإلكتروني إن كان موجوداً",
      });
    }

    // In production, send email with reset link
    // For now, just return the token (in production, never do this!)
    console.log("[Auth] Password reset token:", result.resetToken);

    return res.status(200).json({
      success: true,
      message: "تم إرسال رابط استرجاع كلمة المرور إلى بريدك الإلكتروني",
      // Remove this in production!
      resetToken: result.resetToken,
    });
  } catch (error) {
    console.error("[Auth] Password reset error:", error);
    return res.status(500).json({
      success: false,
      error: "خطأ في الخادم",
      message: "حدث خطأ أثناء معالجة الطلب",
    });
  }
});

/**
 * POST /api/auth/password/reset/confirm
 * Confirm password reset with token
 */
router.post("/password/reset/confirm", async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "بيانات غير صحيحة",
        message: "الرمز وكلمة المرور الجديدة مطلوبان",
      });
    }

    // Validate password
    const passwordValidation = isValidPassword(newPassword);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        success: false,
        error: "كلمة مرور ضعيفة",
        message: passwordValidation.errors[0],
      });
    }

    const success = await resetPasswordWithToken(token, newPassword);

    if (!success) {
      return res.status(400).json({
        success: false,
        error: "رمز غير صحيح أو منتهي الصلاحية",
        message: "رمز استرجاع كلمة المرور غير صحيح أو انتهت صلاحيته",
      });
    }

    return res.status(200).json({
      success: true,
      message: "تم تحديث كلمة المرور بنجاح",
    });
  } catch (error) {
    console.error("[Auth] Password reset confirm error:", error);
    return res.status(500).json({
      success: false,
      error: "خطأ في الخادم",
      message: "حدث خطأ أثناء معالجة الطلب",
    });
  }
});

/**
 * POST /api/auth/password/update
 * Update password for authenticated user
 */
router.post("/password/update", async (req: Request, res: Response) => {
  try {
    // Get user from session (would be set by middleware in production)
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "غير مصرح",
        message: "يجب تسجيل الدخول أولاً",
      });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "بيانات غير صحيحة",
        message: "كلمة المرور الحالية والجديدة مطلوبان",
      });
    }

    // Validate new password
    const passwordValidation = isValidPassword(newPassword);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        success: false,
        error: "كلمة مرور ضعيفة",
        message: passwordValidation.errors[0],
      });
    }

    const success = await updateUserPassword(
      userId,
      currentPassword,
      newPassword
    );

    if (!success) {
      return res.status(400).json({
        success: false,
        error: "فشل تحديث كلمة المرور",
        message: "كلمة المرور الحالية غير صحيحة",
      });
    }

    return res.status(200).json({
      success: true,
      message: "تم تحديث كلمة المرور بنجاح",
    });
  } catch (error) {
    console.error("[Auth] Password update error:", error);
    return res.status(500).json({
      success: false,
      error: "خطأ في الخادم",
      message: "حدث خطأ أثناء معالجة الطلب",
    });
  }
});

export default router;
