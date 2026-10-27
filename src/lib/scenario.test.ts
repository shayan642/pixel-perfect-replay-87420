import { describe, it, expect } from "vitest";
import { compute, DEFAULT_INPUTS } from "./scenario";

describe("scenario", () => {
  const r = compute(DEFAULT_INPUTS);
  const find = (k: string) => r.options.find((x) => x.key === k)!;
  const o = { upskill: find("upskill"), recruit: find("recruit"), hybrid: find("hybrid") };
  it("gap is 300 (25%)", () => {
    expect(r.gap).toBe(300);
    expect(r.gapPct).toBe(25);
  });
  it("upskill costs 800k, leaves 100", () => {
    expect(o.upskill.cost).toBe(800000);
    expect(o.upskill.remaining).toBe(100);
  });
  it("recruit costs 6M, closes gap", () => {
    expect(o.recruit.cost).toBe(6000000);
    expect(o.recruit.remaining).toBe(0);
  });
  it("hybrid costs 2.8M and is recommended", () => {
    expect(o.hybrid.cost).toBe(2800000);
    expect(r.recommended.key).toBe("hybrid");
  });
  it("negative inputs clamp and gap never negative", () => {
    const z = compute({ ...DEFAULT_INPUTS, current: 2000, trainCost: -5 });
    expect(z.gap).toBe(0);
    expect(z.inputs.trainCost).toBe(0);
  });
});
