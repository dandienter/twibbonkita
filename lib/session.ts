import { cookies } from "next/headers";
import { getDb } from "./db";

export interface SessionUser {
  id: number;
  username: string;
  display_name: string;
  avatar_url: string | null;
}

const COOKIE = "twibbonkita_session";

export function getSessionToken(): string | undefined {
  return cookies().get(COOKIE)?.value;
}

export function getSessionUser(): SessionUser | null {
  const token = getSessionToken();
  if (!token) return null;
  const db = getDb();
  const row = db
    .prepare(
      `SELECT u.id, u.username, u.display_name, u.avatar_url
       FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token = ? AND s.expires_at > datetime('now')`
    )
    .get(token) as SessionUser | undefined;
  return row ?? null;
}

export function setSessionCookie(token: string, expires: Date) {
  cookies().set(COOKIE, token, {
    httpOnly: true,
    path: "/",
    expires,
    sameSite: "lax",
  });
}

export function clearSessionCookie() {
  cookies().set(COOKIE, "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });
}
