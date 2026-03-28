import { cn } from "@/lib/utils";

type StreamItem = {
  label: string;
  detail: string;
  meta?: string;
  tone?: "default" | "success" | "warning" | "muted";
};

type GrantDetailStreamProps = {
  items: StreamItem[];
};

const toneStyles: Record<NonNullable<StreamItem["tone"]>, string> = {
  default: "border-charcoal-100 bg-white text-charcoal-600",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  muted: "border-charcoal-100 bg-charcoal-50 text-charcoal-500"
};

export function GrantDetailStream({ items }: GrantDetailStreamProps) {
  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <div
          key={`${item.label}-${item.meta}`}
          className="rounded-2xl border border-charcoal-100 bg-white p-4 shadow-soft"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium text-charcoal-900">{item.label}</p>
              <p className="mt-1 text-sm text-charcoal-400">{item.detail}</p>
            </div>
            {item.meta ? (
              <span
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em]",
                  toneStyles[item.tone ?? "default"]
                )}
              >
                {item.meta}
              </span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
