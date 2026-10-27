import { createFileRoute } from "@tanstack/react-router";
import { Eyebrow, Page } from "@/components/shell";

export const Route = createFileRoute("/expansion")({
  head: () => ({
    meta: [
      { title: "Future Expansion · Human Capital Intelligence" },
      { name: "description", content: "Planned sector expansion for the Human Capital Intelligence platform." },
      { property: "og:title", content: "Future Expansion — Human Capital Intelligence" },
      { property: "og:description", content: "Finance, Healthcare and Education are planned future sectors." },
    ],
  }),
  component: Expansion,
});

const SECTORS = [
  ["Technology & AI", "Active in this prototype", true],
  ["Finance", "Planned expansion", false],
  ["Healthcare", "Planned expansion", false],
  ["Education", "Planned expansion", false],
] as const;

function Expansion() {
  return (
    <Page title="Future Expansion" crumb="Sectors">
      <h1 className="font-display text-3xl font-light text-foreground">A national, cross-sector platform</h1>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        The same scenario method can extend to further sectors once validated data and sector owners are in place.
      </p>
      <div className="mt-10 border-t border-border">
        {SECTORS.map(([name, status, active]) => (
          <div key={name} className="flex items-center justify-between border-b border-border py-5">
            <span className={active ? "text-foreground" : "text-muted-foreground"}>{name}</span>
            <span className={`text-[11px] tracking-[0.14em] uppercase ${active ? "text-primary-soft" : "text-sand"}`}>{status}</span>
          </div>
        ))}
      </div>
      <div className="mt-8"><Eyebrow>Planned sectors are not functioning modules and contain no data.</Eyebrow></div>
    </Page>
  );
}
