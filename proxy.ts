import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkSession } from "./lib/api/serverApi";

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    username?: string;
  };
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieStore = await cookies();
  let accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isAuthRoute =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  const isPrivateRoute =
    pathname.startsWith("/notes") || pathname.startsWith("/profile");

  if (!accessToken && refreshToken) {
    try {
      const sessionResponse = await checkSession();

      const data = sessionResponse.data as unknown as AuthResponse;
      const { accessToken: newAccess, refreshToken: newRefresh } = data;

      if (newAccess && newRefresh) {
        accessToken = newAccess;

        if (isAuthRoute) {
          const res = NextResponse.redirect(new URL("/", request.url));
          res.cookies.set("accessToken", newAccess, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
          });
          res.cookies.set("refreshToken", newRefresh, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
          });
          return res;
        }

        const res = NextResponse.next();
        res.cookies.set("accessToken", newAccess, {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
        });
        res.cookies.set("refreshToken", newRefresh, {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
        });
        return res;
      }
    } catch {
      const errorResponse = isPrivateRoute
        ? NextResponse.redirect(new URL("/sign-in", request.url))
        : NextResponse.next();

      errorResponse.cookies.delete("accessToken");
      errorResponse.cookies.delete("refreshToken");
      return errorResponse;
    }
  }

  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isPrivateRoute && !accessToken) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export default proxy;
