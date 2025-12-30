import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const authRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  let isAuthenticated = !!accessToken;
  let newAccess: string | undefined;
  let newRefresh: string | undefined;

  // 1. Логіка оновлення сесії
  if (!accessToken && refreshToken) {
    try {
      const user = await checkSession();
      if (user) {
        isAuthenticated = true;

        const updatedCookies = await cookies();
        newAccess = updatedCookies.get("accessToken")?.value;
        newRefresh = updatedCookies.get("refreshToken")?.value;
      }
    } catch (error) {
      console.error("Session refresh failed", error);
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

  if (newAccess) {
    response.cookies.set("accessToken", newAccess);
  }
  if (newRefresh) {
    response.cookies.set("refreshToken", newRefresh);
  }

  return response;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
