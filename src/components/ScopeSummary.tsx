import type { ComplexityResult, HourResult, ProjectInput, RiskLevel, TimelineResult } from "../types";

interface ScopeSummaryProps {
  input: ProjectInput;
  complexity: ComplexityResult;
  timeline: TimelineResult;
  hours: HourResult;
  riskLevel: RiskLevel;
}

export function ScopeSummary({ input, complexity, timeline, hours, riskLevel }: ScopeSummaryProps) {
  const clientSummary = `${input.projectName || "This project"} is scoped as a ${complexity.tier.toLowerCase()} ${
    input.assetType
  } request with ${input.assetCount} final asset${input.assetCount === 1 ? "" : "s"}. Current planning estimate is ${
    timeline.estimatedDays
  } production days and ${hours.estimatedHours} labor hours between the planned start date and requested deadline, pending final inputs, approvals, and dependency confirmation.`;

  const internalSummary = `Planning model: complexity ${complexity.score}/100, ${riskLevel.toLowerCase()} risk, ${
    timeline.compressed ? "compressed timeline active" : "standard timeline"
  }. Start date ${formatDate(input.projectStartDate)} creates a ${
    timeline.availableWindowDays ?? "TBD"
  } day planning window against the deadline ${formatDate(input.projectDeadline)}. Watch script status (${input.scriptStatus}), final asset list (${input.finalAssetListStatus}), revision expectation (${
    input.revisionExpectation
  }), and production environment (${input.productionEnvironment}).`;

  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <SummaryBlock title="Client-Safe Scope Summary" copy={clientSummary} />
      <SummaryBlock title="Internal Planning Summary" copy={internalSummary} />
    </section>
  );
}

function formatDate(value: string) {
  if (!value) return "TBD";
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return "TBD";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function SummaryBlock({ title, copy }: { title: string; copy: string }) {
  return (
    <article className="rounded-lg border border-white/10 bg-panel/85 p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-muted">{title}</p>
      <p className="mt-4 text-base leading-7 text-bone">{copy}</p>
    </article>
  );
}
