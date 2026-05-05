"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      locale={es}
      showOutsideDays={showOutsideDays}
      className={cn("p-2", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "space-y-3",
        month_caption: "flex justify-center pt-1 relative items-center h-9",
        caption_label: "text-sm font-semibold text-foreground capitalize",
        nav: "absolute inset-x-0 top-0 flex justify-between items-center px-1 h-9",
        button_previous: cn(
          "size-8 inline-flex items-center justify-center rounded-full border border-ink-800 bg-white text-ink-500 hover:text-foreground hover:border-ink-700 transition-colors disabled:opacity-30 disabled:pointer-events-none"
        ),
        button_next: cn(
          "size-8 inline-flex items-center justify-center rounded-full border border-ink-800 bg-white text-ink-500 hover:text-foreground hover:border-ink-700 transition-colors disabled:opacity-30 disabled:pointer-events-none"
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday:
          "text-ink-500 rounded-md w-9 text-[11px] font-medium uppercase tracking-wider",
        week: "flex w-full mt-1",
        day: "relative size-9 p-0 text-sm",
        day_button: cn(
          "size-9 rounded-full inline-flex items-center justify-center font-medium text-foreground",
          "transition-colors hover:bg-lime/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime/40"
        ),
        today: "[&>button]:text-accent [&>button]:font-semibold",
        selected:
          "[&>button]:bg-lime [&>button]:text-white [&>button]:hover:bg-lime [&>button]:shadow-soft-sm",
        outside: "[&>button]:text-ink-500/40",
        disabled: "[&>button]:text-ink-500/30 [&>button]:pointer-events-none",
        hidden: "invisible",
        range_start: "[&>button]:bg-lime [&>button]:text-white [&>button]:rounded-full",
        range_end: "[&>button]:bg-lime [&>button]:text-white [&>button]:rounded-full",
        range_middle:
          "[&>button]:bg-lime/10 [&>button]:text-foreground [&>button]:rounded-none",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...rest }) => {
          if (orientation === "left") return <ChevronLeft className="size-4" {...rest} />;
          return <ChevronRight className="size-4" {...rest} />;
        },
      }}
      {...props}
    />
  );
}
