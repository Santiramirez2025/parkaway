import {
  Activity,
  StickyNote,
  MessageSquare,
  CreditCard,
  Circle,
} from "lucide-react";

interface Event {
  id: string;
  type: string;
  description: string;
  createdAt: Date;
}

interface Props {
  events: Event[];
}

const ICON_BY_TYPE: Record<string, typeof Activity> = {
  STATUS_CHANGE: Activity,
  NOTE: StickyNote,
  NOTIFICATION_SENT: MessageSquare,
  PAYMENT_UPDATE: CreditCard,
};

export function EventsTimeline({ events }: Props) {
  if (events.length === 0) {
    return (
      <div className="text-sm text-ink-500 text-center py-6">
        Sin eventos registrados todavía.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((e, i) => {
        const Icon = ICON_BY_TYPE[e.type] || Circle;
        return (
          <div key={e.id} className="flex gap-3">
            <div className="flex flex-col items-center shrink-0">
              <div className="size-8 rounded-full bg-ink-900 border border-ink-800 flex items-center justify-center">
                <Icon className="size-3.5 text-ink-400" />
              </div>
              {i < events.length - 1 && (
                <div className="w-px flex-1 bg-ink-800 mt-2" />
              )}
            </div>
            <div className="flex-1 pb-4 min-w-0">
              <p className="text-sm text-foreground break-words">
                {e.description}
              </p>
              <p className="text-xs text-ink-500 mt-1">
                {formatDateTime(e.createdAt)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function formatDateTime(d: Date) {
  return new Date(d).toLocaleString("es-AR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
