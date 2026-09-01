import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function requireRole(allowed: ("admin" | "employee")[]) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Response("Unauthorized", { status: 401 });
  if (!allowed.includes((session.user as any).role)) {
    throw new Response("Forbidden", { status: 403 });
  }
  return session;
}