"use client";

import { useState, useTransition } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addReservationNote } from "@/server/actions/admin-reservation";

interface Props {
  reservationId: string;
}

export function NotesForm({ reservationId }: Props) {
  const [isPending, startTransition] = useTransition();
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    setError(null);
    startTransition(async () => {
      const result = await addReservationNote(reservationId, note);
      if (!result.ok) {
        setError(result.error || "Error");
        return;
      }
      setNote("");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Agregar nota interna (no visible para el cliente)..."
        rows={3}
        maxLength={1000}
        className="w-full rounded-2xl border border-ink-800 bg-background px-4 py-3 text-base sm:text-sm placeholder:text-ink-500 focus:outline-none focus:border-lime focus:ring-2 focus:ring-lime/20 resize-none transition-colors duration-200"
      />
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-ink-500">
          {note.length}/1000
        </span>
        <Button
          type="submit"
          size="sm"
          disabled={!note.trim() || isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Send className="size-3.5" />
              Agregar nota
            </>
          )}
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </form>
  );
}
