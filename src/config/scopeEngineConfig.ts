import type { AssetType, ComplexityTier } from "../types";

export const assetTypeOptions: AssetType[] = [
  "Role-play: Coach to Client",
  "Role-play: Coach to Manager",
  "Talking-head Instructional",
  "SME-driven Curriculum",
  "Avatar / AI-generated Content",
  "Voice Cloning",
  "Likeness Replication",
  "AI-driven Instructional Delivery",
  "Documentary / Day-in-the-Life",
  "Podcast Format",
  "Highlight Reel",
  "Certification / Curriculum Capture",
  "Screen-recording Instructional",
];

export const complexityWeights = {
  deadlineUrgency: 18,
  assetCount: 15,
  aiVfxComplexity: 14,
  productionEnvironment: 12,
  stakeholderComplexity: 12,
  revisionExpectation: 10,
  runtimeLength: 8,
  executiveVisibility: 6,
  travelLocationCoordination: 5,
};

export const complexityTiers: Array<{ tier: ComplexityTier; min: number; max: number }> = [
  { tier: "Simple", min: 0, max: 20 },
  { tier: "Standard", min: 21, max: 40 },
  { tier: "Premium", min: 41, max: 60 },
  { tier: "Cinematic", min: 61, max: 80 },
  { tier: "Enterprise", min: 81, max: 100 },
];

export const scoringScales = {
  deadlineUrgency: {
    Flexible: 0.2,
    Standard: 0.45,
    "Needs attention": 0.7,
    "Short deadline": 1,
  },
  aiVfxComplexity: {
    None: 0,
    Light: 0.35,
    Moderate: 0.65,
    Advanced: 1,
  },
  productionEnvironment: {
    "Remote / async": 0.2,
    "Studio / controlled": 0.35,
    "Single location": 0.55,
    "Multiple locations": 0.85,
    "Uncoordinated locations": 1,
  },
  stakeholderComplexity: {
    "Single approver": 0.2,
    "Small review group": 0.45,
    "Cross-functional": 0.7,
    "Executive / multi-team": 1,
  },
  travelLocationCoordination: {
    None: 0,
    Local: 0.35,
    Regional: 0.65,
    "Multi-market": 1,
  },
};

export const timelineConfig = {
  baseDurationDays: {
    Simple: [2, 4],
    Standard: [5, 10],
    Premium: [10, 15],
    Cinematic: [15, 25],
    Enterprise: [25, 45],
  } satisfies Record<ComplexityTier, [number, number]>,
  assetLoadAdjustments: [
    { min: 1, max: 2, days: 0 },
    { min: 3, max: 5, days: 2 },
    { min: 6, max: 10, days: 5 },
    { min: 11, max: Infinity, days: 8 },
  ],
  riskBuffers: {
    shortDeadline: 3,
    multipleLocations: 2,
    unclearScript: 3,
    noFinalAssetList: 2,
  },
  riskBufferCap: 10,
  maxCompressionPercent: 0.3,
  phaseDistribution: {
    "Pre-Production": 0.2,
    Production: 0.2,
    "Post-Production": 0.4,
    "Review / Revision": 0.15,
    Delivery: 0.05,
  },
};

export const hoursConfig = {
  baseHours: {
    Simple: [4, 8],
    Standard: [10, 20],
    Premium: [20, 40],
    Cinematic: [40, 80],
    Enterprise: [80, 160],
  } satisfies Record<ComplexityTier, [number, number]>,
  assetCountAdjustments: [
    { min: 1, max: 2, hours: [0, 0] },
    { min: 3, max: 5, hours: [4, 8] },
    { min: 6, max: 10, hours: [10, 20] },
    { min: 11, max: Infinity, hours: [25, 50] },
  ],
  formatComplexityAdjustments: {
    "Screen-recording Instructional": [2, 5],
    "Talking-head Instructional": [4, 8],
    "Podcast Format": [6, 12],
    "Role-play: Coach to Client": [10, 20],
    "Role-play: Coach to Manager": [10, 20],
    "Documentary / Day-in-the-Life": [15, 30],
    "SME-driven Curriculum": [20, 40],
    "Certification / Curriculum Capture": [20, 40],
    "Highlight Reel": [25, 50],
    "Avatar / AI-generated Content": [30, 60],
    "Voice Cloning": [30, 60],
    "Likeness Replication": [30, 60],
    "AI-driven Instructional Delivery": [30, 60],
  } satisfies Record<AssetType, [number, number]>,
  riskAdjustments: {
    shortDeadline: [0.1, 0.25],
    multipleUncoordinatedLocations: [0.1, 0.2],
    unclearScript: [0.15, 0.3],
    noFinalAssetList: [0.1, 0.25],
  },
  maxRiskAdjustment: 0.5,
  revisionMultipliers: [
    { rounds: 1, multiplier: 0.05 },
    { rounds: 2, multiplier: 0.1 },
    { rounds: 3, multiplier: 0.2 },
    { rounds: 4, multiplier: 0.35 },
  ],
  phaseDistribution: {
    "Pre-Production": 0.22,
    Production: 0.24,
    "Post-Production": 0.38,
    "Review / Revision": 0.12,
    Delivery: 0.04,
  },
};

export const historicalMatchWeights = {
  assetType: 45,
  productionEnvironment: 25,
  aiVfxUsage: 20,
  finalOutputCount: 10,
};
