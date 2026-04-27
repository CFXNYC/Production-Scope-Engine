import {
  complexityTiers,
  complexityWeights,
  historicalMatchWeights,
  hoursConfig,
  scoringScales,
  timelineConfig,
} from "../config/scopeEngineConfig";
import { historicalProjects } from "../data/historicalProjects";
import type {
  ComplexityResult,
  ComplexityTier,
  HistoricalProject,
  HourResult,
  MatchResult,
  MatchTier,
  ProjectInput,
  RiskFlag,
  RiskLevel,
  TimelineResult,
} from "../types";

const midpoint = ([min, max]: [number, number]) => Math.round((min + max) / 2);
const average = ([min, max]: [number, number]) => (min + max) / 2;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const round1 = (value: number) => Math.round(value * 10) / 10;

const getTier = (score: number): ComplexityTier =>
  complexityTiers.find((tier) => score >= tier.min && score <= tier.max)?.tier ?? "Enterprise";

const assetCountFactor = (count: number) => {
  if (count <= 2) return 0.2;
  if (count <= 5) return 0.45;
  if (count <= 10) return 0.75;
  return 1;
};

const runtimeFactor = (minutes: number) => {
  if (minutes <= 2) return 0.2;
  if (minutes <= 6) return 0.45;
  if (minutes <= 15) return 0.7;
  return 1;
};

const revisionFactor = (rounds: number) => {
  if (rounds <= 1) return 0.2;
  if (rounds === 2) return 0.45;
  if (rounds === 3) return 0.7;
  return 1;
};

export function calculateComplexity(input: ProjectInput): ComplexityResult {
  const driverFactors = {
    deadlineUrgency:
      scoringScales.deadlineUrgency[input.deadlineUrgency as keyof typeof scoringScales.deadlineUrgency] ?? 0.45,
    assetCount: assetCountFactor(input.assetCount),
    aiVfxComplexity:
      scoringScales.aiVfxComplexity[input.aiVfxComplexity as keyof typeof scoringScales.aiVfxComplexity] ?? 0,
    productionEnvironment:
      scoringScales.productionEnvironment[
        input.productionEnvironment as keyof typeof scoringScales.productionEnvironment
      ] ?? 0.35,
    stakeholderComplexity:
      scoringScales.stakeholderComplexity[
        input.stakeholderComplexity as keyof typeof scoringScales.stakeholderComplexity
      ] ?? 0.45,
    revisionExpectation: revisionFactor(input.revisionExpectation),
    runtimeLength: runtimeFactor(input.runtimeLength),
    executiveVisibility: input.executiveVisibility ? 1 : 0,
    travelLocationCoordination:
      scoringScales.travelLocationCoordination[
        input.travelLocationCoordination as keyof typeof scoringScales.travelLocationCoordination
      ] ?? 0,
  };

  const driverScores = Object.entries(complexityWeights).reduce<Record<string, number>>((scores, [driver, weight]) => {
    scores[driver] = round1((driverFactors[driver as keyof typeof driverFactors] ?? 0) * weight);
    return scores;
  }, {});

  const score = clamp(Math.round(Object.values(driverScores).reduce((sum, value) => sum + value, 0)), 0, 100);
  return { score, tier: getTier(score), driverScores };
}

export function calculateTimeline(input: ProjectInput, complexity: ComplexityResult): TimelineResult {
  const baseDays = midpoint(timelineConfig.baseDurationDays[complexity.tier]);
  const assetAdjustment = timelineConfig.assetLoadAdjustments.find(
    (rule) => input.assetCount >= rule.min && input.assetCount <= rule.max,
  )?.days ?? 0;

  const riskBuffer = Math.min(timelineConfig.riskBufferCap, getTimelineRiskBuffer(input));
  const originalEstimatedDays = baseDays + assetAdjustment + riskBuffer;
  const availableWindowDays = daysBetweenDates(input.projectStartDate, input.projectDeadline);
  const shouldCompress = availableWindowDays !== null && availableWindowDays < originalEstimatedDays;
  const compressionPercent = shouldCompress
    ? clamp((originalEstimatedDays - availableWindowDays) / originalEstimatedDays, 0, timelineConfig.maxCompressionPercent)
    : 0;
  const estimatedDays = Math.max(1, Math.round(originalEstimatedDays * (1 - compressionPercent)));

  const notes = [
    `${complexity.tier} base duration midpoint: ${baseDays} days.`,
    `Asset load adjustment: +${assetAdjustment} days.`,
    `Risk buffer applied: +${riskBuffer} days.`,
    availableWindowDays !== null
      ? `Available start-to-deadline window: ${availableWindowDays} days.`
      : "Start-to-deadline window unavailable.",
  ];

  if (shouldCompress) {
    notes.push("Compressed Timeline Mode active. Recommend scope reduction or additional resources.");
  }

  return {
    estimatedDays,
    originalEstimatedDays,
    availableWindowDays,
    compressed: shouldCompress,
    compressionPercent: round1(compressionPercent * 100),
    phaseBreakdown: Object.entries(timelineConfig.phaseDistribution).map(([phase, percent]) => ({
      phase,
      percent,
      days: round1(estimatedDays * percent),
    })),
    notes,
  };
}

