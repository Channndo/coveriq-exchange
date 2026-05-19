import { AGENT_ACCOUNTS_WEB_APP_URL } from "@/lib/constants";

const AGENT_ACCOUNTS_URL = AGENT_ACCOUNTS_WEB_APP_URL;

export interface AgentSignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  agencyName: string;
  npn: string;
  licensedStates: string;
  carrier: string;
  producerType: "producer" | "agent";
  securityQuestion1: string;
  securityAnswer1: string;
  securityQuestion2: string;
  securityAnswer2: string;
  action?: string;
  status?: string;
  wantWalkthrough?: string;
  leadFilters?: Record<string, unknown>;
}

async function post(payload: Record<string, string>): Promise<void> {
  if (!AGENT_ACCOUNTS_URL) return;
  try {
    await fetch(AGENT_ACCOUNTS_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(payload),
    });
  } catch {
    /* no-cors */
  }
}

export async function submitAgentSignup(data: AgentSignupPayload): Promise<void> {
  await post({
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    agencyName: data.agencyName.trim(),
    npn: data.npn.trim(),
    licensedStates: data.licensedStates.trim(),
    carrier: data.carrier.trim(),
    producerType: data.producerType,
    securityQuestion1: data.securityQuestion1,
    securityAnswer1: data.securityAnswer1.trim(),
    securityQuestion2: data.securityQuestion2,
    securityAnswer2: data.securityAnswer2.trim(),
    action: data.action || "signup",
    status: data.status || "active",
    source: "agents.cover-iq.com",
    timestamp: new Date().toISOString(),
  });
}

export async function submitAgentLeadFilters(
  data: AgentSignupPayload & { leadFilters: Record<string, unknown> }
): Promise<void> {
  await post({
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    action: "lead_filters",
    status: "active",
    wantWalkthrough: data.wantWalkthrough || "",
    leadFiltersJson: JSON.stringify(data.leadFilters),
    source: "agents.cover-iq.com",
    timestamp: new Date().toISOString(),
  });
}
