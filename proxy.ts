import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkSession } from "./lib/api/serverApi";

const BACKEND_URL = "https://auth-backend-production-c662.up.railway.app";
const privateRoutes = ["/profile", "/notes"];
const authRoutes = ["/sign-in", "/sign-up"];

/**
 * Головна функція проксі.
 * Назва "proxy" задовольняє вимоги Next.js 15+ для файлів з назвою proxy.ts
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Проксіювання запитів до бекенду (виправляє 404)
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

  // 2. Перевірка сесії (Вимога ментора №1)
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

  // 3. Логіка редиректів
  let response: NextResponse;

  if (isPrivateRoute && !isAuthenticated) {
    response = NextResponse.redirect(new URL("/sign-in", request.url));
  } else if (isAuthRoute && isAuthenticated) {
    response = NextResponse.redirect(new URL("/", request.url));
  } else {
    response = NextResponse.next();
  }

  // 4. Явне копіювання Set-Cookie (Вимога ментора №2)
  if (sessionResponse) {
    const setCookie = sessionResponse.headers.get("set-cookie");
    if (setCookie) {
      response.headers.set("set-cookie", setCookie);
    }
  }

  return response;
}

// Next.js потребує default export для проксі-файлів
export default proxy;

// 5. Конфігурація шляхів (Matchers)
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
