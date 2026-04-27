import type { TimelineResult } from "../types";

export function TimelineBreakdown({ timeline }: { timeline: TimelineResult }) {
  return (
    <div className="space-y-4">
      {timeline.phaseBreakdown.map((phase) => (
        <div key={phase.phase}>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-bone">{phase.phase}</span>
            <span className="text-muted">{phase.days} days</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-bone" style={{ width: `${phase.percent * 100}%` }} />
          </div>
        </div>
      ))}
      {timeline.compressed ? (
        <div className="rounded-md border border-critical/40 bg-critical/10 p-3 text-sm text-critical">
          Compressed Timeline Mode: reduced {timeline.compressionPercent}% from {timeline.originalEstimatedDays} days.
        </div>
      ) : null}
    </div>
  );
}
