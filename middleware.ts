import { NextRequest } from "next/server";
import { proxyLogic } from "./appProxy"; // Імпортуємо з нового імені

export async function middleware(request: NextRequest) {
  return await proxyLogic(request);
}

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
