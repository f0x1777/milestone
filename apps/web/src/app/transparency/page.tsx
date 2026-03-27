import { SiteShell } from "@/components/site-shell";
import { SectionHeading } from "@/components/section-heading";
import { delegatedGithubWorkflow, grants, milestones } from "@/lib/mock-data";
import { CheckCircle2, Fingerprint } from "lucide-react";

export default function TransparencyPage() {
  return (
    <SiteShell>
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-halo backdrop-blur-xl">
        <SectionHeading
          eyebrow="Public view"
          title="Transparency without login"
          description="This route is intentionally public and shows the sponsor-visible shape of Milestone."
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
            <div className="flex items-center gap-2 text-brand-100">
              <Fingerprint className="h-4 w-4" />
              Onchain summary
            </div>
            <div className="mt-5 space-y-4">
              {milestones.map((item) => (
                <div key={item.name} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-brand-200" />
                  <div>
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="mt-1 text-sm text-white/60">{item.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            {grants.map((grant) => (
              <div key={grant.title} className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-white">{grant.title}</p>
                    <p className="mt-1 text-sm text-white/60">{grant.beneficiary}</p>
                  </div>
                  <span className="rounded-full border border-brand-300/20 bg-brand-400/10 px-3 py-1 text-xs text-brand-100">
                    {grant.status}
                  </span>
                </div>
                <p className="mt-4 text-sm text-white/60">{grant.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-halo backdrop-blur-xl">
        <SectionHeading
          eyebrow="Evidence flow"
          title="Delegated repository access is already part of the operating model"
          description="GitHub automation comes later, but the workflow and public explanation are already shaped."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
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
