import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  accent = false,
}: {
  label: string;
  value: string;
  hint: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-charcoal-100 bg-white p-5 shadow-soft transition-shadow hover:shadow-card",
        accent && "border-milestone-200 bg-milestone-50"
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-charcoal-400">
        {label}
      </p>
      <p
        className={cn(
          "mt-3 text-3xl font-semibold tracking-tight text-charcoal-900",
          accent && "text-milestone-600"
        )}
      >
        {value}
      </p>
      <p className="mt-2 text-sm text-charcoal-400">{hint}</p>
    </div>
  );
}
