import { NextResponse, type NextRequest } from "next/server";
import { ensureOwnerProfile } from "@/lib/auth/ownerBootstrap";
import { updateSession } from "@/lib/supabase/middleware";
import { createAdminClient } from "@/lib/supabase/admin";
import { handleApiRoute } from "@/lib/security/apiMiddleware";
import {
  finalizePublicResponse,
  getSiteRateLimit,
  publicNext,
  siteRateLimitResponse,
} from "@/lib/security/siteGuards";
import type { RateLimitResult } from "@/lib/security/rateLimit";
import type { AgentPreferences } from "@/types";

function finish(
  request: NextRequest,
  response: NextResponse,
  siteRl: RateLimitResult
): NextResponse {
  return finalizePublicResponse(request, response, siteRl);
}

const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password", "/onboarding"];
const PUBLIC_ROUTES = ["/", "/apply"];
const ONBOARDING_ROUTE = "/onboarding";
const PENDING_ROUTE = "/pending";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/leads",
  "/marketplace",
  "/billing",
  "/assistant",
  "/profile",
  "/settings",
];

const ADMIN_PREFIX = "/admin";

function postAuthPath(
  isActive: boolean,
  isRejected: boolean,
  onboardingDone: boolean,
  isAdmin: boolean
): string {
  if (isRejected) return PENDING_ROUTE;
  if (!isActive) return PENDING_ROUTE;
  if (!onboardingDone) return ONBOARDING_ROUTE;
  return isAdmin ? "/admin" : "/dashboard";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const siteRl = await getSiteRateLimit(request);
  if (!siteRl.allowed) return siteRateLimitResponse(siteRl);

  if (pathname.startsWith("/api/")) {
    return handleApiRoute(request);
  }

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return publicNext(request, siteRl);
  }

  const isPublic =
    PUBLIC_ROUTES.includes(pathname) ||
    pathname.startsWith("/_next");

  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  if (isPublic && !isAuthRoute && pathname !== PENDING_ROUTE) {
    return publicNext(request, siteRl);
  }

  const { user, supabase, supabaseResponse } = await updateSession(request);

  if (!user) {
    if (
      PROTECTED_PREFIXES.some((p) => pathname.startsWith(p)) ||
      pathname.startsWith(ADMIN_PREFIX) ||
      pathname.startsWith(ONBOARDING_ROUTE) ||
      pathname === PENDING_ROUTE
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return finish(request, NextResponse.redirect(url), siteRl);
    }
    return finish(request, supabaseResponse, siteRl);
  }

  let profile: {
    account_status: string;
    role: string;
    preferences: AgentPreferences | null;
  } | null = null;

  try {
    const admin = createAdminClient();
    await ensureOwnerProfile(admin, user);
    const { data } = await admin
      .from("agent_profiles")
      .select("account_status, role, preferences")
      .eq("user_id", user.id)
      .maybeSingle();
    profile = data;
  } catch {
    const { data } = await supabase
      .from("agent_profiles")
      .select("account_status, role, preferences")
      .eq("user_id", user.id)
      .maybeSingle();
    profile = data;
  }

  const status = profile?.account_status ?? "pending_verification";
  const prefs = (profile?.preferences || {}) as AgentPreferences;
  const onboardingDone = prefs.onboardingCompleted === true;
  const isActive = status === "active";
  const isRejected = status === "rejected";
  const isPending = status === "pending_verification";
  const isAdmin = profile?.role === "admin";

  const destination = postAuthPath(isActive, isRejected, onboardingDone, isAdmin);

  if (pathname.startsWith(ONBOARDING_ROUTE)) {
    if (!isActive) {
      const url = request.nextUrl.clone();
      url.pathname = PENDING_ROUTE;
      return finish(request, NextResponse.redirect(url), siteRl);
    }
    if (onboardingDone) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return finish(request, NextResponse.redirect(url), siteRl);
    }
  }

  if (isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = destination;
    return finish(request, NextResponse.redirect(url), siteRl);
  }

  if (PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    if (!isActive || !onboardingDone) {
      const url = request.nextUrl.clone();
      url.pathname = destination;
      return finish(request, NextResponse.redirect(url), siteRl);
    }
  }

  if (pathname.startsWith(ADMIN_PREFIX) && !isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = isActive ? "/dashboard" : PENDING_ROUTE;
    return finish(request, NextResponse.redirect(url), siteRl);
  }

  if (pathname === PENDING_ROUTE && isActive) {
    const url = request.nextUrl.clone();
    if (!onboardingDone) {
      url.pathname = ONBOARDING_ROUTE;
    } else {
      url.pathname = isAdmin ? "/admin" : "/dashboard";
    }
    return finish(request, NextResponse.redirect(url), siteRl);
  }

  if (pathname === PENDING_ROUTE && isPending) {
    return finish(request, supabaseResponse, siteRl);
  }

  if (pathname === PENDING_ROUTE && isRejected) {
    return finish(request, supabaseResponse, siteRl);
  }

  return finish(request, supabaseResponse, siteRl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
