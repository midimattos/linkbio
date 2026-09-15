import { NextRequest } from "next/server";

export function isAdminRequest(req: NextRequest): boolean {
  const cookie = req.cookies.get("admin_session")?.value;
  return !!cookie && cookie === process.env.ADMIN_PASSWORD;
}
