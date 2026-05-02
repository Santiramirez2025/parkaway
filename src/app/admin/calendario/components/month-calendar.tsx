import Link from "next/link";
import { cn } from "@/lib/utils";

interface Reservation {
  id: string;
  code: string;
  customerName: string;
  vehiclePlate: string;
}

interface Day {
  date: Date;
  reservations: Reservation[];
  count: number;
}

interface BlockedDate {
  date: Date;
  reason: string | null;
}

interface Props {
  days: Day[];
  blocked: BlockedDate[];
  year: number;
  month: number; // 1-12
}

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export function MonthCalendar({ days, blocked, year, month }: Props) {
  // Calcular padding inicial: cuantos dias dejar en blanco antes del dia 1
  const firstDay = new Date(year, month - 1, 1);
  // getDay() devuelve 0=domingo, 1=lunes... convertimos a 0=lunes, 6=domingo
  const startPadding = (firstDay.getDay() + 6) % 7;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Set para lookup rapido de fechas bloqueadas
  const blockedSet = new Set(
    blocked.map((b) => new Date(b.date).toDateString())
  );
  const blockedReasons = new Map(
    blocked.map((b) => [new Date(b.date).toDateString(), b.reason])
  );

  return (
    <div className="rounded-3xl border border-ink-800 bg-white overflow-hidden shadow-soft-sm">
      {/* Header dias de la semana */}
      <div className="grid grid-cols-7 border-b border-ink-800 bg-ink-900">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="px-2 py-3 text-xs font-medium text-ink-400 text-center uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grilla de dias */}
      <div className="grid grid-cols-7">
        {/* Padding inicial */}
        {Array.from({ length: startPadding }).map((_, i) => (
          <div
            key={`pad-${i}`}
            className="border-r border-b border-ink-800 bg-ink-950/95 min-h-[110px]"
          />
        ))}

        {days.map((day) => {
          const isToday = day.date.toDateString() === today.toDateString();
          const isBlocked = blockedSet.has(day.date.toDateString());
          const reason = blockedReasons.get(day.date.toDateString());
          const occupancy = getOccupancyLevel(day.count);

          return (
            <div
              key={day.date.toISOString()}
              className={cn(
                "border-r border-b border-ink-800 p-2 min-h-[110px] transition-colors",
                isBlocked && "bg-destructive/5",
                isToday && "ring-1 ring-lime/40 ring-inset"
              )}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={cn(
                    "text-xs font-medium",
                    isToday && "text-lime",
                    !isToday && "text-ink-300"
                  )}
                >
                  {day.date.getDate()}
                </span>
                {day.count > 0 && (
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded-md font-mono",
                      occupancy === "low" && "bg-lime/10 text-lime",
                      occupancy === "med" && "bg-warning/10 text-warning",
                      occupancy === "high" && "bg-destructive/20 text-destructive"
                    )}
                  >
                    {day.count}
                  </span>
                )}
              </div>

              {isBlocked && (
                <div className="text-[10px] text-destructive font-medium mb-1 truncate">
                  Bloqueado{reason ? `: ${reason}` : ""}
                </div>
              )}

              <div className="space-y-1">
                {day.reservations.slice(0, 2).map((r) => (
                  <Link
                    key={r.id}
                    href={`/admin/reservas/${r.id}`}
                    className="block text-[10px] px-1.5 py-1 rounded-md bg-lime/5 border border-lime/20 text-foreground hover:bg-lime/10 transition-colors truncate"
                  >
                    <span className="font-mono text-lime">{r.code}</span>
                    <br />
                    <span className="text-ink-400">{r.customerName.split(" ")[0]}</span>
                  </Link>
                ))}
                {day.reservations.length > 2 && (
                  <div className="text-[10px] text-ink-500 px-1.5">
                    +{day.reservations.length - 2} más
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getOccupancyLevel(count: number): "low" | "med" | "high" {
  if (count <= 1) return "low";
  if (count <= 3) return "med";
  return "high";
}
