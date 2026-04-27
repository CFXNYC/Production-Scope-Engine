import type { HourResult } from "../types";

export function HourBreakdown({ hours }: { hours: HourResult }) {
  return (
    <div className="space-y-4">
      {hours.phaseBreakdown.map((phase) => (
        <div key={phase.phase}>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-bone">{phase.phase}</span>
            <span className="text-muted">{phase.hours} hrs</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-clear" style={{ width: `${phase.percent * 100}%` }} />
          </div>
        </div>
      ))}
      <p className="text-xs leading-5 text-muted">
        Base modeled hours: {hours.baseHours}. Risk +{Math.round(hours.riskMultiplier * 100)}%, revisions +
        {Math.round(hours.revisionMultiplier * 100)}%.
      </p>
    </div>
  );
}
