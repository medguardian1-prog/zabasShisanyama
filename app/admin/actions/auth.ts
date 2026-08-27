"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import {
  SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/auth";
import { clearAttempts, isRateLimited, recordAttempt } from "@/lib/rate-limit";

export interface LoginState {
  error: string | null;
}

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return { error: "Too many attempts, try again later." };
  }

  const password = formData.get("password");
  const hash = process.env.ADMIN_PASSWORD_HASH;

  // Generic failure — never reveal whether the env var is missing.
  if (typeof password !== "string" || !password || !hash) {
    recordAttempt(ip);
    return { error: "Incorrect password" };
  }

  const valid = await bcrypt.compare(password, hash);
  if (!valid) {
    recordAttempt(ip);
    return { error: "Incorrect password" };
  }

  const token = await createSessionToken();
  if (!token) {
    return { error: "Incorrect password" };
  }

  clearAttempts(ip);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, sessionCookieOptions());
  redirect("/admin");
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/admin/login");
}
