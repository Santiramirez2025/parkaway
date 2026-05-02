"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export interface LoginResult {
  ok: boolean;
  error?: string;
}

export async function loginAdmin(formData: FormData): Promise<LoginResult> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    return { ok: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, error: "Email o contrasena invalidos" };
    }
    // Re-throw redirect errors
    throw error;
  }
}
