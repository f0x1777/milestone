import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  accent = false
}: {
  label: string;
  value: string;
  hint: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-white/5 p-5 shadow-halo backdrop-blur-xl",
        accent && "border-brand-300/30 bg-brand-400/10"
      )}
    >
      <p className="text-xs uppercase tracking-[0.26em] text-white/45">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p>
      <p className="mt-2 text-sm text-white/64">{hint}</p>
    </div>
  );
}

