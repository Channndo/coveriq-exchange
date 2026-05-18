import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];
const PUBLIC_ROUTES = ["/", "/apply"];
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

  if (isPublic && !isAuthRoute) {
    return NextResponse.next();
  }

  const { user, supabase, supabaseResponse } = await updateSession(request);

  if (!user) {
    if (
      PROTECTED_PREFIXES.some((p) => pathname.startsWith(p)) ||
      pathname.startsWith(ADMIN_PREFIX)
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  const { data: profile } = await supabase
    .from("agent_profiles")
    .select("account_status, role")
    .eq("user_id", user.id)
    .single();

  const status = profile?.account_status ?? "pending_verification";
  const isActive = status === "active";
  const isAdmin = profile?.role === "admin";

  if (isAuthRoute && isActive) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (
    PROTECTED_PREFIXES.some((p) => pathname.startsWith(p)) &&
    !isActive
  ) {
    const url = request.nextUrl.clone();
    url.pathname = PENDING_ROUTE;
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith(ADMIN_PREFIX) && !isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (pathname === PENDING_ROUTE && isActive) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
