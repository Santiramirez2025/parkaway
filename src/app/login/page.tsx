"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/shared/logo";
import { loginAdmin } from "@/server/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await loginAdmin(formData);
      if (!result.ok) {
        setError(result.error || "Error al iniciar sesion");
        return;
      }
      router.push("/admin");
      router.refresh();
    });
  };

  return (
    <main className="min-h-screen flex flex-col">
      <header className="container py-6">
        <Link href="/">
          <Logo />
        </Link>
      </header>

      <div className="flex-1 container flex items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="inline-flex size-14 rounded-2xl bg-lime/10 border border-lime/30 items-center justify-center mb-4">
              <Lock className="size-6 text-lime" />
            </div>
            <h1 className="text-3xl font-semibold">Panel ParkAway</h1>
            <p className="text-ink-400 mt-2 text-sm">
              Inicia sesion para gestionar tus reservas
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-3xl border border-ink-800 bg-white p-8"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@parkaway.com.ar"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contrasena</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="********"
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" />
                  Ingresando...
                </>
              ) : (
                <>
                  Ingresar
                  <ArrowRight />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-ink-500 mt-6">
            Olvidaste tu contrasena? Contacta al administrador del sistema.
          </p>
        </div>
      </div>
    </main>
  );
}
