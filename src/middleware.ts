import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createAdminClient } from "@/lib/supabase/admin";
import type { AgentPreferences } from "@/types";

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

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.next();
  }

  const isPublic =
    PUBLIC_ROUTES.includes(pathname) ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next");

  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  if (isPublic && !isAuthRoute && pathname !== PENDING_ROUTE) {
    return NextResponse.next();
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
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  let profile: {
    account_status: string;
    role: string;
    preferences: AgentPreferences | null;
  } | null = null;

  try {
    const admin = createAdminClient();
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
      return NextResponse.redirect(url);
    }
    if (onboardingDone) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  if (isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = destination;
    return NextResponse.redirect(url);
  }

  if (PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    if (!isActive || !onboardingDone) {
      const url = request.nextUrl.clone();
      url.pathname = destination;
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith(ADMIN_PREFIX) && !isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = isActive ? "/dashboard" : PENDING_ROUTE;
    return NextResponse.redirect(url);
  }

  if (pathname === PENDING_ROUTE && isActive) {
    const url = request.nextUrl.clone();
    url.pathname = onboardingDone ? "/dashboard" : ONBOARDING_ROUTE;
    return NextResponse.redirect(url);
  }

  if (pathname === PENDING_ROUTE && isPending) {
    return supabaseResponse;
  }

  if (pathname === PENDING_ROUTE && isRejected) {
    return supabaseResponse;
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
