"use client";

import { useState, useTransition } from "react";
import { CalendarX, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { unblockDate } from "@/server/actions/blocked-dates";

interface BlockedDate {
  id: string;
  date: Date;
  reason: string | null;
}

interface Props {
  items: BlockedDate[];
}

export function BlockedList({ items }: Props) {
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setDeletingId(id);
    startTransition(async () => {
      await unblockDate(id);
      setDeletingId(null);
    });
  };

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-ink-800 bg-white p-12 text-center">
        <CalendarX className="size-8 text-ink-600 mx-auto mb-3" />
        <div className="text-sm text-ink-400">No hay fechas bloqueadas.</div>
        <div className="text-xs text-ink-600 mt-1">
          Bloquea fechas cuando la cochera no este disponible.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-ink-800 bg-white overflow-hidden divide-y divide-ink-800">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between gap-3 p-4 hover:bg-white transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-9 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center shrink-0">
              <CalendarX className="size-4 text-destructive" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium">{formatDate(item.date)}</div>
              {item.reason && (
                <div className="text-xs text-ink-500 mt-0.5 truncate">
                  {item.reason}
                </div>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(item.id)}
            disabled={isPending && deletingId === item.id}
            className="text-ink-500 hover:text-destructive"
          >
            {isPending && deletingId === item.id ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
          </Button>
        </div>
      ))}
    </div>
  );
}

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
