import { NextRequest, NextResponse } from "next/server";
import { validateSessionAdmin } from "./lib/auth";

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/admin")) {
    const token = await validateSessionAdmin();

    if (!token) {
      return NextResponse.redirect(new URL("/", req.nextUrl).toString());
    }
  }
}
