import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const authRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Отримуємо початкові токени
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  let isAuthenticated = !!accessToken;

  // 2. Спроба оновлення сесії
  if (!accessToken && refreshToken) {
    try {
      const user = await checkSession();

      if (user) {
        isAuthenticated = true;
      } else {
        isAuthenticated = false;
      }
    } catch (error) {
      console.error("Session refresh failed:", error);
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

  if (!accessToken && isAuthenticated) {
    const updatedCookieStore = await cookies();
    const newAccess = updatedCookieStore.get("accessToken")?.value;
    const newRefresh = updatedCookieStore.get("refreshToken")?.value;

    if (newAccess) {
      response.cookies.set("accessToken", newAccess);
    }
    if (newRefresh) {
      response.cookies.set("refreshToken", newRefresh);
    }
  }

  return response;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
