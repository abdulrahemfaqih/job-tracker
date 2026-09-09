"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, AuthActionResult } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<AuthActionResult | null, FormData>(
    loginAction,
    null
  );

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-bg">
      <div className="w-full max-w-sm bg-bg border border-border rounded-[8px] p-8 shadow-subtle">
        <div className="text-center mb-8">
          <span className="font-mono text-xs uppercase tracking-widest text-text-secondary">
            Internal Tool
          </span>
          <h1 className="text-xl font-bold tracking-tight text-text-primary mt-1">
            JOB TRACKER
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Masuk untuk mengakses data lamaran kerja
          </p>
        </div>

        {state?.error && (
          <div className="mb-5 p-3 rounded-[6px] border border-border-strong bg-surface text-text-primary text-xs font-medium">
            {state.error}
          </div>
        )}

        <form action={formAction} className="flex flex-col gap-4">
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
            placeholder="••••••••"
            required
            autoComplete="current-password"
            error={state?.fieldErrors?.password?.[0]}
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full mt-2"
            disabled={isPending}
          >
            {isPending ? "Memproses..." : "Masuk"}
          </Button>
        </form>

        <div className="mt-6 pt-5 border-t border-border text-center text-xs text-text-secondary">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="text-text-primary font-medium underline underline-offset-4 hover:text-text-secondary"
          >
            Daftar
          </Link>
        </div>
      </div>
    </main>
  );
}
