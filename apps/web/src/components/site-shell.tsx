import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function SiteShell({
  children,
  compact = false
}: {
  children: ReactNode;
  compact?: boolean;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(15,163,127,0.22),_transparent_35%),linear-gradient(180deg,#071713_0%,#09110f_45%,#050807_100%)] text-white">
      <div className="pointer-events-none absolute inset-0 z-0 bg-grid-fade [background-size:42px_42px] opacity-[0.14]" />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="mb-8 flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-400/15 text-brand-200 ring-1 ring-brand-400/25">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.24em] text-brand-100 uppercase">
                Milestone
              </p>
              <p className="text-xs text-white/55">Programmatic grants on Stellar</p>
            </div>
          </Link>
          <nav className="flex items-center gap-2 text-sm text-white/75">
            <Link className="rounded-full px-3 py-2 transition hover:bg-white/8 hover:text-white" href="/transparency">
              Transparency
            </Link>
            <Link
              className={cn(
                "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 font-medium text-white transition hover:border-brand-300/40 hover:bg-brand-400/12",
                compact && "hidden sm:inline-flex"
              )}
              href="/dashboard"
            >
              Open dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
