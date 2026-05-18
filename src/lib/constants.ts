export const APP_NAME = "CoverIQ Exchange";
export const APP_TAGLINE = "The Intelligent Insurance Lead Exchange";
export const SUPPORT_EMAIL = "support@cover-iq.com";
export const MAIN_SITE_URL = "https://cover-iq.com";
export const PORTAL_URL = "https://agents.cover-iq.com";

export const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC",
] as const;

export const LEAD_STATUSES = ["new", "contacted", "quoted", "closed", "lost"] as const;

export const PRODUCT_TYPES = [
  "Auto",
  "Home",
  "Life",
  "Health",
  "Commercial",
  "Umbrella",
  "Renters",
] as const;

export const ACCOUNT_STATUSES = [
  "pending_verification",
  "active",
  "suspended",
  "rejected",
] as const;

export const SUBSCRIPTION_PLANS = {
  starter: {
    id: "starter",
    name: "Starter",
    price: 99,
    description: "Essential lead access for solo producers",
    features: ["50 leads / month", "Basic routing", "Email support"],
  },
  professional: {
    id: "professional",
    name: "Professional",
    price: 249,
    description: "Growth infrastructure for active agencies",
    features: [
      "250 leads / month",
      "AI-powered routing",
      "Priority support",
      "Marketplace access",
    ],
    popular: true,
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    price: null,
    description: "Custom volume and insurer integrations",
    features: [
      "Unlimited routing rules",
      "Dedicated success manager",
      "API access",
      "Custom compliance workflows",
    ],
  },
} as const;

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/leads", label: "Leads", icon: "Users" },
  { href: "/marketplace", label: "Lead Marketplace", icon: "Store" },
  { href: "/billing", label: "Billing", icon: "CreditCard" },
  { href: "/assistant", label: "AI Assistant", icon: "Bot" },
  { href: "/profile", label: "Profile", icon: "User" },
  { href: "/settings", label: "Settings", icon: "Settings" },
] as const;

export const ADMIN_NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/agents", label: "Agent Verification" },
  { href: "/admin/leads", label: "Lead Upload" },
  { href: "/admin/subscriptions", label: "Subscriptions" },
] as const;
