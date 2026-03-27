import { BadgeCheck, CheckCircle2, Fingerprint } from "lucide-react";
import { getTransparencySnapshot } from "@/lib/grants";
import { SiteShell } from "@/components/site-shell";
import { SectionHeading } from "@/components/section-heading";

export const dynamic = "force-dynamic";

export default async function TransparencyPage() {
  const snapshot = await getTransparencySnapshot();

  return (
    <SiteShell>
      <section className="rounded-3xl border border-charcoal-100 bg-white p-6 shadow-card">
        <SectionHeading
          eyebrow="Public transparency"
          title="Open grant tracking — no login required"
          description={`Anyone can inspect how funds are allocated, what evidence has been submitted, and which releases have been approved. ${snapshot.sourceLabel}.`}
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-2xl border border-charcoal-100 bg-charcoal-50 p-5">
            <div className="flex items-center gap-2 font-medium text-milestone-500">
              <Fingerprint className="h-4 w-4" />
              Grant lifecycle status
            </div>
            <div className="mt-5 space-y-4">
              {snapshot.milestones.map((item) => (
                <div key={item.name} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-milestone-400" />
                  <div>
                    <p className="font-medium text-charcoal-800">{item.name}</p>
                    <p className="mt-1 text-sm text-charcoal-400">
                      {item.summary}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
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
                      {grant.beneficiary} · Sponsor: {grant.sponsor}
                    </p>
                  </div>
                  <span className="rounded-full border border-milestone-200 bg-milestone-50 px-3 py-1 text-xs font-semibold text-milestone-600">
                    {grant.status}
                  </span>
                </div>
                <p className="mt-4 text-sm text-charcoal-400">{grant.note}</p>
                <div className="mt-4 flex items-center justify-between rounded-xl border border-charcoal-100 bg-white px-4 py-3 text-sm text-charcoal-500">
                  <span>{grant.amount}</span>
                  <span>{grant.release}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-charcoal-100 bg-white p-6 shadow-card">
        <SectionHeading
          eyebrow="Activity timeline"
          title="Public record of grant decisions"
          description="Creation events, evidence submissions, reviewer decisions, and fund releases — all visible to the public."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {snapshot.auditTrail.map((item) => (
            <div
              key={`${item.label}-${item.createdAt ?? item.detail}`}
              className="rounded-xl border border-charcoal-100 bg-charcoal-50 p-4 transition-shadow hover:shadow-soft"
            >
              <div className="flex items-center gap-2 text-milestone-500">
                <BadgeCheck className="h-4 w-4" />
                <p className="font-medium text-charcoal-800">{item.label}</p>
              </div>
              <p className="mt-2 text-sm text-charcoal-400">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-charcoal-100 bg-white p-6 shadow-card">
        <SectionHeading
          eyebrow="Evidence verification"
          title="How evidence is collected and verified"
          description="Beneficiaries delegate repository access so Milestone can independently capture commits, test results, and deployment artifacts."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {snapshot.delegatedGithubWorkflow.map((step) => (
            <div
              key={step.title}
              className="rounded-2xl border border-charcoal-100 bg-charcoal-50 p-4 transition-shadow hover:shadow-soft"
            >
              <p className="font-medium text-charcoal-800">{step.title}</p>
              <p className="mt-2 text-sm text-charcoal-400">{step.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
