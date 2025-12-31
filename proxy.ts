import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkSession } from "./lib/api/serverApi";

const BACKEND_URL = "https://auth-backend-production-c662.up.railway.app";
const privateRoutes = ["/profile", "/notes"];
const authRoutes = ["/sign-in", "/sign-up"];

/**
 * Головна функція, яку Next.js запустить для кожного запиту.
 * Назва "proxy" важлива для Turbopack.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. ПРОКСІЮВАННЯ (Це прибере помилку 404)
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

  // 2. ПЕРЕВІРКА СЕСІЇ (Вимога ментора №1)
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

  // 3. РЕДИРЕКТИ
  let response: NextResponse;
  if (isPrivateRoute && !isAuthenticated) {
    response = NextResponse.redirect(new URL("/sign-in", request.url));
  } else if (isAuthRoute && isAuthenticated) {
    response = NextResponse.redirect(new URL("/", request.url));
  } else {
    response = NextResponse.next();
  }

  // 4. КОПІЮВАННЯ SET-COOKIE (Вимога ментора №2)
  if (sessionResponse) {
    const setCookie = sessionResponse.headers.get("set-cookie");
    if (setCookie) {
      response.headers.set("set-cookie", setCookie);
    }
  }

  return response;
}

// ОБОВ'ЯЗКОВО: Експорт за замовчуванням для Next.js
export default proxy;

// 5. КОНФІГУРАЦІЯ (Це активує проксі для потрібних адрес)
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