export function calculateHours(input: ProjectInput, complexity: ComplexityResult): HourResult {
  const baseHours = midpoint(hoursConfig.baseHours[complexity.tier]);
  const assetAdjustmentRange = hoursConfig.assetCountAdjustments.find(
    (rule) => input.assetCount >= rule.min && input.assetCount <= rule.max,
  )?.hours ?? [0, 0];
  const assetAdjustment = midpoint(assetAdjustmentRange as [number, number]);
  const formatAdjustment = midpoint(hoursConfig.formatComplexityAdjustments[input.assetType]);
  const subtotal = baseHours + assetAdjustment + formatAdjustment;

  const riskMultiplier = getRiskMultiplier(input);
  const revisionMultiplier = getRevisionMultiplier(input.revisionExpectation);
  const estimatedHours = Math.round(subtotal * (1 + riskMultiplier) * (1 + revisionMultiplier));

  return {
    estimatedHours,
    baseHours: subtotal,
    riskMultiplier,
    revisionMultiplier,
    phaseBreakdown: Object.entries(hoursConfig.phaseDistribution).map(([phase, percent]) => ({
      phase,
      percent,
      hours: round1(estimatedHours * percent),
    })),
    notes: [
      `${complexity.tier} base hours midpoint: ${baseHours} hours.`,
      `Asset count adjustment midpoint: +${assetAdjustment} hours.`,
      `Format complexity adjustment midpoint: +${formatAdjustment} hours.`,
      `Risk multiplier: +${Math.round(riskMultiplier * 100)}%. Revision multiplier: +${Math.round(
        revisionMultiplier * 100,
      )}%.`,
    ],
  };
}

export function calculateRiskFlags(input: ProjectInput, timeline?: TimelineResult): { level: RiskLevel; flags: RiskFlag[] } {
  const flags: RiskFlag[] = [];
  const addFlag = (flag: RiskFlag) => flags.push(flag);

  if (timeline?.availableWindowDays !== null && timeline?.availableWindowDays !== undefined && timeline.availableWindowDays < 0) {
    addFlag({
      label: "Start date after deadline",
      severity: "Critical",
      planningNote: "The requested delivery date is earlier than the planned project start date.",
      mitigation: "Confirm dates before estimating or reset the deadline to a feasible delivery window.",
    });
  }

  if (input.deadlineUrgency === "Short deadline" || timeline?.compressed) {
    addFlag({
      label: timeline?.compressed ? "Compressed timeline" : "Short deadline",
      severity: "High",
      planningNote: "Timeline is likely to pressure review cycles and post-production quality control.",
      mitigation: "Reduce deliverables, lock approvals early, or add production/editing resources.",
    });
  }

  if (input.productionEnvironment === "Uncoordinated locations" || input.travelLocationCoordination === "Multi-market") {
    addFlag({
      label: "Multiple uncoordinated locations",
      severity: "High",
      planningNote: "Location logistics may create schedule gaps, inconsistent capture, and retake risk.",
      mitigation: "Create a single location tracker with owners, contact windows, and capture standards.",
    });
  }

  if (input.scriptStatus !== "Approved") {
    addFlag({
      label: "Unclear script",
      severity: input.scriptStatus === "Not started" ? "Critical" : "Moderate",
      planningNote: "Script uncertainty can shift runtime, stakeholder review, and final asset requirements.",
      mitigation: "Lock a script outline before production and timebox stakeholder notes.",
    });
  }

  if (input.finalAssetListStatus !== "Final") {
    addFlag({
      label: "No final asset list",
      severity: input.finalAssetListStatus === "Unknown" ? "Critical" : "Moderate",
      planningNote: "Output count may change after estimates are approved.",
      mitigation: "Confirm final deliverable count and variants before post-production starts.",
    });
  }

  if (input.executiveVisibility) {
    addFlag({
      label: "Executive visibility",
      severity: "Moderate",
      planningNote: "Executive-facing projects usually require tighter polish, approvals, and recap language.",
      mitigation: "Add an early executive preview milestone and define decision makers.",
    });
  }

  if (input.revisionExpectation >= 3) {
    addFlag({
      label: "High revision expectation",
      severity: input.revisionExpectation >= 4 ? "High" : "Moderate",
      planningNote: "Multiple revision rounds can consume the delivery buffer quickly.",
      mitigation: "Set review round limits and consolidate reviewer feedback.",
    });
  }

  if (["Moderate", "Advanced"].includes(input.aiVfxComplexity)) {
    addFlag({
      label: "AI / VFX uncertainty",
      severity: input.aiVfxComplexity === "Advanced" ? "High" : "Moderate",
      planningNote: "AI/VFX work may need prompt iteration, model review, legal review, or likeness checks.",
      mitigation: "Run a proof-of-concept before committing to final timeline.",
    });
  }

  input.riskTriggers.forEach((trigger) => {
    if (!flags.some((flag) => flag.label === trigger)) {
      addFlag({
        label: trigger,
        severity: "Moderate",
        planningNote: "Manually selected trigger requires producer review.",
        mitigation: "Document owner, dependency, and approval path during kickoff.",
      });
    }
  });

  const critical = flags.some((flag) => flag.severity === "Critical");
  const highCount = flags.filter((flag) => flag.severity === "High").length;
  const moderateCount = flags.filter((flag) => flag.severity === "Moderate").length;
  const level: RiskLevel = critical || highCount >= 2 ? "Critical" : highCount ? "High" : moderateCount ? "Moderate" : "Low";

  return { level, flags };
}

