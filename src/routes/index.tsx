import { createFileRoute, Link } from "@tanstack/react-router";
import { Controls, Disclaimer, GapBar, Interventions, Kpis, Page } from "@/components/shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview · Human Capital Intelligence" },
      { name: "description", content: "Workforce skills gap and intervention analysis for Technology & AI — synthetic demo scenario." },
      { property: "og:title", content: "Human Capital Intelligence — Overview" },
      { property: "og:description", content: "From skills gaps to workforce decisions." },
    ],
  }),
  component: Overview,
});

function Overview() {
  return (
    <Page title="Overview" crumb="Technology & AI">
      <Disclaimer />
      <h1 className="mt-5 font-display text-[40px] font-light leading-tight tracking-tight text-foreground">
        From Skills Gaps to Workforce Decisions
      </h1>
      <p className="mt-3 text-[15px] text-muted-foreground">
        Evidence-informed workforce planning through transparent scenario analysis.
      </p>
      <div className="mt-10"><Kpis /></div>
      <div className="mt-10"><GapBar /></div>
      <section className="mt-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-normal text-foreground">Intervention Analysis</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">Compare the estimated cost and impact of alternative workforce strategies.</p>
          </div>
          <Link to="/brief" className="btn-primary">Generate Decision Brief</Link>
        </div>
        <Interventions />
      </section>
      <section className="mt-10"><Controls /></section>
    </Page>
  );
}
