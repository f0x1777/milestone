import Link from "next/link";
import { ArrowRight, BadgeCheck, GitBranch, Shield, Sparkles } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { StatCard } from "@/components/stat-card";
import { SectionHeading } from "@/components/section-heading";
import { auditTrail, grants, milestones } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <SiteShell>
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div className="pt-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-300/20 bg-brand-400/10 px-3 py-1 text-xs font-medium text-brand-100">
            <Sparkles className="h-3.5 w-3.5" />
            Milestone on Stellar testnet
          </div>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
            Controlled grants that move by evidence, not by guesswork.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/68 sm:text-lg">
            Milestone turns sponsor capital into a verifiable release flow:
            deposit, evidence, decision, partial unlock and pause. The scaffold
            is ready for wallet auth, Supabase and Soroban.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 rounded-full bg-brand-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-brand-300"
            >
              Open auth
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-brand-300/30 hover:bg-white/10"
            >
              View dashboard
              <Shield className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-halo backdrop-blur-xl">
          <div className="rounded-[1.4rem] border border-white/10 bg-slate-950/70 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-white/85">Vault status</p>
              <span className="rounded-full border border-brand-300/20 bg-brand-400/10 px-3 py-1 text-xs text-brand-100">
                Testnet live
              </span>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <StatCard label="Total escrow" value="12,500 XLM" hint="Funds parked in the Milestone vault." accent />
              <StatCard label="Unlocked" value="28%" hint="Reviewer-approved partial releases." />
              <StatCard label="Evidence packs" value="4" hint="GitHub, docs, demo and notes." />
              <StatCard label="Risk flags" value="1 active" hint="Pause path ready for the next iteration." />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-halo backdrop-blur-xl">
          <SectionHeading
            eyebrow="Workflow"
            title="The grant flow stays explicit"
            description="This is the operating model that the contract and dashboard should preserve."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {milestones.map((item) => (
              <div key={item.name} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-white">{item.name}</p>
                  <span className="text-xs uppercase tracking-[0.2em] text-brand-200">{item.status}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-white/62">{item.summary}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-halo backdrop-blur-xl">
          <SectionHeading
            eyebrow="Audit"
            title="Everything leaves a trail"
            description="Decision hashes, evidence links and release events are all first-class records."
          />
          <div className="mt-6 space-y-4">
            {auditTrail.map((item) => (
              <div key={item.label} className="flex gap-3">
                <BadgeCheck className="mt-1 h-5 w-5 text-brand-200" />
                <div>
                  <p className="font-medium text-white">{item.label}</p>
                  <p className="mt-1 text-sm text-white/62">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-14 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-halo backdrop-blur-xl">
        <SectionHeading
          eyebrow="Portfolio"
          title="Milestone already has a shape for sponsors and reviewers"
          description="These cards mirror the entities the backend and contract will eventually manage."
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {grants.map((grant) => (
            <div key={grant.title} className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-white">{grant.title}</p>
                  <p className="mt-1 text-sm text-white/60">{grant.beneficiary}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-brand-100">{grant.amount}</p>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/45">{grant.status}</p>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/68">
                <span>{grant.release}</span>
                <span>{grant.note}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-4 border-t border-white/10 pt-8 text-sm text-white/52 sm:grid-cols-3">
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-brand-200" />
          Next.js App Router scaffold
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-brand-200" />
          Wallet and hardcoded auth placeholders
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand-200" />
          Styled for milestones, not generic portals
        </div>
      </section>
    </SiteShell>
  );
}
