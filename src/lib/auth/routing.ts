import type { AgentPreferences } from "@/types";

export const AGENT_AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/onboarding",
] as const;

export const ADMIN_AUTH_ROUTES = ["/admin/login", "/admin/forgot-password"] as const;

export const AGENT_APP_PREFIXES = [
  "/dashboard",
  "/leads",
  "/marketplace",
  "/billing",
  "/assistant",
  "/profile",
  "/settings",
] as const;

export const ADMIN_PREFIX = "/admin";
export const PENDING_ROUTE = "/pending";
export const ONBOARDING_ROUTE = "/onboarding";

export function isAdminAuthRoute(pathname: string): boolean {
  return ADMIN_AUTH_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));
}

export function isAgentAuthRoute(pathname: string): boolean {
  return AGENT_AUTH_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));
}

export function isAdminAppRoute(pathname: string): boolean {
  return pathname === ADMIN_PREFIX || pathname.startsWith(`${ADMIN_PREFIX}/`);
}

export function isAgentAppRoute(pathname: string): boolean {
  return AGENT_APP_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

interface ProfileRouteInput {
  account_status?: string;
  role?: string;
  preferences?: AgentPreferences | null;
}

export function agentDestination(profile: ProfileRouteInput | null): string {
  const status = profile?.account_status ?? "pending_verification";
  if (status === "rejected" || status === "pending_verification") return PENDING_ROUTE;
  if (status !== "active") return PENDING_ROUTE;
  if (profile?.preferences?.onboardingCompleted !== true) return ONBOARDING_ROUTE;
  return "/dashboard";
}

export function adminDestination(): string {
  return "/admin";
}
