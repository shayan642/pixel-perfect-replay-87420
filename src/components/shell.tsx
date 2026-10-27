import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useScenario } from "@/lib/scenario-context";
import { aed, num, type Inputs, type Option } from "@/lib/scenario";

const NAV = [
  { to: "/", label: "Overview", icon: "M3 3h7v7H3zM14 3h7v4h-7zM14 11h7v10h-7zM3 14h7v7H3z" },
  { to: "/analysis", label: "Workforce Analysis", icon: "M4 20V10M10 20V4M16 20v-7M22 20H2" },
  { to: "/brief", label: "Decision Brief", icon: "M6 2h9l5 5v15H6zM14 2v6h6M9 13h8M9 17h6" },
  { to: "/expansion", label: "Future Expansion", icon: "M12 2v20M2 12h20M5 5l14 14M19 5L5 19" },
] as const;

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

export function Sidebar() {
  return (
    <aside className="no-print fixed inset-y-0 left-0 flex w-60 flex-col border-r border-border bg-sidebar">
      <div className="px-6 pt-8 pb-10">
        <div className="mb-3 h-px w-8 bg-sand" />
        <p className="text-[11px] font-medium leading-relaxed tracking-[0.22em] text-foreground">
          HUMAN CAPITAL
          <br />
          INTELLIGENCE
        </p>
        <p className="mt-2 text-[11px] tracking-wide text-muted-foreground">United Arab Emirates · Concept</p>
      </div>
      <nav className="flex flex-col gap-0.5 px-3">
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            activeOptions={{ exact: true }}
            className="nav-link"
            activeProps={{ "data-active": "true" }}
          >
            <Icon d={n.icon} />
            {n.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto border-t border-border px-6 py-6">
        <p className="text-[11px] tracking-[0.18em] text-sand">INNOVATION PROTOTYPE</p>
        <p className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-warning" />
          Synthetic data
        </p>
      </div>
    </aside>
  );
}

export function Page({ title, crumb, children }: { title: string; crumb: string; children: ReactNode }) {
  return (
    <div className="min-h-screen pl-60 print:pl-0">
      <header className="no-print sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-background/95 px-10 backdrop-blur">
        <div className="flex items-baseline gap-3">
          <span className="text-sm font-medium text-foreground">{title}</span>
          <span className="text-xs text-muted-foreground">Platform / {crumb}</span>
        </div>
        <span className="rounded-sm border border-border px-2.5 py-1 text-[11px] tracking-wide text-muted-foreground">
          Scenario · Technology &amp; AI
        </span>
      </header>
      <main className="mx-auto max-w-[1180px] px-10 py-10">{children}</main>
    </div>
  );
}

export function Disclaimer() {
  return (
    <p className="text-[10.5px] tracking-[0.16em] text-warning">
      SYNTHETIC DEMO DATA · ILLUSTRATIVE SCENARIO · NOT OFFICIAL UAE STATISTICS
    </p>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{children}</p>;
}

export function Kpis() {
  const { result } = useScenario();
  const items = [
    ["Qualified workforce", num(result.inputs.current), "people"],
    ["Projected requirement", num(result.inputs.required), "people"],
    ["Skills gap", num(result.gap), "people"],
    ["Gap relative to demand", result.gapPct.toFixed(0), "%"],
  ];
  return (
    <div className="grid grid-cols-4 border-y border-border">
      {items.map(([l, v, u], idx) => (
        <div key={l} className={`px-6 py-6 ${idx ? "border-l border-border" : "pl-0"}`}>
          <Eyebrow>{l}</Eyebrow>
          <p className={`mt-3 font-display text-4xl font-light tabular-nums ${idx === 2 ? "text-sand" : "text-foreground"}`}>
            {v}
            <span className="ml-1.5 text-sm text-muted-foreground">{u}</span>
          </p>
        </div>
      ))}
    </div>
  );
}

export function GapBar() {
  const { result } = useScenario();
  const { current, required } = result.inputs;
  const max = Math.max(current, required, 1);
  const cw = (Math.min(current, required) / max) * 100;
  const rw = (required / max) * 100;
  return (
    <div>
      <div className="mb-3 flex justify-between text-xs text-muted-foreground">
        <span>Current qualified workforce vs. projected demand</span>
        <span className="tabular-nums">{num(required)} required</span>
      </div>
      <div className="relative h-9 bg-panel">
        <div className="absolute inset-y-0 left-0 border border-dashed border-sand/60" style={{ width: `${rw}%` }} />
        <div className="absolute inset-y-0 left-0 bg-primary" style={{ width: `${cw}%` }} />
        {result.gap > 0 && (
          <div
            className="absolute inset-y-0 flex items-center justify-center text-[11px] tracking-wide text-sand"
            style={{ left: `${cw}%`, width: `${rw - cw}%` }}
          >
            Gap {num(result.gap)}
          </div>
        )}
      </div>
      <div className="mt-3 flex gap-6 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-2"><span className="h-2 w-3 bg-primary" />Qualified · {num(current)}</span>
        <span className="flex items-center gap-2"><span className="h-2 w-3 border border-dashed border-sand" />Projected requirement</span>
      </div>
    </div>
  );
}

const DESC: Record<string, (o: Option) => string> = {
  upskill: (o) => `Train up to ${num(o.trained)} existing employees.`,
  recruit: (o) => `Recruit ${num(o.recruited)} specialists.`,
  hybrid: (o) => `Upskill ${num(o.trained)} employees and recruit ${num(o.recruited)} specialists.`,
};
export const describe = (o: Option) => DESC[o.key](o);

export function Interventions() {
  const { result } = useScenario();
  return (
    <div className="grid grid-cols-3 gap-px border border-border bg-border">
      {result.options.map((o) => {
        const rec = o.key === result.recommended.key;
        return (
          <div key={o.key} className={`relative flex flex-col bg-card p-7 ${rec ? "rec-panel" : ""}`}>
            <div className="flex h-5 items-center justify-between">
              <h3 className="text-base font-medium text-foreground">{o.name}</h3>
              {rec && <span className="text-[10.5px] tracking-wide text-primary-soft">Recommended under current assumptions</span>}
            </div>
            <p className="mt-2 min-h-10 text-sm text-muted-foreground">{describe(o)}</p>
            <div className="mt-6 border-t border-border pt-5">
              <Eyebrow>Estimated cost</Eyebrow>
              <p className="mt-2 font-display text-2xl font-light tabular-nums text-foreground">{aed(o.cost)}</p>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <Eyebrow>Remaining gap</Eyebrow>
                <p className={`mt-1.5 text-lg tabular-nums ${o.remaining ? "text-warning" : "text-foreground"}`}>{num(o.remaining)}</p>
              </div>
              <div>
                <Eyebrow>Gap closed</Eyebrow>
                <p className="mt-1.5 text-lg tabular-nums text-foreground">{Math.min(100, o.reductionPct).toFixed(0)}%</p>
              </div>
            </div>
            <div className="mt-5 h-1 bg-panel">
              <div className={rec ? "h-full bg-primary" : "h-full bg-muted-foreground/50"} style={{ width: `${Math.min(100, o.reductionPct)}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

const FIELDS: { k: keyof Inputs; label: string; unit: string }[] = [
  { k: "current", label: "Current qualified workforce", unit: "people" },
  { k: "required", label: "Projected requirement", unit: "people" },
  { k: "maxUpskill", label: "Max. available for upskilling", unit: "people" },
  { k: "trainCost", label: "Training cost per employee", unit: "AED" },
  { k: "recruitCost", label: "Recruitment cost per specialist", unit: "AED" },
];

export function Controls() {
  const { inputs, setInputs, reset } = useScenario();
  return (
    <div className="border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <Eyebrow>Scenario assumptions</Eyebrow>
        <button onClick={reset} className="text-xs text-muted-foreground transition-colors hover:text-foreground">Reset</button>
      </div>
      <div className="grid grid-cols-5 divide-x divide-border">
        {FIELDS.map((f) => (
          <label key={f.k} className="block px-5 py-4">
            <span className="block text-[11px] text-muted-foreground">{f.label}</span>
            <span className="mt-2 flex items-baseline gap-1.5 border-b border-border focus-within:border-primary">
              <input
                type="number"
                min={0}
                step={1}
                value={inputs[f.k]}
                onChange={(e) => {
                  const v = e.target.value === "" ? 0 : Number(e.target.value);
                  setInputs({ ...inputs, [f.k]: Number.isFinite(v) ? Math.max(0, v) : 0 });
                }}
                className="w-full bg-transparent py-1 text-base tabular-nums text-foreground outline-none"
              />
              <span className="text-[11px] text-muted-foreground">{f.unit}</span>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
