import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkSession } from "./lib/api/serverApi";

const BACKEND_URL = "https://auth-backend-production-c662.up.railway.app";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Додаємо лог, щоб бачити роботу в консолі Vercel
  console.log("Proxy request to:", pathname);

  // 1. Проксіювання запитів на бекенд
  if (pathname.startsWith("/auth") || pathname.startsWith("/api")) {
    const targetUrl = new URL(pathname + request.nextUrl.search, BACKEND_URL);
    return NextResponse.rewrite(targetUrl);
  }

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  let isAuthenticated = !!accessToken;
  let sessionResponse: Response | null = null;

  // 2. Перевірка сесії (вимога викладача)
  if (!accessToken && refreshToken) {
    try {
      const res = await checkSession();
      sessionResponse = res as unknown as Response;
      if (sessionResponse?.ok) isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  // 3. Редиректи
  let response: NextResponse;
  if (
    ["/profile", "/notes"].some((r) => pathname.startsWith(r)) &&
    !isAuthenticated
  ) {
    response = NextResponse.redirect(new URL("/sign-in", request.url));
  } else {
    response = NextResponse.next();
  }

  // 4. Передача куків
  if (sessionResponse) {
    const setCookie = sessionResponse.headers.get("set-cookie");
    if (setCookie) response.headers.set("set-cookie", setCookie);
  }

  return response;
}

// Обов'язково експорт за замовчуванням
export default proxy;

export const config = {
  matcher: [
    "/auth/:path*",
    "/api/:path*",
    "/profile/:path*",
    "/notes/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
