import { createFileRoute } from "@tanstack/react-router";
import { Controls, Disclaimer, Eyebrow, GapBar, Page } from "@/components/shell";
import { useScenario } from "@/lib/scenario-context";
import { aed, num } from "@/lib/scenario";

export const Route = createFileRoute("/analysis")({
  head: () => ({
    meta: [
      { title: "Workforce Analysis · Human Capital Intelligence" },
      { name: "description", content: "Edit scenario assumptions and inspect the calculation behind each workforce intervention." },
      { property: "og:title", content: "Workforce Analysis — Human Capital Intelligence" },
      { property: "og:description", content: "Transparent calculations for upskilling, recruitment and hybrid strategies." },
    ],
  }),
  component: Analysis,
});

function Analysis() {
  const { result } = useScenario();
  const { inputs: i } = result;
  return (
    <Page title="Workforce Analysis" crumb="Technology & AI">
      <Disclaimer />
      <h1 className="mt-5 font-display text-3xl font-light text-foreground">Scenario assumptions and calculations</h1>
      <p className="mt-2 text-sm text-muted-foreground">Every figure is derived from the inputs below. Edit any value to update the platform.</p>
      <div className="mt-8"><Controls /></div>
      <div className="mt-10"><GapBar /></div>
      <div className="mt-12">
        <Eyebrow>Calculation breakdown</Eyebrow>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              <th className="py-3 font-normal">Strategy</th>
              <th className="py-3 font-normal">Trained</th>
              <th className="py-3 font-normal">Recruited</th>
              <th className="py-3 font-normal">Formula</th>
              <th className="py-3 text-right font-normal">Cost</th>
              <th className="py-3 text-right font-normal">Remaining</th>
              <th className="py-3 text-right font-normal">Reduction</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {result.options.map((o) => (
              <tr key={o.key} className="border-b border-border">
                <td className="py-4 text-foreground">
                  {o.name}
                  {o.key === result.recommended.key && <span className="ml-2 text-[11px] text-primary-soft">Recommended</span>}
                </td>
                <td className="py-4 text-muted-foreground">{num(o.trained)}</td>
                <td className="py-4 text-muted-foreground">{num(o.recruited)}</td>
                <td className="py-4 text-xs text-muted-foreground">
                  {num(o.trained)} × {num(i.trainCost)} + {num(o.recruited)} × {num(i.recruitCost)}
                </td>
                <td className="py-4 text-right text-foreground">{aed(o.cost)}</td>
                <td className="py-4 text-right text-foreground">{num(o.remaining)}</td>
                <td className="py-4 text-right text-foreground">{Math.min(100, o.reductionPct).toFixed(0)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 text-xs text-muted-foreground">
          Skills gap = max(0, {num(i.required)} − {num(i.current)}) = {num(result.gap)}. Gap reduction = people covered ÷ original gap × 100.
        </p>
      </div>
    </Page>
  );
}
