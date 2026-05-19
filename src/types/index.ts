export type AccountStatus =
  | "pending_verification"
  | "active"
  | "suspended"
  | "rejected";

export type UserRole = "agent" | "admin";

export type LeadStatus = "new" | "contacted" | "quoted" | "closed" | "lost";

export interface AgentProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  agency_name: string;
  npn_number: string;
  state: string;
  phone: string;
  account_status: AccountStatus;
  role: UserRole;
  subscription_plan: string | null;
  subscription_status: string | null;
  credit_balance: number;
  mfa_enabled: boolean;
  preferences: AgentPreferences;
  created_at: string;
  updated_at: string;
}

export interface AgentPreferences {
  onboardingCompleted?: boolean;
  wantWalkthrough?: boolean;
  coverageTypes: string[];
  productLines: string[];
  states: string[];
  zipCodes: string[];
  leadTypes: string[];
  homeownerStatus: string[];
  creditTiers: string[];
  vehicleCounts: string[];
  demographics: string[];
  devices: string[];
  budgetTier: string;
  maxLeadPrice: number;
  dailyBudget: number;
  maxLeadsPerDay: number;
  workingHoursStart: string;
  workingHoursEnd: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  carrier?: string;
  producerType?: "producer" | "agent";
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  state: string;
  product_type: string;
  status: LeadStatus;
  assigned_date: string;
  assigned_to: string | null;
  source: string;
  notes?: string;
}

export interface DashboardStats {
  totalLeads: number;
  activeLeads: number;
  conversionRate: number;
  subscriptionStatus: string;
  thisMonth: number;
  totalSpent: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: string;
  description: string;
  date: string;
}

export interface LegacyAgent {
  id: string;
  company: string;
  firstName: string;
  lastName: string;
  email: string;
  creditBalance: number;
  preferences: AgentPreferences;
  role: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  mfaRequired?: boolean;
  agent?: LegacyAgent;
  stats?: DashboardStats;
  leads?: Lead[];
  transactions?: Transaction[];
  error?: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "credit" | "debit" | "subscription";
}

export type SubscriptionPlanId = "starter" | "professional" | "enterprise";
