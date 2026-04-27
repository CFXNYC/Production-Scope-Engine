import { CalendarDays, RotateCcw, Sparkles } from "lucide-react";
import { assetTypeOptions } from "../config/scopeEngineConfig";
import type { ProjectInput } from "../types";

interface ProjectIntakeFormProps {
  value: ProjectInput;
  onChange: (value: ProjectInput) => void;
  onReset: () => void;
}

const fieldClass =
  "mt-2 w-full rounded-md border border-white/10 bg-black/25 px-3 py-2.5 text-sm text-bone outline-none transition focus:border-clear/60 focus:ring-2 focus:ring-clear/10";
const labelClass = "text-xs font-medium uppercase tracking-[0.14em] text-muted";

const riskTriggerOptions = [
  "Short deadline",
  "Multiple uncoordinated locations",
  "Unclear script",
  "No final asset list",
  "Executive visibility",
  "High revision expectation",
  "AI / VFX uncertainty",
];

export function ProjectIntakeForm({ value, onChange, onReset }: ProjectIntakeFormProps) {
  const update = <K extends keyof ProjectInput>(key: K, next: ProjectInput[K]) => onChange({ ...value, [key]: next });

  const toggleRiskTrigger = (trigger: string) => {
    update(
      "riskTriggers",
      value.riskTriggers.includes(trigger)
        ? value.riskTriggers.filter((item) => item !== trigger)
        : [...value.riskTriggers, trigger],
    );
  };

  return (
    <section className="rounded-lg border border-white/10 bg-panel/90 p-5 lg:sticky lg:top-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Project Intake</p>
          <h2 className="mt-2 text-2xl font-semibold text-bone">Scope Inputs</h2>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 text-muted transition hover:border-white/25 hover:text-bone"
          aria-label="Reset form"
          title="Reset form"
        >
          <RotateCcw size={17} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label>
          <span className={labelClass}>Project Name</span>
          <input className={fieldClass} value={value.projectName} onChange={(event) => update("projectName", event.target.value)} />
        </label>
        <label>
          <span className={labelClass}>Project Owner</span>
          <input className={fieldClass} value={value.projectOwner} onChange={(event) => update("projectOwner", event.target.value)} />
        </label>
        <label>
          <span className={labelClass}>Requesting Team</span>
          <input
            className={fieldClass}
            value={value.requestingTeam}
            onChange={(event) => update("requestingTeam", event.target.value)}
          />
        </label>
        <label>
          <span className={labelClass}>Project Start Date</span>
          <div className="relative">
            <input
              type="date"
              className={`${fieldClass} pr-10`}
              value={value.projectStartDate}
              onChange={(event) => update("projectStartDate", event.target.value)}
            />
            <CalendarDays className="pointer-events-none absolute right-3 top-5 text-muted" size={16} />
          </div>
        </label>
        <label>
          <span className={labelClass}>Project Deadline</span>
          <div className="relative">
            <input
              type="date"
              className={`${fieldClass} pr-10`}
              value={value.projectDeadline}
              onChange={(event) => update("projectDeadline", event.target.value)}
            />
            <CalendarDays className="pointer-events-none absolute right-3 top-5 text-muted" size={16} />
          </div>
        </label>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4">
        <label>
          <span className={labelClass}>Asset Type</span>
          <select className={fieldClass} value={value.assetType} onChange={(event) => update("assetType", event.target.value as ProjectInput["assetType"])}>
            {assetTypeOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <label>
          <span className={labelClass}>Asset Count</span>
          <input
            type="number"
            min={1}
            className={fieldClass}
            value={value.assetCount}
            onChange={(event) => update("assetCount", Number(event.target.value))}
          />
        </label>
        <label>
          <span className={labelClass}>Runtime Length</span>
          <input
            type="number"
            min={1}
            className={fieldClass}
            value={value.runtimeLength}
            onChange={(event) => update("runtimeLength", Number(event.target.value))}
          />
        </label>
        <label>
          <span className={labelClass}>Revision Rounds</span>
          <input
            type="number"
            min={1}
            className={fieldClass}
            value={value.revisionExpectation}
            onChange={(event) => update("revisionExpectation", Number(event.target.value))}
          />
        </label>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Select label="Production Environment" value={value.productionEnvironment} onChange={(next) => update("productionEnvironment", next)} options={["Remote / async", "Studio / controlled", "Single location", "Multiple locations", "Uncoordinated locations"]} />
        <Select label="Stakeholder Complexity" value={value.stakeholderComplexity} onChange={(next) => update("stakeholderComplexity", next)} options={["Single approver", "Small review group", "Cross-functional", "Executive / multi-team"]} />
        <Select label="AI / VFX Complexity" value={value.aiVfxComplexity} onChange={(next) => update("aiVfxComplexity", next)} options={["None", "Light", "Moderate", "Advanced"]} />
        <Select label="Travel / Location" value={value.travelLocationCoordination} onChange={(next) => update("travelLocationCoordination", next)} options={["None", "Local", "Regional", "Multi-market"]} />
        <Select label="Deadline Urgency" value={value.deadlineUrgency} onChange={(next) => update("deadlineUrgency", next)} options={["Flexible", "Standard", "Needs attention", "Short deadline"]} />
        <Select label="Final Asset List" value={value.finalAssetListStatus} onChange={(next) => update("finalAssetListStatus", next)} options={["Final", "Draft", "Unknown"]} />
        <Select label="Script Status" value={value.scriptStatus} onChange={(next) => update("scriptStatus", next)} options={["Approved", "Draft", "Not started"]} />
        <label className="flex items-end">
          <span className="flex min-h-[42px] w-full items-center justify-between rounded-md border border-white/10 bg-black/20 px-3 py-2.5">
            <span className={labelClass}>Executive Visibility</span>
            <input
              type="checkbox"
              className="h-5 w-5 accent-clear"
              checked={value.executiveVisibility}
              onChange={(event) => update("executiveVisibility", event.target.checked)}
            />
          </span>
        </label>
      </div>

      <div className="mt-5">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles size={15} className="text-clear" />
          <span className={labelClass}>Manual Risk Triggers</span>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {riskTriggerOptions.map((trigger) => (
            <label key={trigger} className="flex items-center gap-2 rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-bone">
              <input
                type="checkbox"
                className="h-4 w-4 accent-clear"
                checked={value.riskTriggers.includes(trigger)}
                onChange={() => toggleRiskTrigger(trigger)}
              />
              {trigger}
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label>
      <span className={labelClass}>{label}</span>
      <select className={fieldClass} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
