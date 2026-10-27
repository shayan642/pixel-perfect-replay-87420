export type Inputs = {
  current: number;
  required: number;
  maxUpskill: number;
  trainCost: number;
  recruitCost: number;
};

export const DEFAULT_INPUTS: Inputs = {
  current: 900,
  required: 1200,
  maxUpskill: 200,
  trainCost: 4000,
  recruitCost: 20000,
};

export type OptionKey = "upskill" | "recruit" | "hybrid";

export type Option = {
  key: OptionKey;
  name: string;
  trained: number;
  recruited: number;
  cost: number;
  covered: number;
  remaining: number;
  reductionPct: number;
};

const safe = (n: number) => (Number.isFinite(n) && n > 0 ? Math.floor(n) : 0);

export function sanitize(i: Inputs): Inputs {
  return {
    current: safe(i.current),
    required: safe(i.required),
    maxUpskill: safe(i.maxUpskill),
    trainCost: safe(i.trainCost),
    recruitCost: safe(i.recruitCost),
  };
}

export function compute(raw: Inputs) {
  const i = sanitize(raw);
  const gap = Math.max(0, i.required - i.current);
  const gapPct = i.required > 0 ? (gap / i.required) * 100 : 0;
  const make = (key: OptionKey, name: string, trained: number, recruited: number): Option => {
    const covered = trained + recruited;
    return {
      key,
      name,
      trained,
      recruited,
      cost: trained * i.trainCost + recruited * i.recruitCost,
      covered,
      remaining: Math.max(0, gap - covered),
      reductionPct: gap > 0 ? (covered / gap) * 100 : 100,
    };
  };
  const trainable = Math.min(i.maxUpskill, gap);
  const options: Option[] = [
    make("upskill", "Upskill", trainable, 0),
    make("recruit", "Recruit", 0, gap),
    make("hybrid", "Hybrid", trainable, gap - trainable),
  ];
  // Recommended: lowest-cost option that fully closes the gap; ties favour the simpler option.
  const closing = options.filter((o) => o.remaining === 0);
  const pool = closing.length ? closing : options;
  const recommended = pool.reduce((best, o) =>
    o.cost < best.cost || (o.cost === best.cost && o.reductionPct > best.reductionPct) ? o : best,
  );
  return { inputs: i, gap, gapPct, options, recommended };
}

export type Result = ReturnType<typeof compute>;

export const aed = (n: number) => `AED ${Math.round(n).toLocaleString("en-US")}`;
export const num = (n: number) => Math.round(n).toLocaleString("en-US");
