import type { ApiResponse, AgentPreferences } from "@/types";

const LEGACY_URL = process.env.NEXT_PUBLIC_LEGACY_APPS_SCRIPT_URL;

type LegacyAction =
  | "agentLogin"
  | "registerAgent"
  | "getAgentStats"
  | "getAgentLeads"
  | "updateLeadStatus"
  | "saveAgentPreferences"
  | "addCredits"
  | "getTransactionHistory";

async function postLegacy<T extends ApiResponse>(
  payload: Record<string, unknown>
): Promise<T> {
  if (!LEGACY_URL) {
    throw new Error("Legacy Apps Script URL is not configured");
  }

  const response = await fetch(LEGACY_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });

  return response.json() as Promise<T>;
}

export const legacyApi = {
  login: (email: string, password: string, mfaCode?: string) =>
    postLegacy({
      action: "agentLogin" as LegacyAction,
      email,
      password,
      mfaCode: mfaCode ?? "",
    }),

  register: (data: {
    company: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    license: string;
  }) =>
    postLegacy({
      action: "registerAgent" as LegacyAction,
      ...data,
    }),

  getStats: (agentId: string) =>
    postLegacy({ action: "getAgentStats" as LegacyAction, agentId }),

  getLeads: (agentId: string) =>
    postLegacy({ action: "getAgentLeads" as LegacyAction, agentId }),

  updateLeadStatus: (agentId: string, leadId: string, status: string) =>
    postLegacy({
      action: "updateLeadStatus" as LegacyAction,
      agentId,
      leadId,
      status,
    }),

  savePreferences: (agentId: string, preferences: AgentPreferences) =>
    postLegacy({
      action: "saveAgentPreferences" as LegacyAction,
      agentId,
      preferences,
    }),

  addCredits: (agentId: string, amount: number) =>
    postLegacy({ action: "addCredits" as LegacyAction, agentId, amount }),

  getTransactions: (agentId: string) =>
    postLegacy({
      action: "getTransactionHistory" as LegacyAction,
      agentId,
    }),
};
