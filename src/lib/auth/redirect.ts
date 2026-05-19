import { PORTAL_URL } from "@/lib/constants";

/** Canonical origin for auth emails (reset, confirm). Never default to port 3000. */
export function getAuthSiteUrl(): string {
  const fromEnv = (process.env.NEXT_PUBLIC_APP_URL ?? "").trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  return PORTAL_URL;
}

export function getAuthCallbackUrl(nextPath = "/reset-password"): string {
  const next = nextPath.startsWith("/") ? nextPath : `/${nextPath}`;
  return `${getAuthSiteUrl()}/api/auth/callback?next=${encodeURIComponent(next)}`;
}
