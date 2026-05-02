import { BlockForm } from "./components/block-form";
import { BlockedList } from "./components/blocked-list";
import { getBlockedDates } from "@/server/repositories/calendar";

export const dynamic = "force-dynamic";

export default async function BlockedDatesPage() {
  const items = await getBlockedDates();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Fechas bloqueadas
        </h1>
        <p className="text-ink-400 text-sm mt-1">
          Cuando bloquees una fecha, los clientes no van a poder reservar para
          ese día.
        </p>
      </div>

      <BlockForm />

      <div className="space-y-3">
        <h2 className="text-xs uppercase tracking-wider text-ink-500">
          Fechas bloqueadas ({items.length})
        </h2>
        <BlockedList items={items} />
      </div>
    </div>
  );
}
