import { MonthNav } from "./components/month-nav";
import { MonthCalendar } from "./components/month-calendar";
import { getMonthOccupancy } from "@/server/repositories/calendar";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{
    year?: string;
    month?: string;
  }>;
}

export default async function CalendarPage({ searchParams }: Props) {
  const params = await searchParams;
  const now = new Date();
  const year = params.year ? parseInt(params.year) : now.getFullYear();
  const month = params.month ? parseInt(params.month) : now.getMonth() + 1;

  const data = await getMonthOccupancy(year, month);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Calendario
        </h1>
        <p className="text-ink-400 text-sm mt-1">
          {data.totalReservations}{" "}
          {data.totalReservations === 1 ? "reserva activa" : "reservas activas"}{" "}
          en el mes
        </p>
      </div>

      <MonthNav year={year} month={month} />

      <MonthCalendar
        days={data.days}
        blocked={data.blocked}
        year={year}
        month={month}
      />

      <div className="flex flex-wrap gap-4 text-xs text-ink-400">
        <Legend color="lime" label="1 reserva" />
        <Legend color="amber" label="2-3 reservas" />
        <Legend color="red" label="4+ reservas" />
        <Legend color="muted" label="Bloqueado" />
      </div>
    </div>
  );
}

function Legend({
  color,
  label,
}: {
  color: "lime" | "amber" | "red" | "muted";
  label: string;
}) {
  const dotClass = {
    lime: "bg-lime/40",
    amber: "bg-warning/40",
    red: "bg-destructive/40",
    muted: "bg-destructive/10 border border-destructive/30",
  }[color];

  return (
    <div className="flex items-center gap-2">
      <div className={`size-3 rounded ${dotClass}`} />
      <span>{label}</span>
    </div>
  );
}
