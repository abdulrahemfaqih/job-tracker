"use server";

import { redirect } from "next/navigation";
import { db, ensureSchema } from "@/lib/db/client";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { setSessionCookie, clearSessionCookie } from "@/lib/auth/session";
import { loginSchema, registerSchema } from "@/lib/validations/auth";

export interface AuthActionResult {
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function loginAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  await ensureSchema();

  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { email, password } = parsed.data;

  try {
    const result = await db.execute({
      sql: "SELECT id, name, email, password_hash FROM users WHERE email = ? LIMIT 1",
      args: [email],
    });

    if (result.rows.length === 0) {
      return { error: "Email atau password salah" };
    }

    const user = result.rows[0];
    const passwordValid = await verifyPassword(
      password,
      user.password_hash as string
    );

    if (!passwordValid) {
      return { error: "Email atau password salah" };
    }

    const { signSession } = await import("@/lib/auth/session");
    const token = await signSession({
      userId: user.id as string,
      name: user.name as string,
      email: user.email as string,
    });

    await setSessionCookie(token);
  } catch (err: unknown) {
    console.error("Login error:", err);
    return { error: "Terjadi kesalahan sistem saat login" };
  }

  redirect("/dashboard");
}

export async function registerAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  await ensureSchema();

  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = registerSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = parsed.data;

  try {
    const existing = await db.execute({
      sql: "SELECT id FROM users WHERE email = ? LIMIT 1",
      args: [email],
    });

    if (existing.rows.length > 0) {
      return { error: "Email sudah terdaftar. Silakan login." };
    }

    const hashedPassword = await hashPassword(password);
    const userId = crypto.randomUUID();
    const now = new Date().toISOString();

    await db.execute({
      sql: "INSERT INTO users (id, name, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)",
      args: [userId, name, email, hashedPassword, now],
    });

    // Auto-login per PRD.md & DESIGN.md
    const { signSession } = await import("@/lib/auth/session");
    const token = await signSession({
      userId,
      name,
      email,
    });

    await setSessionCookie(token);
  } catch (err: unknown) {
    console.error("Register error:", err);
    return { error: "Terjadi kesalahan sistem saat registrasi" };
  }

  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/login");
}
