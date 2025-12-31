import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkSession } from "../lib/api/serverApi"; // Перевірте, чи шлях вірний

const privateRoutes = ["/profile", "/notes"];
const authRoutes = ["/sign-in", "/sign-up"];
const BACKEND_URL = "https://auth-backend-production-c662.up.railway.app";

// Експортуємо як proxy, щоб задовольнити ментора
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Rewrite для запобігання 404
  if (pathname.startsWith("/auth") || pathname.startsWith("/api")) {
    const targetUrl = new URL(pathname + request.nextUrl.search, BACKEND_URL);
    return NextResponse.rewrite(targetUrl);
  }

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  let isAuthenticated = !!accessToken;
  let sessionResponse: Response | null = null;

  if (!accessToken && refreshToken) {
    try {
      const res = await checkSession();
      sessionResponse = res as unknown as Response;
      if (sessionResponse && sessionResponse.ok) {
        isAuthenticated = true;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  let response: NextResponse;
  if (isPrivateRoute && !isAuthenticated) {
    response = NextResponse.redirect(new URL("/sign-in", request.url));
  } else if (isAuthRoute && isAuthenticated) {
    response = NextResponse.redirect(new URL("/", request.url));
  } else {
    response = NextResponse.next();
  }

  if (sessionResponse) {
    const setCookie = sessionResponse.headers.get("set-cookie");
    if (setCookie) {
      response.headers.set("set-cookie", setCookie);
    }
  }

  return response;
}

// Цей рядок обов'язковий для Next.js, він каже: "використовуй функцію proxy як головну"
export default proxy;

export const config = {
  matcher: [
    "/profile/:path*",
    "/notes/:path*",
    "/sign-in",
    "/sign-up",
    "/auth/:path*",
    "/api/:path*",
  ],
};
