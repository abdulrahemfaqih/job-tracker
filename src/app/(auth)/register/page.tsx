"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction, AuthActionResult } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState<AuthActionResult | null, FormData>(
    registerAction,
    null
  );

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-bg">
      <div className="w-full max-w-sm bg-bg border border-border rounded-[8px] p-8 shadow-subtle">
        <div className="text-center mb-8">
          <span className="font-mono text-xs uppercase tracking-widest text-text-secondary">
            Registrasi Akun
          </span>
          <h1 className="text-xl font-bold tracking-tight text-text-primary mt-1">
            JOB TRACKER
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Buat akun untuk mulai memantau lamaran Anda
          </p>
        </div>

        {state?.error && (
          <div className="mb-5 p-3 rounded-[6px] border border-border-strong bg-surface text-text-primary text-xs font-medium">
            {state.error}
          </div>
        )}

        <form action={formAction} className="flex flex-col gap-4">
          <Input
            id="name"
            name="name"
            type="text"
            label="Nama Lengkap"
            placeholder="John Doe"
            required
            autoComplete="name"
            error={state?.fieldErrors?.name?.[0]}
          />

          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="nama@email.com"
            required
            autoComplete="email"
            error={state?.fieldErrors?.email?.[0]}
          />

          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="Minimal 6 karakter"
            required
            autoComplete="new-password"
            error={state?.fieldErrors?.password?.[0]}
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full mt-2"
            disabled={isPending}
          >
            {isPending ? "Mendaftarkan..." : "Daftar"}
          </Button>
        </form>

        <div className="mt-6 pt-5 border-t border-border text-center text-xs text-text-secondary">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="text-text-primary font-medium underline underline-offset-4 hover:text-text-secondary"
          >
            Masuk
          </Link>
        </div>
      </div>
    </main>
  );
}
