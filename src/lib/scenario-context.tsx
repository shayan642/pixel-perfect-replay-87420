import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { compute, DEFAULT_INPUTS, type Inputs, type Result } from "./scenario";

type Ctx = { inputs: Inputs; setInputs: (i: Inputs) => void; reset: () => void; result: Result };
const ScenarioCtx = createContext<Ctx | null>(null);

export function ScenarioProvider({ children }: { children: ReactNode }) {
  const [inputs, setInputs] = useState<Inputs>(DEFAULT_INPUTS);
  const result = useMemo(() => compute(inputs), [inputs]);
  return (
    <ScenarioCtx.Provider value={{ inputs, setInputs, reset: () => setInputs(DEFAULT_INPUTS), result }}>
      {children}
    </ScenarioCtx.Provider>
  );
}

export function useScenario() {
  const c = useContext(ScenarioCtx);
  if (!c) throw new Error("useScenario outside provider");
  return c;
}
