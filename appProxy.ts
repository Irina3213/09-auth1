import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkSession } from "./lib/api/serverApi";

const BACKEND_URL = "https://auth-backend-production-c662.up.railway.app";

export async function proxyLogic(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/auth") || pathname.startsWith("/api")) {
    const targetUrl = new URL(pathname + request.nextUrl.search, BACKEND_URL);
    return NextResponse.rewrite(targetUrl);
  }

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  let isAuthenticated = !!accessToken;
  let sessionResponse: Response | null = null;

  if (!accessToken && refreshToken) {
    try {
      const res = await checkSession();
      sessionResponse = res as unknown as Response;
      if (sessionResponse?.ok) isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  let response: NextResponse;
  // Спрощена логіка редиректів для прикладу
  if (
    ["/profile", "/notes"].some((route) => pathname.startsWith(route)) &&
    !isAuthenticated
  ) {
    response = NextResponse.redirect(new URL("/sign-in", request.url));
  } else {
    response = NextResponse.next();
  }

  if (sessionResponse) {
    const setCookie = sessionResponse.headers.get("set-cookie");
    if (setCookie) response.headers.set("set-cookie", setCookie);
  }

  return response;
}
