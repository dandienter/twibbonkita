import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT u.username, u.display_name, u.created_at,
              COUNT(c.id) AS campaign_count,
              COALESCE(SUM(c.use_count), 0) AS total_use
       FROM users u LEFT JOIN campaigns c ON c.creator_id = u.id
       GROUP BY u.id
       HAVING campaign_count > 0
       ORDER BY total_use DESC, campaign_count DESC
       LIMIT 24`
    )
    .all();
  return NextResponse.json({ creators: rows });
}
