/** Lead targeting options (inspired by MediaAlpha-style filters). */

export interface LeadFilterStep {
  id: string;
  title: string;
  subtitle?: string;
  multi?: boolean;
  options: { id: string; label: string }[];
}

export const AGENT_ONBOARDING_STEPS: LeadFilterStep[] = [
  {
    id: "wantWalkthrough",
    title: "Would you like a quick platform walkthrough?",
    options: [
      { id: "yes", label: "Yes — show me around" },
      { id: "no", label: "No — I'll explore on my own" },
    ],
  },
  {
    id: "productLines",
    title: "Which product lines do you want?",
    multi: true,
    options: [
      { id: "auto", label: "Auto" },
      { id: "home", label: "Home" },
      { id: "renters", label: "Renters" },
      { id: "life", label: "Life" },
      { id: "health", label: "Health" },
      { id: "medicare", label: "Medicare" },
      { id: "commercial", label: "Commercial" },
      { id: "bundle", label: "Bundle" },
    ],
  },
  {
    id: "states",
    title: "Licensed states to receive leads from",
    multi: true,
    options: [
      "IN", "MI", "OH", "IL", "KY", "TN", "WI", "MN", "TX", "FL", "GA", "NC", "SC", "AL", "MS",
    ].map((s) => ({ id: s, label: s })),
  },
  {
    id: "leadTypes",
    title: "Lead types",
    multi: true,
    options: [
      { id: "exclusive", label: "Exclusive" },
      { id: "shared", label: "Shared" },
      { id: "aged", label: "Aged" },
      { id: "live_transfer", label: "Live transfer" },
      { id: "quote_requests", label: "Quote requests" },
    ],
  },
  {
    id: "homeownerStatus",
    title: "Homeowner status",
    multi: true,
    options: [
      { id: "owner", label: "Homeowner" },
      { id: "renter", label: "Renter" },
      { id: "either", label: "Either" },
    ],
  },
  {
    id: "creditTiers",
    title: "Credit quality",
    multi: true,
    options: [
      { id: "excellent", label: "Excellent" },
      { id: "good", label: "Good" },
      { id: "fair", label: "Fair" },
      { id: "poor", label: "Poor / rebuilding" },
    ],
  },
  {
    id: "vehicleCount",
    title: "Vehicles per household",
    multi: true,
    options: [
      { id: "1", label: "1 vehicle" },
      { id: "2", label: "2 vehicles" },
      { id: "3+", label: "3+ vehicles" },
    ],
  },
  {
    id: "demographics",
    title: "Demographics (optional targeting)",
    multi: true,
    options: [
      { id: "age_18_24", label: "Age 18–24" },
      { id: "age_25_34", label: "Age 25–34" },
      { id: "age_35_49", label: "Age 35–49" },
      { id: "age_50_64", label: "Age 50–64" },
      { id: "age_65+", label: "Age 65+" },
      { id: "married", label: "Married" },
      { id: "single", label: "Single" },
    ],
  },
  {
    id: "devices",
    title: "Device / channel",
    multi: true,
    options: [
      { id: "mobile", label: "Mobile" },
      { id: "desktop", label: "Desktop" },
      { id: "tablet", label: "Tablet" },
    ],
  },
  {
    id: "budget",
    title: "Daily lead budget comfort",
    options: [
      { id: "under_50", label: "Under $50/day" },
      { id: "50_150", label: "$50–$150/day" },
      { id: "150_500", label: "$150–$500/day" },
      { id: "500+", label: "$500+/day" },
    ],
  },
];

export const SECURITY_QUESTIONS = [
  "What city were you born in?",
  "What was the name of your first pet?",
  "What is your mother's maiden name?",
  "What was the model of your first car?",
  "What street did you grow up on?",
] as const;

export const CARRIER_OPTIONS = [
  "Allstate",
  "Progressive",
  "State Farm",
  "GEICO",
  "Liberty Mutual",
  "Nationwide",
  "Farmers",
  "American Family",
  "Travelers",
  "Other / multiple",
] as const;
