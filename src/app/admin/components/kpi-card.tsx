import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
  accent?: boolean;
}

export function KpiCard({ label, value, hint, icon: Icon, accent }: Props) {
  return (
    <div
      className={cn(
        "rounded-3xl border p-6 transition-colors",
        accent
          ? "border-lime/30 bg-lime/5 shadow-soft-md"
          : "border-ink-800 bg-white shadow-soft-sm"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-4">
        <span className="text-xs uppercase tracking-wider text-ink-500">
          {label}
        </span>
        {Icon && (
          <div
            className={cn(
              "size-8 rounded-xl flex items-center justify-center shrink-0",
              accent
                ? "bg-lime/10 border border-lime/20"
                : "bg-muted border border-ink-800"
            )}
          >
            <Icon
              className={cn("size-4", accent ? "text-lime" : "text-ink-500")}
            />
          </div>
        )}
      </div>

      <div
        className={cn(
          "text-3xl font-semibold tabular-nums",
          accent ? "text-lime" : "text-foreground"
        )}
      >
        {value}
      </div>

      {hint && <p className="text-xs text-ink-500 mt-2">{hint}</p>}
    </div>
  );
}