export function calculateHistoricalMatches(input: ProjectInput): MatchResult[] {
  const scored = historicalProjects.map((project) => scoreHistoricalProject(project, input));
  scored.sort((a, b) => b.matchScore - a.matchScore);
  const defaultCount = scored.some((match) => match.matchScore > 70) ? 3 : 5;
  return scored.slice(0, defaultCount);
}

function scoreHistoricalProject(project: HistoricalProject, input: ProjectInput): MatchResult {
  const checks = [
    {
      label: "Asset Type",
      matched: project.assetType === input.assetType,
      points: historicalMatchWeights.assetType,
      current: input.assetType,
      historical: project.assetType,
    },
    {
      label: "Production Environment",
      matched: project.productionEnvironment === input.productionEnvironment,
      points: historicalMatchWeights.productionEnvironment,
      current: input.productionEnvironment,
      historical: project.productionEnvironment,
    },
    {
      label: "AI / VFX Usage",
      matched: project.aiVfxUsage === input.aiVfxComplexity,
      points: historicalMatchWeights.aiVfxUsage,
      current: input.aiVfxComplexity,
      historical: project.aiVfxUsage,
    },
    {
      label: "Final Output Count",
      matched: Math.abs(project.finalOutputCount - input.assetCount) <= 1,
      points: historicalMatchWeights.finalOutputCount,
      current: `${input.assetCount}`,
      historical: `${project.finalOutputCount}`,
    },
  ];

  const matchScore = checks.reduce((sum, check) => sum + (check.matched ? check.points : 0), 0);
  const matchedVariables = checks.filter((check) => check.matched).map((check) => check.label);
  const mismatchedVariables = checks
    .filter((check) => !check.matched)
    .map((check) => `${check.label}: current ${check.current}, historical ${check.historical}`);

  return {
    ...project,
    matchScore,
    matchTier: getMatchTier(matchScore),
    confidenceLevel: matchScore >= 85 ? "Use as benchmark" : matchScore >= 70 ? "Good directional benchmark" : "Directional only",
    matchedVariables,
    mismatchedVariables,
    reuseRecommendation:
      matchScore >= 70
        ? "Use timeline, hour range, and review pattern as an anchor."
        : "Use only for rough creative reference; validate estimate manually.",
  };
}

function getMatchTier(score: number): MatchTier {
  if (score >= 85) return "Strong Match";
  if (score >= 70) return "High-Confidence Match";
  if (score >= 50) return "Moderate Match";
  return "Weak Match";
}

function getTimelineRiskBuffer(input: ProjectInput) {
  let buffer = 0;
  if (input.deadlineUrgency === "Short deadline") buffer += timelineConfig.riskBuffers.shortDeadline;
  if (["Multiple locations", "Uncoordinated locations"].includes(input.productionEnvironment)) {
    buffer += timelineConfig.riskBuffers.multipleLocations;
  }
  if (input.scriptStatus !== "Approved") buffer += timelineConfig.riskBuffers.unclearScript;
  if (input.finalAssetListStatus !== "Final") buffer += timelineConfig.riskBuffers.noFinalAssetList;
  return buffer;
}

function getRiskMultiplier(input: ProjectInput) {
  let adjustment = 0;
  if (input.deadlineUrgency === "Short deadline") {
    adjustment += average(hoursConfig.riskAdjustments.shortDeadline as [number, number]);
  }
  if (input.productionEnvironment === "Uncoordinated locations") {
    adjustment += average(hoursConfig.riskAdjustments.multipleUncoordinatedLocations as [number, number]);
  }
  if (input.scriptStatus !== "Approved") {
    adjustment += average(hoursConfig.riskAdjustments.unclearScript as [number, number]);
  }
  if (input.finalAssetListStatus !== "Final") {
    adjustment += average(hoursConfig.riskAdjustments.noFinalAssetList as [number, number]);
  }
  return Math.min(hoursConfig.maxRiskAdjustment, adjustment);
}

function getRevisionMultiplier(rounds: number) {
  const sorted = [...hoursConfig.revisionMultipliers].sort((a, b) => b.rounds - a.rounds);
  return sorted.find((rule) => rounds >= rule.rounds)?.multiplier ?? 0;
}

function daysBetweenDates(start: string, deadline: string) {
  if (!start || !deadline) return null;
  const startDate = new Date(`${start}T12:00:00`);
  const deadlineDate = new Date(`${deadline}T12:00:00`);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(deadlineDate.getTime())) return null;
  return Math.ceil((deadlineDate.getTime() - startDate.getTime()) / 86_400_000);
}
