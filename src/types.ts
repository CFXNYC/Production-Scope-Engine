export type ComplexityTier = "Simple" | "Standard" | "Premium" | "Cinematic" | "Enterprise";
export type RiskLevel = "Low" | "Moderate" | "High" | "Critical";
export type MatchTier = "Strong Match" | "High-Confidence Match" | "Moderate Match" | "Weak Match";

export type AssetType =
  | "Role-play: Coach to Client"
  | "Role-play: Coach to Manager"
  | "Talking-head Instructional"
  | "SME-driven Curriculum"
  | "Avatar / AI-generated Content"
  | "Voice Cloning"
  | "Likeness Replication"
  | "AI-driven Instructional Delivery"
  | "Documentary / Day-in-the-Life"
  | "Podcast Format"
  | "Highlight Reel"
  | "Certification / Curriculum Capture"
  | "Screen-recording Instructional";

export interface ProjectInput {
  projectName: string;
  projectOwner: string;
  requestingTeam: string;
  projectStartDate: string;
  projectDeadline: string;
  assetType: AssetType;
  assetCount: number;
  runtimeLength: number;
  productionEnvironment: string;
  stakeholderComplexity: string;
  revisionExpectation: number;
  aiVfxComplexity: string;
  travelLocationCoordination: string;
  executiveVisibility: boolean;
  deadlineUrgency: string;
  riskTriggers: string[];
  finalAssetListStatus: string;
  scriptStatus: string;
}

export interface HistoricalProject {
  id: string;
  projectName: string;
  projectType: string;
  assetType: AssetType;
  sourceAssetType: string;
  assetCount: number;
  productionEnvironment: string;
  aiVfxUsage: string;
  finalOutputCount: number;
  actualTimelineDays: number;
  actualHours: number;
  revisionRounds: number;
  finalComplexityTier: ComplexityTier;
  status: string;
  referenceLink?: string;
}

export interface ComplexityResult {
  score: number;
  tier: ComplexityTier;
  driverScores: Record<string, number>;
}

export interface TimelineResult {
  estimatedDays: number;
  originalEstimatedDays: number;
  availableWindowDays: number | null;
  compressed: boolean;
  compressionPercent: number;
  phaseBreakdown: Array<{ phase: string; days: number; percent: number }>;
  notes: string[];
}

export interface HourResult {
  estimatedHours: number;
  baseHours: number;
  riskMultiplier: number;
  revisionMultiplier: number;
  phaseBreakdown: Array<{ phase: string; hours: number; percent: number }>;
  notes: string[];
}

export interface RiskFlag {
  label: string;
  severity: RiskLevel;
  planningNote: string;
  mitigation: string;
}

export interface MatchResult extends HistoricalProject {
  matchScore: number;
  matchTier: MatchTier;
  confidenceLevel: string;
  matchedVariables: string[];
  mismatchedVariables: string[];
  reuseRecommendation: string;
}

export interface QueueProject {
  id: string;
  projectName: string;
  personRole?: string;
  location?: string;
  progress: string;
  shootDate?: string;
  deliveryDate?: string;
  time?: string;
  description?: string;
  sourceRow: number;
}

export type CalendarEventType = "Shoot" | "Pre-Production" | "Production" | "Post-Production" | "Review" | "Delivery" | "Hold";

export interface CalendarEvent {
  id: string;
  title: string;
  projectName: string;
  type: CalendarEventType;
  start: string;
  end: string;
  location?: string;
  attendees?: string[];
  status: "Busy" | "Tentative" | "Free";
  source: "Outlook sample" | "Production queue" | "Generated recommendation";
}

export interface CalendarConflict {
  eventId: string;
  title: string;
  date: string;
  overlapHours: number;
  severity: RiskLevel;
  note: string;
}

export interface AssetLibraryItem {
  id: string;
  projectName: string;
  assetType: AssetType;
  status: string;
  thumbnailUrl?: string;
  assetUrl?: string;
  source: string;
  visualCue: string;
}
