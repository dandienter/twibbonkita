import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { hashPassword, newSessionToken, sessionExpiry } from "@/lib/auth";
import { setSessionCookie } from "@/lib/session";

export async function POST(req: Request) {
  let body: { username?: string; display_name?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
  }
  const username = String(body.username || "").trim().toLowerCase();
  const displayName = String(body.display_name || "").trim();
  const password = String(body.password || "");

  if (!/^[a-z0-9_]{3,20}$/.test(username)) {
    return NextResponse.json(
      { error: "Username harus 3-20 karakter: huruf kecil, angka, underscore." },
      { status: 400 }
    );
  }
  if (!displayName || displayName.length > 60) {
    return NextResponse.json(
      { error: "Nama tampilan wajib diisi (maks 60 karakter)." },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password minimal 6 karakter." },
      { status: 400 }
    );
  }

  const db = getDb();
  const exists = db.prepare("SELECT id FROM users WHERE username = ?").get(username);
  if (exists) {
    return NextResponse.json({ error: "Username sudah dipakai." }, { status: 409 });
  }

  const now = new Date().toISOString();
  const r = db
    .prepare(
      "INSERT INTO users (username, password_hash, display_name, created_at) VALUES (?, ?, ?, ?)"
    )
    .run(username, hashPassword(password), displayName, now);

  const token = newSessionToken();
  const expires = sessionExpiry();
  db.prepare(
    "INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)"
  ).run(token, r.lastInsertRowid, now, expires.toISOString());
  setSessionCookie(token, expires);

  return NextResponse.json({ ok: true, username, display_name: displayName });
}
