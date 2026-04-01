/**
 * Authentication Tests
 * Tests for email/password authentication endpoints
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";

const API_URL = process.env.API_URL || "http://localhost:3000";

describe("Authentication Endpoints", () => {
  let sessionToken: string;
  let testEmail: string;
  const testPassword = "TestPassword123";
  const testAccountType = "consumer";

  beforeAll(() => {
    // Generate unique email for each test run
    testEmail = `test-${Date.now()}@example.com`;
  });

  describe("POST /api/auth/signup", () => {
    it("should create a new user account", async () => {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
          accountType: testAccountType,
        }),
      });

      expect(response.status).toBe(201);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.sessionToken).toBeDefined();
      expect(data.user).toBeDefined();
      expect(data.user.email).toBe(testEmail);
      expect(data.user.accountType).toBe(testAccountType);

      // Store session token for later tests
      sessionToken = data.sessionToken;
    });

    it("should reject signup with invalid email", async () => {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "invalid-email",
          password: testPassword,
          accountType: testAccountType,
        }),
      });

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();
    });

    it("should reject signup with weak password", async () => {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: `test-weak-${Date.now()}@example.com`,
          password: "123", // Too short
          accountType: testAccountType,
        }),
      });

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();
    });

    it("should reject signup with duplicate email", async () => {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: testEmail, // Already registered
          password: testPassword,
          accountType: testAccountType,
        }),
      });

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain("موجود");
    });

    it("should reject signup with missing fields", async () => {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: `test-missing-${Date.now()}@example.com`,
          // Missing password
        }),
      });

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.success).toBe(false);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login with correct credentials", async () => {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
        }),
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.sessionToken).toBeDefined();
      expect(data.user).toBeDefined();
      expect(data.user.email).toBe(testEmail);
    });

    it("should reject login with wrong password", async () => {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: testEmail,
          password: "WrongPassword123",
        }),
      });

      expect(response.status).toBe(401);

      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain("غير صحيحة");
    });

    it("should reject login with non-existent email", async () => {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "nonexistent@example.com",
          password: testPassword,
        }),
      });

      expect(response.status).toBe(401);

      const data = await response.json();
      expect(data.success).toBe(false);
    });

    it("should reject login with invalid email format", async () => {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "invalid-email",
          password: testPassword,
        }),
      });

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.success).toBe(false);
    });

    it("should reject login with missing fields", async () => {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: testEmail,
          // Missing password
        }),
      });

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.success).toBe(false);
    });
  });

  describe("POST /api/auth/password/reset", () => {
    it("should request password reset", async () => {
      const response = await fetch(`${API_URL}/api/auth/password/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: testEmail,
        }),
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.message).toBeDefined();
      // In production, resetToken should not be returned
      // but for testing purposes it might be included
    });

    it("should handle password reset for non-existent email", async () => {
      const response = await fetch(`${API_URL}/api/auth/password/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "nonexistent@example.com",
        }),
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      // Should not reveal if email exists or not for security
    });

    it("should reject password reset with invalid email", async () => {
      const response = await fetch(`${API_URL}/api/auth/password/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "invalid-email",
        }),
      });

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.success).toBe(false);
    });

    it("should reject password reset with missing email", async () => {
      const response = await fetch(`${API_URL}/api/auth/password/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.success).toBe(false);
    });
  });

  describe("POST /api/auth/password/reset/confirm", () => {
    let resetToken: string;

    beforeAll(async () => {
      // Get a reset token
      const response = await fetch(`${API_URL}/api/auth/password/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: testEmail,
        }),
      });

      const data = await response.json();
      if (data.resetToken) {
        resetToken = data.resetToken;
      }
    });

    it("should reject password reset confirm with invalid token", async () => {
      const response = await fetch(
        `${API_URL}/api/auth/password/reset/confirm`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: "invalid-token",
            newPassword: "NewPassword123",
          }),
        }
      );

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.success).toBe(false);
    });

    it("should reject password reset confirm with weak password", async () => {
      const response = await fetch(
        `${API_URL}/api/auth/password/reset/confirm`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: resetToken || "some-token",
            newPassword: "123", // Too short
          }),
        }
      );

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.success).toBe(false);
    });

    it("should reject password reset confirm with missing fields", async () => {
      const response = await fetch(
        `${API_URL}/api/auth/password/reset/confirm`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: "some-token",
            // Missing newPassword
          }),
        }
      );

      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.success).toBe(false);
    });
  });
});
