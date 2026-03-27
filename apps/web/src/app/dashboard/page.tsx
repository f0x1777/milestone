import { cookies } from "next/headers";
import Link from "next/link";
import { ArrowRight, CheckCircle2, LogOut, PauseCircle, Sparkles } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { SectionHeading } from "@/components/section-heading";
import { StatCard } from "@/components/stat-card";
import { parseMockSession } from "@/lib/mock-auth";
import { auditTrail, delegatedGithubWorkflow, grants } from "@/lib/mock-data";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const session = parseMockSession(cookieStore.get("milestone_session")?.value);

  return (
    <SiteShell>
      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-halo backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-brand-200/70">
                Dashboard
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                Milestone control room
              </h1>
            </div>
            <div className="rounded-full border border-brand-300/20 bg-brand-400/10 px-4 py-2 text-sm text-brand-100">
              {session ? `${session.name} · ${session.role}` : "Guest"}
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Active grants" value="2" hint="One live, one under review." accent />
            <StatCard label="Escrowed" value="12,500 XLM" hint="Testnet vault balance." />
            <StatCard label="Pending release" value="3,500 XLM" hint="Awaiting reviewer decision." />
            <StatCard label="Open flags" value="1" hint="Pause path available now." />
          </div>

          <div className="mt-6 grid gap-4">
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-white">Ready for the next iteration</p>
                  <p className="mt-2 text-sm text-white/60">
                    Wallet SDK integration, Supabase persistence and Soroban
                    contract calls will replace these mock states.
                  </p>
                </div>
                <Link
                  href="/auth"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:border-brand-300/30 hover:bg-white/10"
                >
                  Reauth
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-halo backdrop-blur-xl">
          <SectionHeading
            eyebrow="Actions"
            title="Mock operators are already in place"
            description="The UI keeps the sponsor/reviewer flow visible even before the contract is connected."
          />
          <div className="mt-6 space-y-3">
            {[
              { icon: CheckCircle2, title: "Create grant", detail: "Sponsor definitions and metadata." },
              { icon: Sparkles, title: "Attach evidence", detail: "GitHub and demo links arrive later." },
              { icon: PauseCircle, title: "Pause / resume", detail: "Reviewer override path." }
            ].map(({ icon: Icon, title, detail }) => (
              <div key={title} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950/55 p-4">
                <div className="rounded-xl bg-brand-400/10 p-2 text-brand-100 ring-1 ring-brand-400/20">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-white">{title}</p>
                  <p className="mt-1 text-sm text-white/60">{detail}</p>
                </div>
              </div>
            ))}
          </div>

          <form action="/api/mock-auth/logout" method="post" className="mt-6">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-brand-300/30 hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </form>
        </div>
      </section>

      <section className="mt-14 grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-halo backdrop-blur-xl">
          <SectionHeading
            eyebrow="Grants"
            title="The tracked grants mirror the product model"
            description="These are the entities the database and contract should converge on."
          />
          <div className="mt-6 space-y-4">
            {grants.map((grant) => (
              <div key={grant.title} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">{grant.title}</p>
                    <p className="mt-1 text-sm text-white/60">{grant.beneficiary}</p>
                  </div>
                  <p className="text-sm text-brand-100">{grant.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-halo backdrop-blur-xl">
          <SectionHeading
            eyebrow="Audit trail"
            title="The board keeps decisions visible"
            description="Hashes, evidence and release events are meant to survive the next implementation step."
          />
          <div className="mt-6 grid gap-3">
            {auditTrail.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="font-medium text-white">{item.label}</p>
                <p className="mt-1 text-sm text-white/60">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-14 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-halo backdrop-blur-xl">
        <SectionHeading
          eyebrow="Delegated GitHub flow"
          title="Repository access is designed as an operational delegation"
          description="This keeps Milestone aligned with a future delegated test account without forcing direct repo write access."
        />
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {delegatedGithubWorkflow.map((step) => (
            <div key={step.title} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <p className="font-medium text-white">{step.title}</p>
              <p className="mt-2 text-sm text-white/60">{step.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
