import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ReservationsFilters } from "./components/reservations-filters";
import { ReservationsTable } from "./components/reservations-table";
import { Button } from "@/components/ui/button";
import { listReservations } from "@/server/repositories/reservation-admin";
import type { ReservationStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{
    status?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function ReservationsPage({ searchParams }: Props) {
  const params = await searchParams;

  const result = await listReservations({
    status: (params.status as ReservationStatus | "ALL") || "ALL",
    search: params.search,
    page: params.page ? parseInt(params.page) : 1,
    pageSize: 20,
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Reservas
          </h1>
          <p className="text-ink-400 text-sm mt-1">
            {result.total} {result.total === 1 ? "reserva" : "reservas"} en
            total
          </p>
        </div>
      </div>

      <ReservationsFilters />

      <ReservationsTable items={result.items} />

      {result.totalPages > 1 && (
        <Pagination
          page={result.page}
          totalPages={result.totalPages}
          searchParams={params}
        />
      )}
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  searchParams,
}: {
  page: number;
  totalPages: number;
  searchParams: { status?: string; search?: string };
}) {
  const buildUrl = (p: number) => {
    const params = new URLSearchParams();
    if (searchParams.status && searchParams.status !== "ALL")
      params.set("status", searchParams.status);
    if (searchParams.search) params.set("search", searchParams.search);
    if (p > 1) params.set("page", `${p}`);
    return `/admin/reservas${params.toString() ? `?${params.toString()}` : ""}`;
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-ink-500">
        Página {page} de {totalPages}
      </span>
      <div className="flex gap-2">
        {page > 1 ? (
          <Button asChild variant="secondary" size="sm">
            <Link href={buildUrl(page - 1)}>
              <ChevronLeft />
              Anterior
            </Link>
          </Button>
        ) : (
          <Button variant="secondary" size="sm" disabled>
            <ChevronLeft />
            Anterior
          </Button>
        )}
        {page < totalPages ? (
          <Button asChild variant="secondary" size="sm">
            <Link href={buildUrl(page + 1)}>
              Siguiente
              <ChevronRight />
            </Link>
          </Button>
        ) : (
          <Button variant="secondary" size="sm" disabled>
            Siguiente
            <ChevronRight />
          </Button>
        )}
      </div>
    </div>
  );
}
