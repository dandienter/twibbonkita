import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const test = scryptSync(password, salt, 64);
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(test);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function newSessionToken(): string {
  return randomBytes(32).toString("hex");
}

export function sessionExpiry(): Date {
  return new Date(Date.now() + 30 * 24 * 3600 * 1000);
}
