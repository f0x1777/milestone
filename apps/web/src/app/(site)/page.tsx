import Link from "next/link";
import { BadgeCheck, GitBranch, Shield, Sparkles } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { SectionHeading } from "@/components/section-heading";
import { HeroSection } from "@/components/hero-section";
import { getTransparencySnapshot } from "@/lib/grants";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const snapshot = await getTransparencySnapshot();
  const totalEscrow = snapshot.grants.reduce((sum, grant) => {
    const amount = Number(grant.amount.split(" ")[0].replace(/,/g, ""));
    return sum + (Number.isFinite(amount) ? amount : 0);
  }, 0);
  const releasedGrants = snapshot.grants.filter(
    (grant) => grant.release !== "No releases yet"
  ).length;

  return (
    <div className="bg-white">
      <HeroSection />

      {/* Content sections below the fold */}
      <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        {/* Vault Status */}
        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="pt-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-milestone-200 bg-milestone-50 px-4 py-1.5 text-xs font-semibold text-milestone-600">
              <Sparkles className="h-3.5 w-3.5" />
              Milestone on Stellar testnet
            </div>
            <h2 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-charcoal-900 sm:text-5xl">
              Controlled grants that move by evidence, not by guesswork.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-charcoal-400 sm:text-lg">
              Milestone turns sponsor capital into a verifiable release flow:
              deposit, evidence, decision, partial unlock and pause. The current
              web layer now reads through the shared data layer and is ready to
              connect to live Supabase and Soroban state.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-charcoal-800 to-charcoal-950 px-6 py-3 text-sm font-semibold text-white shadow-cta-inset transition-all hover:from-charcoal-900 hover:to-black"
              >
                Open auth
                <Shield className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-charcoal-200 bg-white px-6 py-3 text-sm font-medium text-charcoal-700 shadow-soft transition hover:border-milestone-300 hover:bg-milestone-50"
              >
                View dashboard
                <Shield className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-charcoal-100 bg-white p-5 shadow-card">
            <div className="rounded-2xl border border-charcoal-100 bg-charcoal-50 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-charcoal-700">
                  Vault status
                </p>
                <span className="rounded-full border border-milestone-200 bg-milestone-50 px-3 py-1 text-xs font-semibold text-milestone-600">
                  Testnet live
                </span>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <StatCard
                  label="Total escrow"
                  value={`${new Intl.NumberFormat("en-US", {
                    maximumFractionDigits: 2,
                  }).format(totalEscrow)} XLM`}
                  hint="Current public grant commitments."
                  accent
                />
                <StatCard
                  label="Public grants"
                  value={String(snapshot.grants.length)}
                  hint="Currently visible on the transparency route."
                />
                <StatCard
                  label="Review windows"
                  value={String(snapshot.milestones.length)}
                  hint="Milestones currently attached to public grants."
                />
                <StatCard
                  label="Released grants"
                  value={String(releasedGrants)}
                  hint="Public grants with at least one release recorded."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Workflow & Audit */}
        <section className="mt-20 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl border border-charcoal-100 bg-white p-6 shadow-card">
            <SectionHeading
              eyebrow="Workflow"
              title="The grant flow stays explicit"
              description="This is the operating model that the contract and dashboard should preserve."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {snapshot.milestones.map((item) => (
                <div
                  key={item.name}
                  className="rounded-2xl border border-charcoal-100 bg-charcoal-50 p-4 transition-shadow hover:shadow-soft"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-charcoal-800">{item.name}</p>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-milestone-500">
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-charcoal-400">
                    {item.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-charcoal-100 bg-white p-6 shadow-card">
            <SectionHeading
              eyebrow="Audit"
              title="Everything leaves a trail"
              description="Decision hashes, evidence links and release events are all first-class records."
            />
            <div className="mt-6 space-y-4">
              {snapshot.auditTrail.map((item) => (
                <div key={item.label} className="flex gap-3">
                  <BadgeCheck className="mt-1 h-5 w-5 text-milestone-400" />
                  <div>
                    <p className="font-medium text-charcoal-800">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm text-charcoal-400">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio */}
        <section className="mt-20 rounded-3xl border border-charcoal-100 bg-white p-6 shadow-card">
          <SectionHeading
            eyebrow="Portfolio"
            title="Milestone already has a shape for sponsors and reviewers"
            description="These cards mirror the entities the backend and contract will eventually manage."
          />
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {snapshot.grants.map((grant) => (
              <div
                key={grant.id}
                className="rounded-2xl border border-charcoal-100 bg-charcoal-50 p-5 transition-shadow hover:shadow-soft"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-charcoal-900">
                      {grant.title}
                    </p>
                    <p className="mt-1 text-sm text-charcoal-400">
                      {grant.beneficiary}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-milestone-500">
                      {grant.amount}
                    </p>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-charcoal-300">
                      {grant.status}
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between rounded-xl border border-charcoal-100 bg-white px-4 py-3 text-sm text-charcoal-500">
                  <span>{grant.release}</span>
                  <span>{grant.note}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <section className="mt-20 grid gap-4 border-t border-charcoal-100 pt-8 text-sm text-charcoal-400 sm:grid-cols-3">
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-milestone-400" />
            Next.js App Router scaffold
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-milestone-400" />
            Wallet and hardcoded auth placeholders
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-milestone-400" />
            Styled for milestones, not generic portals
          </div>
        </section>
      </div>
    </div>
  );
}
