import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";

export async function GET() {
  const user = getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Belum login." }, { status: 401 });
  }
  return NextResponse.json({ user });
}
