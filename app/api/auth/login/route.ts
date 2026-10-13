import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyPassword, newSessionToken, sessionExpiry } from "@/lib/auth";
import { setSessionCookie } from "@/lib/session";

export async function POST(req: Request) {
  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
  }
  const username = String(body.username || "").trim().toLowerCase();
  const password = String(body.password || "");

  const db = getDb();
  const user = db
    .prepare("SELECT id, username, password_hash, display_name FROM users WHERE username = ?")
    .get(username) as
    | { id: number; username: string; password_hash: string; display_name: string }
    | undefined;

  if (!user || !user.password_hash || !verifyPassword(password, user.password_hash)) {
    return NextResponse.json(
      { error: "Username atau password salah." },
      { status: 401 }
    );
  }

  const token = newSessionToken();
  const expires = sessionExpiry();
  const now = new Date().toISOString();
  db.prepare(
    "INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)"
  ).run(token, user.id, now, expires.toISOString());
  setSessionCookie(token, expires);

  return NextResponse.json({
    ok: true,
    username: user.username,
    display_name: user.display_name,
  });
}
