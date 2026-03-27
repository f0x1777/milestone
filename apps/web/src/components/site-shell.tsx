import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MilestoneLogo } from "./milestone-logo";
import type { ReactNode } from "react";

export function SiteShell({
  children,
  compact = false,
}: {
  children: ReactNode;
  compact?: boolean;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-charcoal-900">
      <div className="pointer-events-none absolute inset-0 z-0 bg-grid-fade [background-size:48px_48px] opacity-40" />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="mb-8 flex items-center justify-between rounded-full border border-charcoal-100 bg-white/80 px-5 py-3 shadow-soft backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-3">
            <MilestoneLogo className="h-7 text-charcoal-800" />
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            <Link
              className="rounded-full px-4 py-2 font-medium text-charcoal-500 transition hover:bg-charcoal-50 hover:text-charcoal-800"
              href="/transparency"
            >
              Transparency
            </Link>
            <Link
              className={cn(
                "inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-charcoal-800 to-charcoal-950 px-5 py-2.5 font-medium text-white shadow-cta-inset transition hover:from-charcoal-900 hover:to-black",
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
