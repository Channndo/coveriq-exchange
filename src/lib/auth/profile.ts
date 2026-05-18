import type { AgentProfile, AgentPreferences } from "@/types";

export const defaultPreferences = (): AgentPreferences => ({
  coverageTypes: [],
  states: [],
  zipCodes: [],
  maxLeadPrice: 0,
  dailyBudget: 0,
  maxLeadsPerDay: 0,
  workingHoursStart: "09:00",
  workingHoursEnd: "17:00",
  emailNotifications: false,
  smsNotifications: false,
});

export function canAccessDashboard(profile: AgentProfile | null): boolean {
  if (!profile) return false;
  return profile.account_status === "active";
}

export function isAdmin(profile: AgentProfile | null): boolean {
  return profile?.role === "admin";
}

export function getDisplayName(profile: Partial<AgentProfile>): string {
  const agency = profile.agency_name?.trim();
  if (agency) return agency;
  const full = [profile.first_name, profile.last_name].filter(Boolean).join(" ");
  if (full) return full;
  return profile.email?.split("@")[0] ?? "Agent";
}
