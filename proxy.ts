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

  const res = NextResponse.next();

  // 1. Оновлення сесії
  if (!accessToken && refreshToken) {
    try {
      const user = await checkSession();

      if (user) {
        isAuthenticated = true;

        const updatedCookies = await cookies();
        const newAccess = updatedCookies.get("accessToken")?.value;
        const newRefresh = updatedCookies.get("refreshToken")?.value;

        if (newAccess) res.cookies.set("accessToken", newAccess);
        if (newRefresh) res.cookies.set("refreshToken", newRefresh);
      }
    } catch (error) {
      console.error("Session refresh failed", error);
    }
  }

  // 2. Логіка перенаправлень
  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthRoute && isAuthenticated) {
    const redirectRes = NextResponse.redirect(new URL("/", request.url));

    const updatedCookies = await cookies();
    const newAccess = updatedCookies.get("accessToken")?.value;
    const newRefresh = updatedCookies.get("refreshToken")?.value;

    if (newAccess) redirectRes.cookies.set("accessToken", newAccess);
    if (newRefresh) redirectRes.cookies.set("refreshToken", newRefresh);

    return redirectRes;
  }

  return res;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
