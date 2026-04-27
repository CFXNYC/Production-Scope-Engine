import { useMemo, useState, type ReactNode } from "react";
import { Activity, Clock, Gauge, ShieldAlert, TimerReset } from "lucide-react";
import { AssetThumbnailPanel } from "./components/AssetThumbnailPanel";
import { HourBreakdown } from "./components/HourBreakdown";
import { HistoricalMatchPanel } from "./components/HistoricalMatchPanel";
import { ProjectIntakeForm } from "./components/ProjectIntakeForm";
import { ProductionCalendarPanel } from "./components/ProductionCalendarPanel";
import { QueueStatusPanel } from "./components/QueueStatusPanel";
import { RiskFlagPanel } from "./components/RiskFlagPanel";
import { ScopeSummary } from "./components/ScopeSummary";
import { ScoreCard } from "./components/ScoreCard";
import { TimelineBreakdown } from "./components/TimelineBreakdown";
import {
  calculateComplexity,
  calculateHistoricalMatches,
  calculateHours,
  calculateRiskFlags,
  calculateTimeline,
} from "./utils/calculations";
import type { ComplexityTier, ProjectInput, RiskLevel } from "./types";

const today = new Date();
const defaultStartDate = today.toISOString().slice(0, 10);
const defaultDeadline = new Date(today.getTime() + 14 * 86_400_000).toISOString().slice(0, 10);

const defaultInput: ProjectInput = {
  projectName: "EFTI Coach Enablement Series",
  projectOwner: "Production Lead",
  requestingTeam: "Learning & Development",
  projectStartDate: defaultStartDate,
  projectDeadline: defaultDeadline,
  assetType: "Role-play: Coach to Client",
  assetCount: 4,
  runtimeLength: 8,
  productionEnvironment: "Studio / controlled",
  stakeholderComplexity: "Cross-functional",
  revisionExpectation: 2,
  aiVfxComplexity: "Light",
  travelLocationCoordination: "Local",
  executiveVisibility: false,
  deadlineUrgency: "Standard",
  riskTriggers: [],
  finalAssetListStatus: "Draft",
  scriptStatus: "Draft",
};

const tierAccent: Record<ComplexityTier, "clear" | "attention" | "elevated" | "critical" | "neutral"> = {
  Simple: "clear",
  Standard: "clear",
  Premium: "attention",
  Cinematic: "elevated",
  Enterprise: "critical",
};

const riskAccent: Record<RiskLevel, "clear" | "attention" | "elevated" | "critical"> = {
  Low: "clear",
  Moderate: "attention",
  High: "elevated",
  Critical: "critical",
};

export default function App() {
  const [input, setInput] = useState<ProjectInput>(defaultInput);

  const complexity = useMemo(() => calculateComplexity(input), [input]);
  const timeline = useMemo(() => calculateTimeline(input, complexity), [input, complexity]);
  const hours = useMemo(() => calculateHours(input, complexity), [input, complexity]);
  const risk = useMemo(() => calculateRiskFlags(input, timeline), [input, timeline]);
  const matches = useMemo(() => calculateHistoricalMatches(input), [input]);

  return (
    <main className="min-h-screen bg-ink text-bone">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(45,212,127,0.11),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.05),transparent_35%)]" />
      <div className="mx-auto max-w-[1520px] px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 border-b border-white/10 pb-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-clear">Prototype 01</p>
              <h1 className="mt-3 max-w-5xl text-4xl font-semibold tracking-normal text-bone md:text-6xl">
                Project Scope Intelligence Engine
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
                Converts production intake variables into complexity, timeline, labor, historical match, and risk planning
                outputs using editable local formulas.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-5 xl:min-w-[700px]">
              <MiniMetric icon={<Gauge size={16} />} label="Complexity" value={`${complexity.score}/100`} />
              <MiniMetric icon={<TimerReset size={16} />} label="Timeline" value={`${timeline.estimatedDays}d`} />
              <MiniMetric icon={<Activity size={16} />} label="Window" value={timeline.availableWindowDays !== null ? `${timeline.availableWindowDays}d` : "TBD"} />
              <MiniMetric icon={<Clock size={16} />} label="Hours" value={`${hours.estimatedHours}h`} />
              <MiniMetric icon={<ShieldAlert size={16} />} label="Risk" value={risk.level} />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[520px_minmax(0,1fr)]">
          <ProjectIntakeForm value={input} onChange={setInput} onReset={() => setInput(defaultInput)} />

          <div className="space-y-6">
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
              <ScoreCard label="Complexity Score" value={complexity.score} detail={complexity.tier} accent={tierAccent[complexity.tier]}>
                <DriverList drivers={complexity.driverScores} />
              </ScoreCard>
              <ScoreCard
                label="Timeline Estimate"
                value={`${timeline.estimatedDays}d`}
                detail={timeline.compressed ? "Compressed" : "Standard"}
                accent={timeline.compressed ? "critical" : "attention"}
              >
                <p className="text-sm leading-6 text-muted">{timeline.notes.join(" ")}</p>
              </ScoreCard>
              <ScoreCard label="Hour Estimate" value={`${hours.estimatedHours}h`} detail="Labor" accent="clear">
                <p className="text-sm leading-6 text-muted">{hours.notes.join(" ")}</p>
              </ScoreCard>
              <ScoreCard label="Risk Score" value={risk.flags.length} detail={risk.level} accent={riskAccent[risk.level]}>
                <p className="text-sm leading-6 text-muted">Flags detected from deadline, location, script, asset list, executive, revision, and AI/VFX inputs.</p>
              </ScoreCard>
            </section>

            <section className="grid grid-cols-1 gap-4 2xl:grid-cols-[minmax(0,1fr)_390px]">
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <Panel title="Timeline Phase Breakdown" eyebrow="Estimate">
                  <TimelineBreakdown timeline={timeline} />
                </Panel>
                <Panel title="Phase Hour Breakdown" eyebrow="Labor">
                  <HourBreakdown hours={hours} />
                </Panel>
              </div>
              <QueueStatusPanel />
            </section>

            <ProductionCalendarPanel input={input} timeline={timeline} />

            <RiskFlagPanel level={risk.level} flags={risk.flags} />
            <AssetThumbnailPanel />
            <HistoricalMatchPanel matches={matches} />
            <ScopeSummary input={input} complexity={complexity} timeline={timeline} hours={hours} riskLevel={risk.level} />
          </div>
        </div>
      </div>
    </main>
  );
}

function MiniMetric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-panel/80 p-4">
      <div className="mb-3 flex items-center gap-2 text-muted">
        {icon}
        <span className="text-xs uppercase tracking-[0.14em]">{label}</span>
      </div>
      <div className="text-2xl font-semibold text-bone">{value}</div>
    </div>
  );
}

function Panel({ title, eyebrow, children }: { title: string; eyebrow: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-white/10 bg-panel/85 p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-muted">{eyebrow}</p>
      <h2 className="mb-5 mt-2 text-2xl font-semibold text-bone">{title}</h2>
      {children}
    </section>
  );
}

function DriverList({ drivers }: { drivers: Record<string, number> }) {
  const sortedDrivers = Object.entries(drivers).sort(([, a], [, b]) => b - a);

  return (
    <div className="space-y-2">
      {sortedDrivers.slice(0, 5).map(([driver, value]) => (
        <div key={driver}>
          <div className="mb-1 flex items-center justify-between text-xs text-muted">
            <span>{driver.replace(/([A-Z])/g, " $1")}</span>
            <span>{value}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-bone" style={{ width: `${Math.min(100, value * 5)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
