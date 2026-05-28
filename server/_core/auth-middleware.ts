/**
 * Authentication Middleware
 * Extracts and validates sessionToken from Authorization header
 */

import { Request, Response, NextFunction } from "express";

/**
 * Middleware to extract userId from sessionToken in Authorization header
 * Expected format: Authorization: Bearer <sessionToken>
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "غير مصرح",
        message: "رمز المصادقة مفقود أو غير صحيح",
      });
    }

    const sessionToken = authHeader.substring(7); // Remove "Bearer " prefix

    // Parse sessionToken format: token-<userId>-<timestamp>-<random>
    const parts = sessionToken.split("-");
    
    if (parts.length < 3 || parts[0] !== "token") {
      return res.status(401).json({
        success: false,
        error: "غير مصرح",
        message: "رمز المصادقة غير صحيح",
      });
    }

    const userId = parseInt(parts[1], 10);

    if (isNaN(userId)) {
      return res.status(401).json({
        success: false,
        error: "غير مصرح",
        message: "معرف المستخدم غير صحيح",
      });
    }

    // Attach userId to request object
    (req as any).userId = userId;
    (req as any).sessionToken = sessionToken;

    next();
  } catch (error) {
    console.error("[Auth Middleware] Error:", error);
    return res.status(401).json({
      success: false,
      error: "غير مصرح",
      message: "حدث خطأ أثناء المصادقة",
    });
  }
}

/**
 * Optional middleware - doesn't fail if no auth header
 */
export function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const sessionToken = authHeader.substring(7);
      const parts = sessionToken.split("-");

      if (parts.length >= 3 && parts[0] === "token") {
        const userId = parseInt(parts[1], 10);
        if (!isNaN(userId)) {
          (req as any).userId = userId;
          (req as any).sessionToken = sessionToken;
        }
      }
    }

    next();
  } catch (error) {
    console.error("[Optional Auth Middleware] Error:", error);
    next(); // Continue even if there's an error
  }
}
