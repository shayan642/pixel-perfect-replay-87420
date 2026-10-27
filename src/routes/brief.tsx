import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Disclaimer, Page, describe } from "@/components/shell";
import { useScenario } from "@/lib/scenario-context";
import { aed, num } from "@/lib/scenario";

export const Route = createFileRoute("/brief")({
  head: () => ({
    meta: [
      { title: "Decision Brief · Human Capital Intelligence" },
      { name: "description", content: "Printable decision brief generated from the current workforce scenario." },
      { property: "og:title", content: "Decision Brief — Human Capital Intelligence" },
      { property: "og:description", content: "Recommended workforce strategy, rationale, risks and a 90-day plan." },
    ],
  }),
  component: Brief,
});

function Section({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <section className="grid grid-cols-[48px_1fr] border-t border-border py-7 print-break">
      <span className="text-xs tabular-nums text-sand">{n}</span>
      <div>
        <h2 className="text-base font-medium text-foreground">{title}</h2>
        <div className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
      </div>
    </section>
  );
}

function Brief() {
  const { result } = useScenario();
  const { inputs: i, gap, gapPct, options, recommended: rec } = result;
  const others = options.filter((o) => o.key !== rec.key);
  const recruit = options.find((o) => o.key === "recruit")!;
  const saving = recruit.cost - rec.cost;
  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <Page title="Decision Brief" crumb="Technology & AI">
      <div className="no-print mb-8 flex items-center justify-between">
        <Disclaimer />
        <button onClick={() => window.print()} className="btn-primary">Print / Save as PDF</button>
      </div>
      <article className="brief mx-auto max-w-[820px] border border-border bg-card px-14 py-12">
        <p className="text-[11px] tracking-[0.2em] text-sand">DECISION BRIEF · TECHNOLOGY &amp; AI</p>
        <h1 className="mt-4 font-display text-3xl font-light text-foreground">Closing the Technology &amp; AI skills gap</h1>
        <p className="mt-2 text-xs text-muted-foreground">Prepared {today} · Human Capital Intelligence · Innovation Prototype</p>
        <p className="mt-4 text-[10.5px] tracking-[0.14em] text-warning">SYNTHETIC DEMO DATA · ILLUSTRATIVE SCENARIO · NOT OFFICIAL UAE STATISTICS</p>

        <div className="mt-8">
          <Section n="01" title="Workforce planning question">
            <p>What is the most cost-effective way to meet projected demand for Technology &amp; AI skills under current assumptions?</p>
          </Section>
          <Section n="02" title="Capacity, demand and gap">
            <div className="grid grid-cols-3 gap-6 pt-1">
              {[["Qualified workforce", num(i.current)], ["Projected requirement", num(i.required)], ["Skills gap", `${num(gap)} · ${gapPct.toFixed(0)}%`]].map(([l, v]) => (
                <div key={l}><p className="text-[11px] uppercase tracking-[0.14em]">{l}</p><p className="mt-1 text-xl font-light tabular-nums text-foreground">{v}</p></div>
              ))}
            </div>
          </Section>
          <Section n="03" title="Intervention comparison">
            <table className="w-full text-sm tabular-nums">
              <thead><tr className="border-b border-border text-left text-[11px] uppercase tracking-[0.12em]"><th className="py-2 font-normal">Strategy</th><th className="py-2 font-normal">Approach</th><th className="py-2 text-right font-normal">Cost</th><th className="py-2 text-right font-normal">Remaining gap</th></tr></thead>
              <tbody>
                {options.map((o) => (
                  <tr key={o.key} className="border-b border-border last:border-0">
                    <td className={`py-2.5 ${o.key === rec.key ? "text-primary-soft" : "text-foreground"}`}>{o.name}</td>
                    <td className="py-2.5">{describe(o)}</td>
                    <td className="py-2.5 text-right text-foreground">{aed(o.cost)}</td>
                    <td className="py-2.5 text-right text-foreground">{num(o.remaining)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
          <Section n="04" title="Recommended strategy">
            <p className="text-foreground">
              {rec.name}: {describe(rec)} Estimated cost {aed(rec.cost)}, leaving a remaining gap of {num(rec.remaining)}.
            </p>
          </Section>
          <Section n="05" title="Rationale and trade-offs">
            {gap === 0 ? (
              <p>Current capacity meets projected demand; no intervention is required under these assumptions.</p>
            ) : (
              <>
                <p>{rec.name} is the lowest-cost option that {rec.remaining === 0 ? "fully closes the gap" : "reduces the gap most"} under current assumptions.</p>
                {rec.key !== "recruit" && saving > 0 && <p>It costs {aed(saving)} less than recruitment alone.</p>}
                {others.map((o) => (
                  <p key={o.key}>{o.name}: {aed(o.cost)}{o.remaining > 0 ? `, but leaves ${num(o.remaining)} positions unfilled` : ""}.</p>
                ))}
                <p>Upskilling depends on employee availability, training completion and time-to-competency; recruitment depends on market supply of specialists.</p>
              </>
            )}
          </Section>
          <Section n="06" title="Assumptions, risks and data limitations">
            <p>Training cost AED {num(i.trainCost)} per employee; recruitment cost AED {num(i.recruitCost)} per specialist; up to {num(i.maxUpskill)} employees available for upskilling.</p>
            <p>All values are synthetic and illustrative. Projected demand, training success rates and recruitment lead times have not been validated.</p>
            <p>Costs exclude salaries, attrition, productivity loss during training and onboarding time.</p>
          </Section>
          <Section n="07" title="90-day plan">
            <ol className="space-y-2">
              <li><span className="text-foreground">Days 1–30 · Validate demand.</span> Confirm projected requirement and current capability with sector entities.</li>
              <li><span className="text-foreground">Days 31–60 · Pilot.</span> Run a small-scale pilot of the {rec.name.toLowerCase()} strategy.</li>
              <li><span className="text-foreground">Days 61–90 · Evaluate.</span> Assess cost, completion and placement outcomes before considering wider implementation.</li>
            </ol>
          </Section>
        </div>
      </article>
    </Page>
  );
}
