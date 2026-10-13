import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSessionToken, clearSessionCookie } from "@/lib/session";

export async function POST() {
  const token = getSessionToken();
  if (token) {
    getDb().prepare("DELETE FROM sessions WHERE token = ?").run(token);
  }
  clearSessionCookie();
  return NextResponse.json({ ok: true });
}
