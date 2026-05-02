import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="container py-6">
        <Link href="/">
          <Logo />
        </Link>
      </header>
      <div className="flex-1 container flex items-center justify-center">
        <div className="max-w-md text-center space-y-6">
          <div className="inline-flex size-16 rounded-full bg-lime/10 border border-lime/30 items-center justify-center">
            <Compass className="size-8 text-lime" />
          </div>
          <div>
            <h1 className="text-5xl font-semibold mb-2">404</h1>
            <p className="text-ink-400 text-pretty">
              No encontramos lo que estabas buscando. Puede que el link sea
              viejo o este mal escrito.
            </p>
          </div>
          <Button asChild>
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
