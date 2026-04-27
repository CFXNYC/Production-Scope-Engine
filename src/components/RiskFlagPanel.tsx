import type { RiskFlag, RiskLevel } from "../types";

const severityStyles: Record<RiskLevel, string> = {
  Low: "border-clear/40 bg-clear/10 text-clear",
  Moderate: "border-attention/40 bg-attention/10 text-attention",
  High: "border-elevated/40 bg-elevated/10 text-elevated",
  Critical: "border-critical/40 bg-critical/10 text-critical",
};

export function RiskFlagPanel({ level, flags }: { level: RiskLevel; flags: RiskFlag[] }) {
  return (
    <section className="rounded-lg border border-white/10 bg-panel/85 p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Risk Flags</p>
          <h2 className="mt-2 text-2xl font-semibold text-bone">{level} Risk</h2>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${severityStyles[level]}`}>{level}</span>
      </div>
      {flags.length === 0 ? (
        <p className="rounded-md border border-clear/30 bg-clear/10 p-4 text-sm text-clear">
          No major risk flags detected. Scope is clear enough for standard planning.
        </p>
      ) : (
        <div className="space-y-3">
          {flags.map((flag) => (
            <article key={flag.label} className="rounded-md border border-white/10 bg-black/20 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-semibold text-bone">{flag.label}</h3>
                <span className={`rounded-full border px-2.5 py-1 text-xs ${severityStyles[flag.severity]}`}>
                  {flag.severity}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted">{flag.planningNote}</p>
              <p className="mt-2 text-sm leading-6 text-bone">Mitigation: {flag.mitigation}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
