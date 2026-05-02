"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  year: number;
  month: number; // 1-12
}

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export function MonthNav({ year, month }: Props) {
  const router = useRouter();

  const navigate = (delta: number) => {
    let newMonth = month + delta;
    let newYear = year;
    if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    } else if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    }
    router.push(`/admin/calendario?year=${newYear}&month=${newMonth}`);
  };

  const goToday = () => {
    const now = new Date();
    router.push(`/admin/calendario?year=${now.getFullYear()}&month=${now.getMonth() + 1}`);
  };

  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <h2 className="text-xl sm:text-2xl font-semibold capitalize">
        {MONTH_NAMES[month - 1]} {year}
      </h2>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ChevronLeft className="size-4" />
        </Button>
        <Button variant="secondary" size="sm" onClick={goToday}>
          Hoy
        </Button>
        <Button variant="ghost" size="sm" onClick={() => navigate(1)}>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
