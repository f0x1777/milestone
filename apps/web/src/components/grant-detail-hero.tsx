import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

type GrantDetailHeroProps = {
  title: string;
  slug: string;
  status: string;
  amount: string;
  released: string;
  sponsor: string;
  reviewer: string;
  beneficiary: string;
  summary: string;
  sourceLabel: string;
  contractAddress?: string | null;
};

export function GrantDetailHero({
  title,
  slug,
  status,
  amount,
  released,
  sponsor,
  reviewer,
  beneficiary,
  summary,
  sourceLabel,
  contractAddress
}: GrantDetailHeroProps) {
  const contractLabel = contractAddress ?? "Pending deploy";
  const contractHint = contractAddress
    ? "The grant is wired to the testnet contract."
    : "The grant is still waiting for Soroban deployment.";

  return (
    <section className="overflow-hidden rounded-[2rem] border border-charcoal-100 bg-white shadow-soft">
      <div className="grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="relative bg-gradient-to-br from-white via-white to-milestone-50/70 p-6 sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-grid-fade [background-size:40px_40px] opacity-25" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-milestone-200 bg-milestone-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-milestone-600">
              <Sparkles className="h-3.5 w-3.5" />
              Grant detail
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-charcoal-200 bg-white px-4 py-2 text-sm font-medium text-charcoal-600 transition hover:border-milestone-200 hover:text-milestone-600"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to dashboard
              </Link>
              <Link
                href="/transparency"
                className="inline-flex items-center gap-2 rounded-full border border-charcoal-200 bg-white px-4 py-2 text-sm font-medium text-charcoal-600 transition hover:border-milestone-200 hover:text-milestone-600"
              >
                Open transparency
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-charcoal-900 sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-charcoal-500 sm:text-lg">
              {summary}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                {status}
              </span>
              <span className="rounded-full border border-charcoal-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-charcoal-500">
                {slug}
              </span>
              <span className="text-sm text-charcoal-400">{sourceLabel}</span>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-charcoal-100 bg-white p-4 shadow-soft">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-charcoal-400">
                  Total amount
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-charcoal-900">
                  {amount}
                </p>
                <p className="mt-1 text-sm text-charcoal-400">
                  {released} already released
                </p>
              </div>
              <div className="rounded-2xl border border-charcoal-100 bg-white p-4 shadow-soft">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-charcoal-400">
                  Contract wiring
                </p>
                <p className="mt-2 break-all text-lg font-semibold tracking-tight text-charcoal-900">
                  {contractLabel}
                </p>
                <p className="mt-1 text-sm text-charcoal-400">
                  {contractHint}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-charcoal-100 bg-charcoal-50/60 p-6 sm:p-8 lg:border-l lg:border-t-0">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.26em] text-charcoal-400">
            <ShieldCheck className="h-4 w-4 text-milestone-500" />
            Grant brief
          </div>
          <dl className="mt-6 grid gap-4">
            <div className="rounded-2xl border border-charcoal-100 bg-white p-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-charcoal-400">
                Sponsor
              </dt>
              <dd className="mt-1 text-lg font-semibold text-charcoal-900">
                {sponsor}
              </dd>
            </div>
            <div className="rounded-2xl border border-charcoal-100 bg-white p-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-charcoal-400">
                Reviewer
              </dt>
              <dd className="mt-1 text-lg font-semibold text-charcoal-900">
                {reviewer}
              </dd>
            </div>
            <div className="rounded-2xl border border-charcoal-100 bg-white p-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-charcoal-400">
                Beneficiary
              </dt>
              <dd className="mt-1 text-lg font-semibold text-charcoal-900">
                {beneficiary}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
