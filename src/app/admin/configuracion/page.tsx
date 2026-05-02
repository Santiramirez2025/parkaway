import { SettingsForm } from "./components/settings-form";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await prisma.settings.findUniqueOrThrow({
    where: { id: "singleton" },
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Configuración
        </h1>
        <p className="text-ink-400 text-sm mt-1">
          Ajustá precios, datos de la cochera y contacto. Los cambios se
          aplican a las reservas nuevas.
        </p>
      </div>

      <SettingsForm initial={settings} />
    </div>
  );
}
