import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const cookie = req.cookies.get("admin_session")?.value;
  if (cookie !== process.env.ADMIN_PASSWORD) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/admin";
    loginUrl.search = "";
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
