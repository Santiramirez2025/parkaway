import {
  CalendarDays,
  CircleDollarSign,
  TrendingUp,
  Hourglass,
  CheckCircle2,
  Activity,
  Wallet,
} from "lucide-react";
import { KpiCard } from "./components/kpi-card";
import { UpcomingList } from "./components/upcoming-list";
import {
  getDashboardStats,
  getUpcomingReservations,
} from "@/server/repositories/stats";
import { formatARS } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [stats, upcoming] = await Promise.all([
    getDashboardStats(),
    getUpcomingReservations(8),
  ]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Buenas, todo en orden
        </h1>
        <p className="text-ink-400 text-sm mt-1">
          Resumen de tu operación · {formatToday()}
        </p>
      </div>

      {/* Fila 1: KPIs principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          label="Hoy"
          value={`${stats.todayReservations}`}
          hint="reservas creadas"
          icon={Activity}
        />
        <KpiCard
          label="Esta semana"
          value={`${stats.weekReservations}`}
          hint="últimos 7 días"
          icon={CalendarDays}
        />
        <KpiCard
          label="Este mes"
          value={`${stats.monthReservations}`}
          hint="reservas totales"
          icon={TrendingUp}
        />
        <KpiCard
          label="Ingresos del mes"
          value={formatARS(stats.monthRevenue)}
          hint="solo aprobados"
          icon={Wallet}
          accent
        />
      </div>

      {/* Fila 2: Estado operativo */}
      <div>
        <h2 className="text-sm font-medium text-ink-400 mb-3 uppercase tracking-wider">
          Estado operativo
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard
            label="Esperando pago"
            value={`${stats.pendingPayment}`}
            icon={Hourglass}
          />
          <KpiCard
            label="Confirmadas"
            value={`${stats.confirmed}`}
            icon={CheckCircle2}
          />
          <KpiCard
            label="En curso"
            value={`${stats.inProgress}`}
            icon={Activity}
          />
          <KpiCard
            label="Conversión"
            value={`${stats.conversionRate}%`}
            hint="pagas vs creadas"
            icon={CircleDollarSign}
          />
        </div>
      </div>

      {/* Proximas reservas */}
      <div>
        <div className="flex items-end justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold">Próximas a operar</h2>
            <p className="text-xs text-ink-500 mt-1">
              Ordenadas por fecha de llegada a cochera
            </p>
          </div>
        </div>
        <UpcomingList reservations={upcoming} />
      </div>
    </div>
  );
}

function formatToday() {
  return new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
