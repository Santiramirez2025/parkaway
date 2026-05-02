"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="container py-6">
        <Link href="/">
          <Logo />
        </Link>
      </header>
      <div className="flex-1 container flex items-center justify-center">
        <div className="max-w-md text-center space-y-6">
          <div className="inline-flex size-16 rounded-full bg-destructive/10 border border-destructive/30 items-center justify-center">
            <AlertTriangle className="size-8 text-destructive" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold mb-2">Algo salio mal</h1>
            <p className="text-ink-400 text-pretty">
              Tuvimos un problema procesando tu pedido. Volve a intentar en
              unos segundos.
            </p>
            {error.digest && (
              <p className="text-xs text-ink-600 mt-3 font-mono">
                ref: {error.digest}
              </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button onClick={reset}>Reintentar</Button>
            <Button asChild variant="secondary">
              <Link href="/">Volver al inicio</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
